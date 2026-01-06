import { auth } from "@clerk/nextjs/server";
import Header from "@/app/_components/MainHedar";
// import domin from "@/lib/domin";
import prisma from "@/lib/prisma";
import ReactQueryProviders from "@/Providers/react-query-provider";

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const { userId } = await auth();

  let stores = null;

  if (userId) {
    try {
      // const response = await fetch(`${domin}/api/store`);
      //  await response.json();
      stores = await prisma.store.findMany({
        where: {
          userID: userId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (error) {
      console.error(
        "Error loading stores:",
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }

  return (
    <div>
      <ReactQueryProviders>
        <Header stores={stores} userId={userId} />
      </ReactQueryProviders>
      {children}
    </div>
  );
};

export default RootLayout;
