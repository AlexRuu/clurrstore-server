"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import Image from "next/image";

export type HomeImgsColumn = {
  id: string;
  url: string;
  createdAt: string;
};

export const columns: ColumnDef<HomeImgsColumn>[] = [
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      {
        const imgUrl = row.original.url;
        const alt = row.original.id;
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
  { accessorKey: "createdAt", header: "Date Created" },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
