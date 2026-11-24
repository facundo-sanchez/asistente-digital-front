
interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const HomePage = async ({ searchParams }: PageProps) => {
  const params = await searchParams;


  return (
    <>
      home
    </>
  );
};

export default HomePage;
