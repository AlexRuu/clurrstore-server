import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { styleId: string } }
) {
  try {
    if (!params.styleId) {
      return new NextResponse("A style ID is required", { status: 401 });
    }
    const product = await prismadb.style.findFirst({
      where: {
        id: params.styleId,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[STYLE_GET] error", error);
    return new NextResponse("Error retrieving style", { status: 500 });
  }
}
