"use client";

import { ColumnDef } from "@tanstack/react-table";

export type SubscribersColumn = {
  id: string;
  email: string;
  createdAt: string;
};

export const columns: ColumnDef<SubscribersColumn>[] = [
  { accessorKey: "email", header: "Email" },
  {
    accessorKey: "createdAt",
    header: "Subscribe Date",
  },
];
