import { IStore } from "@/app/interface/interface";
import domin from "@/lib/domin";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const StoreId = async ({ params }: { params: Promise<{ storeId: string }> }) => {
  const { storeId } = await params;
  let store: null | IStore = null;
  if (!storeId) {
    redirect("/");
  }

  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  try {
    const responce = await fetch (`${domin}/api/store/${storeId}`)
    if (!responce) {
      throw new Error("You don't have access to this store");
    } else {
      store = await responce.json();
    }

    if (!store) {
      throw new Error("The store you are looking for does not exist");
    }
  } catch (error) {
    console.error("Error loading store:", error);
    throw new Error("Error loading store");
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-4">{store.name}</h1>

        <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-300 mb-2">
                Store Details
              </h3>
              <p className="text-gray-400">Name: {store.name}</p>
              <p className="text-gray-400">ID: {store.id}</p>
              <p className="text-gray-400">
                Created: {new Date(store.createdAt).toLocaleDateString()}
              </p>
              <p className="text-gray-400">
                Updated: {new Date(store.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreId;
