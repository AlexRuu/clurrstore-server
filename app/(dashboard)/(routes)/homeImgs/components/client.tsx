"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { columns, HomeImgsColumn } from "./columns";
import { useRouter } from "next/navigation";

interface HomeImgsProps {
  data: HomeImgsColumn[];
}

const HomeImgsClient: React.FC<HomeImgsProps> = ({ data }) => {
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between m-5">
        <Heading title="Home Images" description="All Home Images" />
        <Button onClick={() => router.push("/homeImgs/new")}>Add New</Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="title" />
    </>
  );
};

export default HomeImgsClient;
