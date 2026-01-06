"use client";

import { useEffect } from "react";
import { Loader2, Calendar } from "lucide-react";
import Link from "next/link";
import { useGetCategory } from "@/Hooks/useCategory";
import DeleteBtn from "../edit/_components/deleteBtn";

const CategoryInfo = ({ storeId, id }: { storeId: string; id: string }) => {
  const { data: category, isLoading, error } = useGetCategory(storeId, id);

  useEffect(() => {
    if (!storeId || !id) return;
  }, [storeId, id]);

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-3 text-gray-600">Loading category...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">{error.message}</p>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Category not found</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="text-2xl font-bold mb-2 flex justify-between items-center">
          <p>{category.name}</p>
          <p>
            <Link
              href={`/store/${storeId}/category/${id}/edit`}
              className="text-blue-500"
            >
              Edit
            </Link>
          </p>
          <div>
            {" "}
            <DeleteBtn CategoryId={id} storeId={storeId} />
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Created: {new Date(category.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className=" rounded-lg p-4">
        <h3 className="font-semibold mb-2">Details</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p>ID</p>
            <p className="font-medium">{category.id}</p>
          </div>
          <div>
            <p>Created</p>
            <p className="font-medium">
              {new Date(category.createdAt).toLocaleString()}
            </p>
          </div>
          <div>
            <p>Updated</p>
            <p className="font-medium">
              {new Date(category.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryInfo;
