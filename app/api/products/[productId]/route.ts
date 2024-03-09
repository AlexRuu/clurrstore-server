import prismadb from "@/lib/prismadb";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const product = await prismadb.product.findFirst({
      where: {
        id: params.productId,
      },
      include: {
        image: true,
        design: true,
        style: true,
        category: true,
        detail: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[SINGLE_PRODUCT_GET] error", error);
    return new NextResponse("Could not get product", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const body = await req.json();
    const {
      title,
      price,
      image,
      stock,
      design,
      style,
      categoryId,
      isFeatured,
      isArchived,
      description,
      detail,
    } = body;

    if (!user) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.productId) {
      return new NextResponse("Please provide a product ID", { status: 400 });
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

    await prismadb.product.update({
      where: { id: params.productId },
      data: {
        title,
        price,
        image: {
          deleteMany: {},
        },
        stock,
        design: {
          deleteMany: {},
        },
        style: {
          deleteMany: {},
        },
        detail: {
          deleteMany: {},
        },
        categoryId,
        isFeatured,
        isArchived,
        description,
      },
    });

    const product = await prismadb.product.update({
      where: { id: params.productId },
      data: {
        image: {
          createMany: {
            data: [...image.map((img: { url: string }) => img)],
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
        detail: {
          createMany: {
            data: [...detail.map((item: { text: string }) => item)],
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_PATCH] ERROR", error);
    return new NextResponse("Product update internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.productId) {
      return new NextResponse("Please provide a product ID", { status: 400 });
    }

    const product = await prismadb.product.deleteMany({
      where: {
        id: params.productId,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_DELETE] ERROR", error);
    return new NextResponse("Product delete internal error", { status: 500 });
  }
}
