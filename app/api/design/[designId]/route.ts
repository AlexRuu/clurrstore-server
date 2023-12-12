import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { designId: string } }
) {
  try {
    if (!params.designId) {
      return new NextResponse("A design ID is required", { status: 401 });
    }
    const product = await prismadb.design.findFirst({
      where: {
        id: params.designId,
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.log("[DESIGN_GET] error", error);
    return new NextResponse("Error retrieving design", { status: 500 });
  }
}
