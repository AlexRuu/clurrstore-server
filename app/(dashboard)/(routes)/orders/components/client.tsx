import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";

import { OrdersColumn, columns } from "./columns";

interface OrderClientProps {
  data: OrdersColumn[];
}

export const OrdersClient: React.FC<OrderClientProps> = ({ data }) => {
  return (
    <>
      <Heading
        title={`Orders (${data.length})`}
        description="View orders for your store"
      />
      <Separator />
      <DataTable columns={columns} data={data} searchKey="firstName" />
    </>
  );
};
