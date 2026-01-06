import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import Header from "@/components/header/Header";
import prisma from "@/lib/prisma";
import SaveStore from "@/Providers/SaveStore";
import ReactQueryProviders from "@/Providers/react-query-provider";

const PagesLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ storeId: string }>;
}) => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const { storeId } = await params;

  if (!storeId) {
    redirect("/");
  }

  // Verify store exists and belongs to user
  const store = await prisma.store.findFirst({
    where: {
      id: storeId,
      userID: userId,
    },
  });

  if (!store) {
    redirect("/");
  }

  return (
    <div>
      <ReactQueryProviders>
        <Header isUser={true} />
        <SaveStore store={store} />

        {children}
      </ReactQueryProviders>
    </div>
  );
};

export default PagesLayout;
