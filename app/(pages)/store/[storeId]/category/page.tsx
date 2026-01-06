import APIAlert from "@/app/_components/API-Alert";
import domin from "@/lib/domin";
import { Code } from "lucide-react";
import CategoryClient from "./_components/CategoryClient";

const CategoriesPage = async ({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) => {
  const { storeId } = await params;
  return (
    <div className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Code className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-bold">Categories API</h1>
          </div>
          <p className="text-gray-600">
            API endpoints for managing categories in a store. Replace
            placeholders with actual IDs.
          </p>
        </div>

        {/* Main Layout */}
        <div className="">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className=" border p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Categories</h2>
              <CategoryClient />
            </div>
          </div>

          {/* API Sidebar */}
          <div className="lg:col-span-1">
            <div className=" rounded-lg border p-6">
              <h3 className="font-semibold mb-4">API Reference</h3>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">
                    Get All
                  </h4>
                  <APIAlert
                    description={`${domin}/api/${storeId}/category`}
                    title="GET"
                    variant="public"
                  />
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">
                    Create
                  </h4>
                  <APIAlert
                    description={`${domin}/api/${storeId}/category`}
                    title="POST"
                    variant="admin"
                  />
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">
                    Get Single
                  </h4>
                  <APIAlert
                    description={`${domin}/api/${storeId}/category/[id]`}
                    title="GET"
                    variant="public"
                  />
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">
                    Update
                  </h4>
                  <APIAlert
                    description={`${domin}/api/${storeId}/category/[id]`}
                    title="PATCH"
                    variant="admin"
                  />
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">
                    Delete
                  </h4>
                  <APIAlert
                    description={`${domin}/api/${storeId}/category/[id]`}
                    title="DELETE"
                    variant="admin"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
