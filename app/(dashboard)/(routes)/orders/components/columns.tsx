"use client";

import { ColumnDef } from "@tanstack/react-table";

export type OrdersColumn = {
  id: string;
  orderNumber: string;
  firstName?: string;
  lastName?: string;
  address: string;
  isPaid: boolean;
  total: string;
  createdAt: string;
};

export const columns: ColumnDef<OrdersColumn>[] = [
  {
    accessorKey: "orderNumber",
    header: "Order Number",
  },
  {
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  { accessorKey: "address", header: "Address" },
  {
    accessorKey: "total",
    header: "Total Price",
  },
  {
    accessorKey: "isPaid",
    header: "Paid",
  },
  {
    accessorKey: "createdAt",
    header: "Order Date",
  },
];
