import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const randomOrderNumber = () => {
  const beginning = Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000;
  const ending = Math.floor(Math.random() * (100000 - 10000 + 1)) + 10000;
  const orderNumber = `${beginning}-${ending}`;
  return orderNumber;
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    // const cookieStore = cookies();
    // const supabase = createClient(cookieStore);

    // const {
    //   data: { user },
    // } = await supabase.auth.getUser();

    const body = await req.json();

    if (!body || body.length === 0) {
      return new NextResponse("Please make sure your cart is not empty", {
        status: 400,
      });
    }

    let ids: string[] = [];
    let designIds: string[] = [];
    let styleIds: string[] = [];

    for (let i = 0; i < body.length; i++) {
      ids.push(body[i].id);
    }
    for (let i = 0; i < body.length; i++) {
      if (body[i].selectedDesign) {
        designIds.push(body[i].selectedDesign);
      }
    }
    for (let i = 0; i < body.length; i++) {
      if (body[i].selectedStyle) {
        styleIds.push(body[i].selectedStyle);
      }
    }

    const products = await prismadb.product.findMany({
      where: {
        id: { in: ids },
      },
      select: {
        id: true,
        title: true,
        price: true,
        stock: true,
        image: true,
        design: {
          where: { id: { in: designIds } },
          select: { id: true, title: true },
        },
        style: {
          where: { id: { in: styleIds } },
          select: { id: true, title: true },
        },
      },
    });

    products.forEach((item) => {
      const quantity = body.find((obj: any) => obj.id === item.id).quantity;
      // @ts-expect-error
      item.quantity = quantity;
    });

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    products.forEach((item) => {
      line_items.push({
        // @ts-expect-error
        quantity: item.quantity,
        price_data: {
          currency: "CAD",
          product_data: { name: item.title, images: [item.image[0].url] },
          unit_amount:
            item.style[0]?.title == "B Grade (-C$2.00)"
              ? (item.price - 2) * 100
              : item.price * 100,
        },
      });
    });

    let randomNumber = randomOrderNumber();

    let existingOrder = await prismadb.order.findFirst({
      where: {
        orderNumber: randomNumber,
      },
    });

    while (existingOrder) {
      randomNumber = randomOrderNumber();

      existingOrder = await prismadb.order.findFirst({
        where: {
          orderNumber: randomNumber,
        },
      });
    }

    const order = await prismadb.order.create({
      data: {
        orderNumber: randomNumber,
        isPaid: false,
        orderItem: {
          create: products.map((product) => ({
            product: {
              connect: {
                id: product.id,
              },
            },
            design:
              product.design.length > 0
                ? {
                    connect: {
                      id: product.design[0].id,
                    },
                  }
                : undefined,
            style:
              product.style.length > 0
                ? {
                    connect: {
                      id: product.style[0].id,
                    },
                  }
                : undefined,
            // @ts-expect-error
            quantity: product.quantity,
          })),
        },
      },
    });

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      billing_address_collection: "required",
      shipping_address_collection: { allowed_countries: ["CA", "US"] },
      automatic_tax: { enabled: true },
      shipping_options: [
        {
          shipping_rate_data: {
            display_name: "Standard Shipping",
            type: "fixed_amount",
            fixed_amount: {
              amount: 1200,
              currency: "CAD",
            },
          },
        },
      ],
      success_url: `${process.env.FRONTEND_STORE_URL}/order/${order.orderNumber}?success=true`,
      cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=true`,
      metadata: {
        orderNumber: order.orderNumber,
        orderId: order.id,
      },
    });
    return NextResponse.json(
      {
        url: session.url,
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.log("[CHECKOUT_ERROR]", error);
    return new NextResponse("Internal checkout error", { status: 500 });
  }
}
