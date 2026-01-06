import Link from "next/link";
import ProductInfo from "./_components/ProductInfo";
import { ArrowLeft } from "lucide-react";

const page = async ({
  params,
}: {
  params: Promise<{ storeId: string; productId: string }>;
}) => {
  const { storeId } = await params;
  const { productId } = await params;

  return (
    <div>
      <div className="flex items-center justify-between mb-8 w-[50vw] m-auto mt-16">
        <Link
          href={`/store/${storeId}/products`}
          className="flex items-center gap-2 text-gray-600 hover:text-shadow-gray-400 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back to Products</span>
        </Link>
   
      </div>
 
      <ProductInfo id={productId} storeId={storeId} />
    </div>
  );
};

export default page;
