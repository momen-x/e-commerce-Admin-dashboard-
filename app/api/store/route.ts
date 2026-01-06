import { prisma } from "@/lib/prisma";
import { AddStore } from "@/Validations/validation";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// Update your API endpoint with better logging
/**
 * @method POST
 * @description Create a new store for the authenticated user
 * @route /api/store
 * @access Private
 */
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();

    const validation = AddStore.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name } = validation.data;

    const isStoreExist = await prisma.store.findFirst({
      where: { name, userID: userId },
    });
    if (isStoreExist) {
      return NextResponse.json(
        { message: "Store already exist" },
        { status: 400 }
      );
    }

    const store = await prisma.store.create({
      data: { name, userID: userId },
    });

    return NextResponse.json({ store }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Something went wrong",
      },
      { status: 500 }
    );
  }
}

/**
 * @method GET
 * @description Get all stores for the authenticated user
 * @route /api/store
 * @access Private
 */
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const stores = await prisma.store.findMany({
      where: { userID: userId },
    });

    return NextResponse.json({ stores }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Something went wrong",
      },
      { status: 500 }
    );
  }
}
