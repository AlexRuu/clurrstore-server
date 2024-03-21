interface PageHeaderProps {
  headerTitle?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ headerTitle }) => {
  return (
    <>
      <div className="w-full mb-10 flex justify-center flex-nowrap mt-7">
        <h1 className="font-medium text-3xl flex mb-4">{headerTitle}</h1>
      </div>
    </>
  );
};

export default PageHeader;
