import { prisma } from "@/lib/prisma";
import { AddColorSchema } from "@/Validations/validation";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * @method POST
 * @description Create a new color for a store
 * @route ~/api/[:storeId]/color
 * @access Private (Requires authentication)
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const { userId } = await auth();
    const { storeId } = await params;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!storeId) {
      return NextResponse.json(
        { message: "Store ID is required" },
        { status: 400 }
      );
    }

    // Verify user owns this store
    const store = await prisma.store.findFirst({
      where: { id: storeId, userID: userId },
    });

    if (!store) {
      return NextResponse.json(
        { message: "Store not found or unauthorized" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validation = AddColorSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { value, name } = validation.data;

    const color = await prisma.color.create({
      data: {
        name,
        value,
        storeId,
      },
    });

    return NextResponse.json({ color }, { status: 201 });
  } catch (error) {
    console.error("Color creation error:", error);
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
 * @route ~/api/[:storeId]/color
 * @description Retrieve all color for a specific store.
 * @access public
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const { storeId } = await params;
    if (!storeId) {
      return NextResponse.json(
        { message: "Store ID is required" },
        { status: 400 }
      );
    }

    const isUserHaveTheStore = await prisma.store.findFirst({
      where: { id: storeId },
    });
    if (!isUserHaveTheStore) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const colors = await prisma.color.findMany({
      where: { storeId: storeId },
    });
    return NextResponse.json({ colors }, { status: 200 });
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
