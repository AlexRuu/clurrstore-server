import prismadb from "@/lib/prismadb";

import { format } from "date-fns";
import { HomeImgsColumn } from "./components/columns";
import HomeImgsClient from "./components/client";

const HomeImgsPage = async () => {
  const homeimgs = await prismadb.homeImage.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedHomeImgs: HomeImgsColumn[] = homeimgs.map((item) => ({
    id: item.id,
    url: item.url,
    createdAt: format(item.createdAt, "MMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-4 pt-6">
        <HomeImgsClient data={formattedHomeImgs} />
      </div>
    </div>
  );
};

export default HomeImgsPage;
