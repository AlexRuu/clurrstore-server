import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined;
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new NextResponse(`Stripe Webhook Error: ${error.message}`, {
      status: 400,
    });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const address = session?.customer_details?.address;

  const addressComponents = [
    address?.line1,
    address?.line2,
    address?.city,
    address?.state,
    address?.postal_code,
    address?.country,
  ];

  const addressString = addressComponents.filter((c) => c !== null).join(", ");
  if (event.type === "checkout.session.completed") {
    const order = await prismadb.order.update({
      where: {
        id: session?.metadata?.orderId,
      },
      data: {
        isPaid: true,
        address: addressString,
        phone: session?.customer_details?.phone || "",
      },
      include: {
        orderItem: true,
      },
    });

    const designData: string[] = [];
    for (let x = 0; x < order.orderItem.length; x++) {
      let toInput: any = {};
      if (order.orderItem[x].designId != null) {
        toInput["id"] = order.orderItem[x].designId;
        toInput["quantity"] = order.orderItem[x].quantity;
        designData.push(toInput);
      }
    }

    console.log(designData);
    console.log(order.orderItem);

    await prismadb.$transaction(async (tx) => {
      for (const product of order.orderItem) {
        await tx.product.update({
          where: {
            id: product.productId,
          },
          data: {
            stock: {
              decrement: product.quantity,
            },
          },
        });
      }

      for (const design of designData) {
        await tx.design.update({
          where: {
            id: design.id,
          },
          data: {
            stock: {
              decrement: design.quantity,
            },
          },
        });
      }
    });
  }
  return new NextResponse(null, { status: 200 });
}
