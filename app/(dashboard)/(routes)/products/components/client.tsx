"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { columns, ProductColumn } from "./columns";
import { useRouter } from "next/navigation";

interface ProductClientProps {
  data: ProductColumn[];
}

const ProductClient: React.FC<ProductClientProps> = ({ data }) => {
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between m-5">
        <Heading title="Products" description="All Products" />
        <Button onClick={() => router.push("/products/new")}>Add New</Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="title" />
    </>
  );
};

export default ProductClient;
