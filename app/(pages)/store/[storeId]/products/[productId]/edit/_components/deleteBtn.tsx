"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useDeleteProduct } from "@/Hooks/useProduct";

const DeleteBtn = ({
  productId,
  storeId,
}: {
  productId: string;
  storeId: string;
}) => {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const route = useRouter();
  const { mutate: deleteProduct } = useDeleteProduct();
  const onDeleted = async () => {
    setIsDeleting(true);
    try {
      deleteProduct(
        { storeId, productId: productId as string },
        {
          onSuccess: () => {
            toast.success("Deleted successfully");
            route.refresh();
            setTimeout(() => {}, 800);
            route.push(`/store/${storeId}/products`);
          },
          onError: (error) => {
            toast.error(
              error instanceof Error ? error.message : "Delete failed"
            );
          },
        }
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed");
    } finally {
      setIsDeleting(false);
      setOpen(false);
    }
  };

  return (
    <>
      <Button variant="destructive" onClick={() => setOpen(true)} size="sm">
        Delete
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <DialogTitle>Confirm Delete</DialogTitle>
            </div>
          </DialogHeader>

          <p className="text-gray-600">
            Are you sure you want to delete this Product?
          </p>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={onDeleted}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeleteBtn;
