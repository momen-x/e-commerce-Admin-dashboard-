import Link from "next/link";
import DeleteBtn from "./_components/deleteBtn";
import EditBillBoard from "./_components/EditBillboard";
import { ArrowLeft } from "lucide-react";

const Page = async ({
  params,
}: {
  params: Promise<{ storeId: string; billboardId: string }>;
}) => {
  const { storeId, billboardId } = await params;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href={`/store/${storeId}/billboards`}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back to Billboards</span>
          </Link>
        </div>

        {/* Page Title */}
        <h1 className="text-2xl font-bold mb-6">Manage Billboard</h1>

        {/* ID Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className=" p-4 rounded-lg">
            <p className="text-sm  mb-1">Store ID</p>
            <p className="font-medium truncate">{storeId}</p>
          </div>
          <div className=" p-4 rounded-lg">
            <p className="text-sm  mb-1">Billboard ID</p>
            <p className="font-medium truncate">{billboardId}</p>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 gap-6">
          {/* Delete Section */}

          {/* Edit Section */}
          <div className=" border rounded-xl p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold mb-4">Edit Billboard</h2>
              <div>
                <DeleteBtn billboardId={billboardId} storeId={storeId} />
              </div>
            </div>
            <EditBillBoard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
