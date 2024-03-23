import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";

import { SubscribersColumn, columns } from "./columns";

interface SubscribersClientProps {
  data: SubscribersColumn[];
}

export const SubscribersClient: React.FC<SubscribersClientProps> = ({
  data,
}) => {
  return (
    <>
      <Heading
        title={`Subscribers (${data.length})`}
        description="View subscribers for your store"
      />
      <Separator />
      <DataTable columns={columns} data={data} searchKey="email" />
    </>
  );
};
