import prismadb from "@/lib/prismadb";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      price,
      image,
      stock,
      detail,
      design,
      style,
      categoryId,
      isFeatured,
      isArchived,
      description,
    } = body;

    const supabase = createServerComponentClient({ cookies });
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!title) {
      return new NextResponse("Please provide a title", { status: 400 });
    }

    if (!price) {
      return new NextResponse("Please provide a price", { status: 400 });
    }

    if (!image || !image.length) {
      return new NextResponse("Image(s) required", { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse("Please choose a category", { status: 400 });
    }

    if (!stock) {
      return new NextResponse("Please provide stock", { status: 400 });
    }

    if (!description) {
      return new NextResponse("Please provide a description", { status: 400 });
    }

    const product = await prismadb.product.create({
      data: {
        title,
        price,
        stock,
        categoryId,
        isArchived,
        isFeatured,
        description,
        detail: {
          createMany: {
            data: [...detail.map((item: { text: string }) => item)],
          },
        },
        design: {
          createMany: {
            data: [
              ...design.map((item: { title: string; stock: number }) => item),
            ],
          },
        },
        style: {
          createMany: {
            data: [...style.map((item: { title: string }) => item)],
          },
        },
        image: {
          createMany: {
            data: [...image.map((img: { url: string }) => img)],
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
