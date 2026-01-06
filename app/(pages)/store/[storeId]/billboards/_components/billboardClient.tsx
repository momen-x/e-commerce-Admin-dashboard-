/* eslint-disable @next/next/no-img-element */
"use client";

import { Button } from "@/components/ui/button";
import { useGetBillboards } from "@/Hooks/useBillboard";
import { Plus, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const BillboardClient = () => {
  const [storeId, setStoreId] = useState<string>("");
  const { data: billboards, isLoading, error } = useGetBillboards(storeId!);
  const router = useRouter();

  // Single useEffect for initialization
  useEffect(() => {
    const initializeStore = (): string => {
      try {
        const storedStore = localStorage.getItem("store");
        if (storedStore) {
          const store = JSON.parse(storedStore);
          setStoreId(store.id);
          return store.id;
        }
        return "";
      } catch (err) {
        console.error("Error parsing store from localStorage:", err);
        toast.error("Failed to load store data");
        return "";
      }
    };

    const storeId = initializeStore();
    if (storeId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStoreId(storeId);
    }
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="mt-12">
        <div className="w-[80vw] m-auto">
          <div className="flex items-center gap-3 mb-4">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            <span className="text-gray-400">Loading billboards...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="mt-12">
        <div className="w-[80vw] m-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-700 mb-2">
              <AlertCircle className="h-5 w-5" />
              <h3 className="font-semibold">Error</h3>
            </div>
            <p className="text-red-600 text-sm mb-3">{error.message}</p>
            {storeId && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.refresh()}
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                Try Again
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // No store selected state
  if (!storeId) {
    return (
      <div className="mt-12">
        <div className="w-[80vw] m-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-yellow-700 mb-2">
              <AlertCircle className="h-5 w-5" />
              <h3 className="font-semibold">No Store Selected</h3>
            </div>
            <p className="text-yellow-600 text-sm">
              Please select a store from the dashboard to manage billboards.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <div className="w-full m-auto flex flex-col gap-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="font-bold text-3xl sm:text-4xl">
              Billboards ({billboards?.length})
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your store billboards and promotions
            </p>
          </div>
          {billboards && billboards.length > 0 && (
            <Link href={`billboards/new`} className="shrink-0">
              <Button className="flex items-center gap-2" disabled={!storeId}>
                <Plus className="h-4 w-4" />
                Add New Billboard
              </Button>
            </Link>
          )}
        </div>

        {/* Billboards List */}
        {billboards && billboards.length === 0 ? (
          <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center">
            <div className="mx-auto w-12 h-12 rounded-full  flex items-center justify-center mb-3">
              <Plus className="h-6 w-6 " />
            </div>
            <h3 className="font-medium text-lg mb-1">No billboards yet</h3>
            <p className="text-gray-500 text-sm mb-4">
              Get started by creating your first billboard
            </p>
            <Link href={`billboards/new`}>
              <Button className="flex items-center gap-2 mx-auto">
                <Plus className="h-4 w-4" />
                Create Billboard
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {billboards?.map((billboard) => (
              <div
                key={billboard.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <Link href={`billboards/${billboard.id}`} className="block">
                  <div className="aspect-video 00 rounded mb-3 overflow-hidden">
                    <img
                      src={billboard.imageUrl}
                      alt={billboard.label}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>

                <h3 className="font-semibold text-lg mb-1">
                  {billboard.label}
                </h3>
                <p className="text-sm text-gray-500">
                  Created: {new Date(billboard.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BillboardClient;
