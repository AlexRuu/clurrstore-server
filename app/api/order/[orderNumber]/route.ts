import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { orderNumber: string } }
) {
  try {
    if (!params.orderNumber) {
      return new NextResponse("Please provide an order ID", { status: 401 });
    }

    const order = await prismadb.order.findFirst({
      where: {
        orderNumber: params.orderNumber,
      },
      include: {
        orderItem: {
          include: {
            product: { include: { image: true } },
            design: true,
            style: true,
          },
        },
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.log("[ORDER_GET] error", error);
    return new NextResponse("Error retrieving order", { status: 500 });
  }
}
