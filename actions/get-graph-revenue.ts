import prismadb from "@/lib/prismadb";

interface GraphData {
  name: string;
  total: number;
}

export const getGraphRevenue = async () => {
  const paidOrders = await prismadb.order.findMany({
    where: {
      isPaid: true,
    },
  });

  const monthlyRevnue: { [key: number]: number } = {};

  let revnueForOrder = 0;
  for (const order of paidOrders) {
    const month = order.createdAt.getMonth();

    revnueForOrder += order.total;

    monthlyRevnue[month] = (monthlyRevnue[month] || 0) + revnueForOrder;
  }

  const graphData: GraphData[] = [
    { name: "Jan", total: 0 },
    { name: "Feb", total: 0 },
    { name: "Mar", total: 0 },
    { name: "Apr", total: 0 },
    { name: "May", total: 0 },
    { name: "Jun", total: 0 },
    { name: "Jul", total: 0 },
    { name: "Aug", total: 0 },
    { name: "Sep", total: 0 },
    { name: "Oct", total: 0 },
    { name: "Nov", total: 0 },
    { name: "Dec", total: 0 },
  ];

  for (const month in monthlyRevnue) {
    graphData[parseInt(month)].total = monthlyRevnue[parseInt(month)];
  }

  return graphData;
};
