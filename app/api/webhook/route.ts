import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";

interface DesignData {
  id: string;
  quantity: number;
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
        // @ts-expect-error
        total: session?.amount_total,
        tax: session?.total_details?.amount_tax,
        shipping: session.shipping_cost?.amount_subtotal,
        isPaid: true,
        address: addressString,
        phone: session?.customer_details?.phone || "",
      },
      include: {
        orderItem: true,
      },
    });

    const designInfo: DesignData[] = [];
    // @ts-expect-error
    for (let x = 0; x < order.orderItem.length; x++) {
      let toInput: any = {};
      // @ts-expect-error
      if (order.orderItem[x].designId != null) {
        // @ts-expect-error
        toInput["id"] = order.orderItem[x].designId;
        // @ts-expect-error
        toInput["quantity"] = order.orderItem[x].quantity;
        designInfo.push(toInput);
      }
    }
    await prismadb.$transaction(async (tx) => {
      // @ts-expect-error
      const item = order.orderItem;
      for (let i = 0; i < item.length; i++) {
        await tx.product.update({
          where: {
            id: item[i].productId,
          },
          data: { stock: { decrement: item[i].quantity } },
        });
      }
      for (let j = 0; j < designInfo.length; j++) {
        await tx.design.update({
          where: {
            id: designInfo[j].id,
          },
          data: {
            stock: {
              decrement: designInfo[j].quantity,
            },
          },
        });
      }
    });
  }
  return new NextResponse(null, { status: 200 });
}
