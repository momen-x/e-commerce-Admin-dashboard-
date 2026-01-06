import Link from "next/link";
import DeleteBtn from "./_components/deleteBtn";
import { ArrowLeft } from "lucide-react";
import EditColor from "./_components/EditColor";

const Page = async ({
  params,
}: {
  params: Promise<{ storeId: string; colorId: string }>;
}) => {
  const { storeId, colorId } = await params;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href={`/store/${storeId}/color`}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back to colors table</span>
          </Link>
        </div>

        {/* Page Title */}
        <h1 className="text-2xl font-bold mb-6">Manage Colors</h1>

        {/* ID Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className=" p-4 rounded-lg">
            <p className="text-sm  mb-1">Store ID</p>
            <p className="font-medium truncate">{storeId}</p>
          </div>
          <div className=" p-4 rounded-lg">
            <p className="text-sm  mb-1">Color ID</p>
            <p className="font-medium truncate">{colorId}</p>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 gap-6">
          {/* Delete Section */}

          {/* Edit Section */}
          <div className=" border rounded-xl p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold mb-4">Edit Color</h2>
              <div>
                <DeleteBtn colorId={colorId} storeId={storeId} />
              </div>
            </div>
            <EditColor />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
