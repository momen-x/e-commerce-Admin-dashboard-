/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
"use client";

import { useEffect } from "react";

import { Loader2, Image, Calendar } from "lucide-react";
import Link from "next/link";
import { useGetBillboard } from "@/Hooks/useBillboard";
import DeleteBtn from "../edit/_components/deleteBtn";

const BillboardInfo = ({ storeId, id }: { storeId: string; id: string }) => {
  const { data: billboard, isLoading, error } = useGetBillboard(storeId, id);

  useEffect(() => {
    if (!storeId || !id) return;
  }, [storeId, id]);

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-3 text-gray-600">Loading billboard...</span>
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

  if (!billboard) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Billboard not found</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2 flex justify-between items-center">
          <p>{billboard.label}</p>
          <div>
          
            <p>
              <Link
                href={`/store/${storeId}/billboards/${id}/edit`}
                className="text-blue-500"
              >
                Edit
              </Link>
            </p>
              <div>
              <DeleteBtn billboardId={id} storeId={storeId} />
            </div>
          </div>
        </h1>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Created: {new Date(billboard.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Images */}
      {billboard.imageUrl?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Image />
            Images
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <img
              src={billboard.imageUrl}
              alt={`${billboard.label}`}
              className="rounded-lg border shadow-sm w-full h-48 object-cover"
            />
          </div>
        </div>
      )}

      {/* Details */}
      <div className=" rounded-lg p-4">
        <h3 className="font-semibold mb-2">Details</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p>ID</p>
            <p className="font-medium">{billboard.id}</p>
          </div>
          <div>
            <p>Created</p>
            <p className="font-medium">
              {new Date(billboard.createdAt).toLocaleString()}
            </p>
          </div>
          <div>
            <p>Updated</p>
            <p className="font-medium">
              {new Date(billboard.updatedAt).toLocaleString()}
            </p>
          </div>
          <div>
            <p>Images</p>
            <p className="font-medium">{billboard.imageUrl?.length || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillboardInfo;
