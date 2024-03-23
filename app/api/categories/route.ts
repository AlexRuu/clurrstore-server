import prismadb from "@/lib/prismadb";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(_req: Request) {
  try {
    const categories = await prismadb.category.findMany({});
    return NextResponse.json(categories);
  } catch (error) {
    console.log("[CATEGORIES_GET] error", error);
    return new NextResponse("Could not fetch categories", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title } = body;

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!title) {
      return new NextResponse("A title is required", { status: 400 });
    }

    const category = await prismadb.category.create({
      data: {
        title,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORY_POST] ERROR", error);
    return new NextResponse("Category POST internal error", { status: 500 });
  }
}
