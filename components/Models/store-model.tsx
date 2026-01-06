"use client";

import { useState } from "react";
import { useStoreModel } from "@/Hooks/Use_store_model";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import  {AddStore, TAddStore } from "@/Validations/validation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DialogModel } from "@/components/DialogModel";
import { Plus } from "lucide-react";
import domin from "@/lib/domin";
import axios from "axios";
import toast from "react-hot-toast";

const StoreModel = () => {
  const { isOpen, onClose } = useStoreModel();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<TAddStore>({
    resolver: zodResolver(AddStore),
    defaultValues: {
      name: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: TAddStore) => {
    setIsLoading(true);

    try {
       await axios.post(`${domin}/api/store`, {
        name: data.name,
      });
      toast.success("Store created successfully!");

      form.reset();
      onClose();
    } catch (error) {
      console.error("Error creating store:", error);
      toast.error("Error creating store , some thing went wrong!" );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <DialogModel
      title="Create Store"
      description="Add a new store to manage products"
      isOpen={isOpen}
      onClose={handleClose}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Store Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter store name"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="gap-2">
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Create Store
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </DialogModel>
  );
};

export default StoreModel;
