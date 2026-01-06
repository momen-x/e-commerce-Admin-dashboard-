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
import { useDeleteCategory } from "@/Hooks/useCategory";

const DeleteBtn = ({
  CategoryId,
  storeId,
}: {
  CategoryId: string;
  storeId: string;
}) => {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const route = useRouter();
  const { mutate: deleteCategory } = useDeleteCategory();
  const onDeleted = async () => {
    setIsDeleting(true);
    try {
      deleteCategory(
        { storeId, categoryId: CategoryId as string },
        {
          onSuccess: () => {
            toast.success("Deleted successfully");
            route.refresh();
            setTimeout(() => {
              route.push(`/store/${storeId}/category`);
            }, 800);
          },
          onError: (error) => {
            // toast.error(error.message);
            toast.error(
              error.message.toLowerCase().includes("foreign key constraint")
                ? "This category contains products. Please move products to another category before deleting."
                : "An error occurred. Please try again."
            );
          },
        }
      );
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
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
            Are you sure you want to delete this category?
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
