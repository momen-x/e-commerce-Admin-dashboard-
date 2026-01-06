import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { IStore } from "../../interface/interface";
import { redirect } from "next/navigation";

const StorePage = async () => {
  const { userId } = await auth();
  let store: null | IStore = null;
  try {
    if (!userId) {
      throw new Error("You must be logged in to access this page");
    }
    store = await prisma.store.findFirst({
      where: {
        userID: userId,
      },
    });

    if (!store) {
      throw new Error("You don't have access to any store");
    }
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Error loading store"
    );
  }
  if (store) {
    redirect(`/store/${store.id}`);
  }
  return null;
};

export default StorePage;
