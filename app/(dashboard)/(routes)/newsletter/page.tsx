import prismadb from "@/lib/prismadb";

import { format } from "date-fns";
import { SubscribersColumn } from "./components/columns";
import { SubscribersClient } from "./components/client";

const NewsletterPage = async () => {
  const subscribers = await prismadb.newsletter.findMany({
    orderBy: {
      email: "asc",
    },
  });

  const formattedSubscribers: SubscribersColumn[] = subscribers.map((item) => ({
    id: item.id,
    email: item.email,
    subscribed: item.subscribed,
    createdAt: format(item.createdAt, "MMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-4 pt-6">
        <SubscribersClient data={formattedSubscribers} />
      </div>
    </div>
  );
};

export default NewsletterPage;
