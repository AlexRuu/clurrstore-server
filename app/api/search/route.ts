import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const searchQuery = searchParams.get("searchQuery") || undefined;
    let editedSearchQuery;
    if (searchQuery) {
      editedSearchQuery = searchQuery.replace(/-/g, " ");
    }

    const products = await prismadb.product.findMany({
      where: {
        title: {
          contains: editedSearchQuery,
          mode: "insensitive",
        },
      },
      include: {
        image: true,
        detail: true,
        design: true,
        style: true,
        category: true,
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log("[SEARCH_GET] error", error);
    return new NextResponse("Internal search error", { status: 500 });
  }
}
