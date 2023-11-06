"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import Image from "next/image";

export type ProductColumn = {
  id: string;
  title: string;
  price: string;
  category: string;
  stock: number;
  isArchived: boolean;
  isFeatured: boolean;
  image?: string;
  design?: number;
  createdAt: string;
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      {
        const imgUrl = row.original.image;
        const alt = row.original.title;
        if (imgUrl) {
          return (
            <div>
              <Image src={imgUrl} alt={alt} width={50} height={50} />
            </div>
          );
        }
      }
    },
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  { accessorKey: "design", header: "Design Amount" },
  { accessorKey: "style", header: "Style Amount" },
  { accessorKey: "stock", header: "Inventory" },
  { accessorKey: "isArchived", header: "Archived?" },
  { accessorKey: "isFeatured", header: "Featured?" },
  { accessorKey: "createdAt", header: "Date Created" },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
