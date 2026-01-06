"use client";

import { useEffect, useState } from "react";
import { IStore } from "../interface/interface";
import DeleteStoreBtn from "./DeleteStoreBtn";
import InputWithValidation from "@/components/ui/InputWithValidation";
import { useForm } from "react-hook-form";
import  {AddStore, TAddStore } from "@/Validations/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import domin from "@/lib/domin";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const ClientSetting = () => {
  const router = useRouter();
  const [store, setStore] = useState<IStore | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get store from localStorage AFTER component mounts (client-side only)
  useEffect(() => {
    const storedStore = localStorage.getItem("store");
    if (storedStore) {
      try {
        const parsedStore: IStore = JSON.parse(storedStore);
        setStore(parsedStore);
      } catch (error) {
        console.error("Error parsing stored store:", error);
        localStorage.removeItem("store");
      }
    } else {
      // No store in localStorage - redirect or show message
      toast.error("No store selected");
      router.push("/dashboard");
    }
  }, [router]);

  const form = useForm<TAddStore>({
    resolver: zodResolver(AddStore),
    defaultValues: {
      name: store?.name || "",
    },
    mode: "onBlur",
  });

  // Update form when store loads
  useEffect(() => {
    if (store?.name) {
      form.reset({ name: store.name });
    }
  }, [store, form]);

  const editStore = async (data: TAddStore) => {
    if (!store?.id) {
      toast.error("No store ID available");
      return;
    }

    if (data.name === store.name) {
      toast.error("Store name hasn't changed");
      return;
    }

    setIsLoading(true);
    try {
      await axios.put(`${domin}/api/store/${store.id}`, data);

      // Update local storage and state
      const updatedStore = { ...store, name: data.name };
      localStorage.setItem("store", JSON.stringify(updatedStore));
      setStore(updatedStore);

      toast.success("Store name updated successfully");
      form.reset({ name: data.name }); // Reset form with new value
    } catch (error) {
      console.error("Edit error:", error);
      toast.error(
        error instanceof AxiosError
          ? error.response?.data?.message
          : "Failed to update store name"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!store) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-400">Loading store information...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Store Settings</h2>
        <DeleteStoreBtn id={store.id} text="Delete Store" />
      </div>

      <div className=" backdrop-blur-sm rounded-xl p-6 border border-gray-700/30">
        <h3 className="text-lg font-semibold mb-4">General Information</h3>

        <form onSubmit={form.handleSubmit(editStore)} className="space-y-4">
        

          <InputWithValidation
            label="Store Name"
            register={form.register}
            name="name"
            error={form.formState.errors.name?.message}
            disabled={isLoading}
          />

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset({ name: store.name })}
              disabled={isLoading}
            >
              Reset
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientSetting;
