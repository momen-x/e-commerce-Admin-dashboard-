import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CategoryInfo from "./_components/CategoryInfo";

const page = async ({
  params,
}: {
  params: Promise<{ storeId: string; categoryId: string }>;
}) => {
  const { storeId } = await params;
  const { categoryId } = await params;

  return (
    <div className="h-screen  flex justify-center flex-col items-center">
      <div className="flex items-center justify-between mb-8">
        <Link
          href={`/store/${storeId}/category`}
          className="flex items-center gap-2 text-gray-600 hover:text-shadow-gray-400 transition-colors text-center"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back to Categories</span>
        </Link>
      </div>
      <CategoryInfo id={categoryId} storeId={storeId} />
    </div>
  );
};

export default page;
