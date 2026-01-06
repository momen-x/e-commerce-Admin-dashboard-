import Link from "next/link";
import BillboardInfo from "./_components/BillboardInfo";
import { ArrowLeft } from "lucide-react";

const page = async ({
  params,
}: {
  params: Promise<{ storeId: string; billboardId: string }>;
}) => {
  const { storeId } = await params;
  const { billboardId } = await params;

  return (
    <div>
      <div className="flex items-center justify-between mb-8 w-[50vw] m-auto mt-16">
        <Link
          href={`/store/${storeId}/billboards`}
          className="flex items-center gap-2 text-gray-600 hover:text-shadow-gray-400 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back to Billboards</span>
        </Link>
   
      </div>
 
      <BillboardInfo id={billboardId} storeId={storeId} />
    </div>
  );
};

export default page;
