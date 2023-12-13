import prismadb from "@/lib/prismadb";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(_req: Request) {
  try {
    const homeImg = await prismadb.homeImage.findMany({});
    return NextResponse.json(homeImg);
  } catch (error) {
    console.log("[HOME_IMAGE_GET] error", error);
    return new NextResponse("Could not fetch home image", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url } = body;

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const product = await prismadb.homeImage.create({
      data: {
        url,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[HOME_IMAGE_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
