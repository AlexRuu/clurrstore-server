// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import Stripe from "stripe";
import { NextResponse } from "next/server";

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
    const body = await req.json();
    const { cart, profile } = body;

    if (!cart || cart.length === 0) {
      return new NextResponse("Please make sure your cart is not empty", {
        status: 400,
      });
    }

    const products = [];

    await prismadb.order.deleteMany({
      where: {
        isPaid: false,
        total: 0,
        shipping: 0,
      },
    });

    await prismadb.$transaction(async (tx) => {
      for (let i = 0; i < cart.length; i++) {
        const obj = await tx.product.findFirst({
          where: {
            id: cart[i].id,
            design: cart[i].selectedDesign
              ? { some: { id: cart[i]?.selectedDesign } }
              : undefined,
            style: cart[i].selectedStyle
              ? { some: { id: cart[i]?.selectedStyle } }
              : undefined,
          },
          select: {
            id: true,
            title: true,
            price: true,
            stock: true,
            image: true,
            design: {
              where: { id: cart[i]?.selectedDesign },
              select: { id: true, title: true },
            },
            style: {
              where: { id: cart[i]?.selectedStyle },
              select: { id: true, title: true },
            },
          },
        });
        obj["quantity"] = cart[i].quantity;
        products.push(obj);
      }
    });

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    products.forEach((item) => {
      line_items.push({
        quantity: item.quantity,
        price_data: {
          currency: "CAD",
          product_data: {
            name: item.title,
            images: [item.image[0].url],
          },
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
        profile: profile && {
          connect: {
            id: profile,
          },
        },
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
              product?.style.length > 0
                ? {
                    connect: {
                      id: product?.style[0].id,
                    },
                  }
                : undefined,
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
      success_url: `${process.env.FRONTEND_STORE_URL}/order/${order.orderNumber}?success=1`,
      cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
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
