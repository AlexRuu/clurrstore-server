import prismadb from "@/lib/prismadb";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { homeImgId: string } }
) {
  try {
    const homeImage = await prismadb.homeImage.findFirst({
      where: {
        id: params.homeImgId,
      },
    });

    return NextResponse.json(homeImage);
  } catch (error) {
    console.log("[HOME_IMAGE_GET] error", error);
    return new NextResponse("Could not get home image", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { homeImgId: string } }
) {
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const body = await req.json();
    const { url } = body;

    if (!user) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const homeImage = await prismadb.homeImage.updateMany({
      where: {
        id: params.homeImgId,
      },
      data: {
        url,
      },
    });

    return NextResponse.json(homeImage);
  } catch (error) {
    console.log("[HOME_IMAGE_PATCH] ERROR", error);
    return new NextResponse("Product update internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { homeImgId: string } }
) {
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const product = await prismadb.homeImage.deleteMany({
      where: {
        id: params.homeImgId,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_DELETE] ERROR", error);
    return new NextResponse("Product delete internal error", { status: 500 });
  }
}
