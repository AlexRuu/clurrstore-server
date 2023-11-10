import prismadb from "@/lib/prismadb";
import ProductForm from "./components/product-form";

const ProductPage = async ({ params }: { params: { productId: string } }) => {
  const product = await prismadb.product.findUnique({
    where: {
      id: params.productId,
    },
    include: {
      image: true,
      style: true,
      design: true,
      detail: true,
    },
  });

  const categories = await prismadb.category.findMany({});

  return (
    <div className="flex flex-col p-4 pt-6 w-full">
      <ProductForm initialData={product} categories={categories} />
    </div>
  );
};

export default ProductPage;
