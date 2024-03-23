"use client";

import { ColumnDef } from "@tanstack/react-table";

export type SubscribersColumn = {
  id: string;
  email: string;
  subscribed: boolean;
  createdAt: string;
};

export const columns: ColumnDef<SubscribersColumn>[] = [
  { accessorKey: "email", header: "Email" },
  { accessorKey: "subscribed", header: "Subscribed" },
  {
    accessorKey: "createdAt",
    header: "Subscribe Date",
  },
];
