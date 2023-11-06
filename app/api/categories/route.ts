import prismadb from "@/lib/prismadb";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title } = body;
    const supabase = createServerComponentClient({ cookies });
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
