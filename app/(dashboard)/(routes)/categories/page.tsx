import prismadb from "@/lib/prismadb";
import CategoryClient from "./components/client";

import { CategoryColumn } from "./components/columns";

import { format } from "date-fns";

const CategoriesPage = async () => {
  const categories = await prismadb.category.findMany({
    orderBy: {
      title: "desc",
    },
  });

  const formattedCategories: CategoryColumn[] = categories.map((item) => ({
    id: item.id,
    title: item.title,
    createdAt: format(item.createdAt, "MMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-4 pt-6">
        <CategoryClient data={formattedCategories} />
      </div>
    </div>
  );
};

export default CategoriesPage;
