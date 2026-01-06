/* eslint-disable @next/next/no-img-element */
"use client";

import { Button } from "@/components/ui/button";
import { useGetProducts } from "@/Hooks/useProduct";
import { Plus, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
// import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ProductClient = () => {
  const [storeId, setStoreId] = useState<string>("");
  // const router = useRouter();

  // Initialize store from localStorage
  useEffect(() => {
    try {
      const storedStore = localStorage.getItem("store");
      if (storedStore) {
        const store = JSON.parse(storedStore);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setStoreId(store.id);
      }
    } catch (err) {
      console.error("Error parsing store from localStorage:", err);
      toast.error("Failed to load store data");
    }
  }, []);


  // Only fetch products when storeId is available
  const { data: products, isLoading, error } = useGetProducts(storeId);



  // Loading state - Show when either no storeId yet OR isLoading
  if (!storeId || isLoading) {
    return (
      <div className="mt-12">
        <div className="w-[80vw] m-auto">
          <div className="flex items-center gap-3 mb-4">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            <span className="text-gray-400">Loading Products...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="mt-12">
        <div className="w-full m-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-700 mb-2">
              <AlertCircle className="h-5 w-5" />
              <h3 className="font-semibold">Error</h3>
            </div>
            <p className="text-red-600 text-sm mb-3">{error.message}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
              className="border-red-300 text-red-700 hover:bg-red-50"
            >
              Try Again
            </Button>
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
              Products ({products?.length || 0})
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your store products
            </p>
          </div>
          {products && products.length > 0 && (
            <Link href={`products/new`} className="shrink-0">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add New Product
              </Button>
            </Link>
          )}
        </div>

        {/* Products List */}
        {!products || products.length === 0 ? (
          <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <Plus className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="font-medium text-lg mb-1">No products yet</h3>
            <p className="text-gray-500 text-sm mb-4">
              Get started by creating your first product
            </p>
            <Link href={`products/new`}>
              <Button className="flex items-center gap-2 mx-auto">
                <Plus className="h-4 w-4" />
                Create Product
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/store/${storeId}/products/${product.id}`}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                {/* Product Images */}
                {product.images && product.images.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mb-4">
                    
                      <div
                   
                        className="relative w-full h-[200px] rounded-md overflow-hidden border"
                      >
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    
                  </div>
                ) : (
                  <div className="w-full h-[200px] bg-gray-100 rounded-md flex items-center justify-center mb-4">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}

                {/* Product Info */}
                <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                <p className="text-xl font-bold text-green-600 mb-2">
                  ${(product.price / 100).toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">
                  Created: {new Date(product.createdAt).toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductClient;
