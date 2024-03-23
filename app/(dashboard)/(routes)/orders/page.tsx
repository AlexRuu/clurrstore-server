import prismadb from "@/lib/prismadb";

import { format } from "date-fns";
import { OrdersColumn } from "./components/columns";
import { OrdersClient } from "./components/client";

const OrdersPage = async () => {
  const orders = await prismadb.order.findMany({
    where: {
      isPaid: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: { profile: true },
  });

  const formattedOrders: OrdersColumn[] = orders.map((item) => ({
    id: item.id,
    orderNumber: item.orderNumber,
    firstName: item.profile?.firstName,
    lastName: item.profile?.lastName,
    address: item.address,
    isPaid: item.isPaid,
    total: item.total.toFixed(2),
    createdAt: format(item.createdAt, "MMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-4 pt-6">
        <OrdersClient data={formattedOrders} />
      </div>
    </div>
  );
};

export default OrdersPage;
