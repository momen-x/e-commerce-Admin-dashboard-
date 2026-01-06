import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import SizeInfo from "./_components/SizeInfo";

const page = async ({
  params,
}: {
  params: Promise<{ storeId: string; sizeId: string }>;
}) => {
  const { storeId } = await params;
  const { sizeId } = await params;

  return (
    <div className="h-screen  flex justify-center flex-col items-center">
      <div className="flex items-center justify-between mb-8">
        <Link
          href={`/store/${storeId}/size`}
          className="flex items-center gap-2 text-gray-600 hover:text-shadow-gray-400 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back to sizes table</span>
        </Link>
      </div>
      <SizeInfo id={sizeId} storeId={storeId} />
    </div>
  );
};

export default page;
