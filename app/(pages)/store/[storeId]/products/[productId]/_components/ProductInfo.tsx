/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
"use client";

import { useEffect } from "react";
import {
  Loader2,
  Image,
  Calendar,
  Tag,
  Palette,
  Ruler,
  DollarSign,
  Star,
  Archive,
  TrendingUp,
  Package,
  Hash,
} from "lucide-react";
import Link from "next/link";
import { useGetProduct } from "@/Hooks/useProduct";
import DeleteBtn from "../edit/_components/deleteBtn";
import { useGetCategory } from "@/Hooks/useCategory";
import { useGetColor } from "@/Hooks/useColor";
import { useGetSize } from "@/Hooks/useSize";

const ProductInfo = ({ storeId, id }: { storeId: string; id: string }) => {
  const { data: product, isLoading, error } = useGetProduct(storeId, id);
  const { data: category } = useGetCategory(storeId, product?.categoryId || "");
  const { data: size } = useGetSize(storeId, product?.sizeId || "");
  const { data: color } = useGetColor(storeId, product?.colorId || "");
  useEffect(() => {
    if (!storeId || !id) return;
  }, [storeId, id]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600 font-medium">
          Error loading product: {error.message}
        </p>
        <Link
          href={`/store/${storeId}/products`}
          className="text-blue-500 text-sm hover:underline mt-2 inline-block"
        >
          ← Back to Products
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Package className="h-16 w-16 text-gray-300 mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          Product Not Found
        </h3>
        <p className="text-gray-500 mb-4">
          The product you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
        <Link
          href={`/store/${storeId}/products`}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          View All Products
        </Link>
      </div>
    );
  }

  // Format price
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(product.price);

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      {/* Header with Actions */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {product.name}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Added: {new Date(product.createdAt).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Hash className="h-4 w-4" />
                ID: {product.id}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/store/${storeId}/products/${id}/edit`}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              Edit Product
            </Link>
            <DeleteBtn productId={id} storeId={storeId} />
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {product.isFeatured && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
              <Star className="h-3 w-3" />
              Featured
            </span>
          )}
          {product.isArchived && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
              <Archive className="h-3 w-3" />
              Archived
            </span>
          )}
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            <DollarSign className="h-3 w-3" />
            {formattedPrice}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Images */}
        <div>
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
              <Image className="h-5 w-5" />
              Product Images ({product.images.length})
            </h2>
            {product.images.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {product.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square overflow-hidden rounded-lg border border-gray-200">
                      <img
                        src={image}
                        alt={`${product.name} - Image ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Image className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No images available</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="space-y-6">
          {/* Product Information Card */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Product Information
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Product Name</p>
                <p className="font-medium text-gray-900">{product.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    Price
                  </p>
                  <p className="font-medium text-gray-900 text-lg">
                    {formattedPrice}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Product ID</p>
                  <p className="font-mono text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded">
                    {product.id}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Category, Size & Color */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="font-medium mb-3 flex items-center gap-2 text-gray-700">
                <Tag className="h-4 w-4" />
                Category
              </h4>
              {product.categoryId ? (
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                  <span className="font-medium">{category?.name}</span>
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No category assigned</p>
              )}
            </div>

            {/* Size */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="font-medium mb-3 flex items-center gap-2 text-gray-700">
                <Ruler className="h-4 w-4" />
                Size
              </h4>
              {size ? (
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span className="font-medium">{size?.name}</span>
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No size assigned</p>
              )}
            </div>

            {/* Color */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="font-medium mb-3 flex items-center gap-2 text-gray-700">
                <Palette className="h-4 w-4" />
                Color
              </h4>
              {color ? (
                <div className="flex items-center gap-2">
                  <div
                    className="h-6 w-6 rounded-full border border-gray-300"
                    style={{ backgroundColor: color.value }}
                  />
                  <div>
                    <span className="font-medium block">{color.name}</span>
                    <span className="text-xs text-gray-500">{color.value}</span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No color assigned</p>
              )}
            </div>
          </div>

          {/* Timestamps */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Timestamps
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Created At</p>
                <p className="font-medium">
                  {new Date(product.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Last Updated</p>
                <p className="font-medium">
                  {new Date(product.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Store Information */}
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
            <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Store Information
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Store ID:</span>
                <span className="font-medium">{product.storeId}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
