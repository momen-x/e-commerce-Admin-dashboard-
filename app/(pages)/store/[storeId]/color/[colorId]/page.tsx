import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ColorInfo from "./_components/ColorInfo";

const page = async ({
  params,
}: {
  params: Promise<{ storeId: string; colorId: string }>;
}) => {
  const { storeId } = await params;
  const { colorId } = await params;

  return (
    <div className="h-screen  flex justify-center flex-col items-center">
      <div className="flex items-center justify-between mb-8">
        <Link
          href={`/store/${storeId}/color`}
          className="flex items-center gap-2 text-gray-600 hover:text-shadow-gray-400 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back to colors table</span>
        </Link>
      </div>
      <ColorInfo id={colorId} storeId={storeId} />
    </div>
  );
};

export default page;
