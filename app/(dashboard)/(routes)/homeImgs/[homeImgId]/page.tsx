import prismadb from "@/lib/prismadb";
import HomeImgForm from "./components/homeImg-form";

const HomeImgPage = async ({ params }: { params: { homeImgId: string } }) => {
  const homeImage = await prismadb.homeImage.findFirst({
    where: {
      id: params.homeImgId,
    },
  });

  return (
    <div className="flex flex-col p-4 pt-6">
      <HomeImgForm initialData={homeImage} />
    </div>
  );
};

export default HomeImgPage;
