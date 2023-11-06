import prismadb from "@/lib/prismadb";
import CategoryForm from "./components/category-form";

const CategoryPage = async ({ params }: { params: { categoryId: string } }) => {
  const category = await prismadb.category.findFirst({
    where: {
      id: params.categoryId,
    },
  });

  return (
    <div className="flex flex-col p-4 pt-6">
      <CategoryForm initialData={category} />
    </div>
  );
};

export default CategoryPage;
