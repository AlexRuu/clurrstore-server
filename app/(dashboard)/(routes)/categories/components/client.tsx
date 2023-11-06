"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { columns, CategoryColumn } from "./columns";
import { useRouter } from "next/navigation";

interface CategoryClientProps {
  data: CategoryColumn[];
}

const CategoryClient: React.FC<CategoryClientProps> = ({ data }) => {
  const router = useRouter();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="Categories" description="Categories" />
        <Button onClick={() => router.push("/categories/new")}>Add New</Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="title" />
    </>
  );
};

export default CategoryClient;
