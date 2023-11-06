import prismadb from "@/lib/prismadb";
import ProductClient from "./components/client";
import { ProductColumn } from "./components/columns";
import { formatter } from "@/lib/utils";
import { format } from "date-fns";

const ProductsPage = async () => {
  const products = await prismadb.product.findMany({
    include: {
      category: true,
      image: true,
      design: true,
      style: true,
    },
    orderBy: {
      title: "desc",
    },
  });

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    title: item.title,
    price: formatter.format(item.price),
    stock: item.stock,
    category: item.category.title,
    image: item.image[0].url,
    design: item.design.length,
    style: item.style.length,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div>
      <ProductClient data={formattedProducts} />
    </div>
  );
};

export default ProductsPage;
