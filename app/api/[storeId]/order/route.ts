import { prisma } from "@/lib/prisma";
import { AddOrderSchema } from "@/Validations/validation";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * @method POST
 * @description Create a new Order for a store
 * @route ~/api/[:storeId]/Order
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
    const validation = AddOrderSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const {  phone, address, isPaid, orderItems } = validation.data;
    await prisma.orderItems.createMany({
      data: orderItems,
    });

    const Order = await prisma.order.create({
      data: {
        storeId,
        phone: phone || "",
        address: address || "",
        isPaid: isPaid || false,
      },
      include: {
        orderItems: true,
      },
    });

    return NextResponse.json({ Order }, { status: 201 });
  } catch (error) {
    console.error("Order creation error:", error);
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
 * @route ~/api/[:storeId]/Order
 * @description Retrieve all Order for a specific store.
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
    const orders = await prisma.order.findMany({
      where: { storeId: storeId },
    });
    return NextResponse.json({ orders }, { status: 200 });
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
