import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { AddStore } from "@/Validations/validation";

/**
 * @method DELETE
 * @description Delete a store by ID
 * @access private just the owner of store can do delete his store
 * @route ~/api/stroe/:id
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (!id) {
      return NextResponse.json({ message: "invalied id" }, { status: 400 });
    }

    const isStoreExist = await prisma.store.findFirst({
      where: { id: String(id) },
    });

    if (!isStoreExist) {
      return NextResponse.json({ message: "invaled Id" }, { status: 404 });
    }
    const isTheUserHaveTheStore = await prisma.store.findFirst({
      where: { id: String(id), userID: userId },
    });
    if (!isTheUserHaveTheStore) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    await prisma.product.deleteMany({ where: { storeId: String(id) } });
    // await prisma.orderItems.deleteMany({ where: { orderId: String(id) } });
    await prisma.order.deleteMany({ where: { storeId: String(id) } });
    await prisma.category.deleteMany({ where: { storeId: String(id) } });
    await prisma.billboard.deleteMany({ where: { storeId: String(id) } });
    await prisma.size.deleteMany({ where: { storeId: String(id) } });
    await prisma.color.deleteMany({ where: { storeId: String(id) } });

    await prisma.store.delete({ where: { id: String(id), userID: userId } });
    return NextResponse.json(
      { message: "deleted successfully" },
      { status: 200 }
    );
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
 * @method PUT
 * @description edit the store settings
 * @route ~/api/store/:id
 * @access private just the owner of store can edit on it
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;

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
    if (!id) {
      return NextResponse.json({ message: "Invaled id" }, { status: 400 });
    }

    const { name } = validation.data;

    const isStore = await prisma.store.findFirst({ where: { id: String(id) } });

    if (!isStore) {
      return NextResponse.json(
        { message: "this store not exsist" },
        { status: 404 }
      );
    }
    const isStoreExist = await prisma.store.findFirst({
      where: { name, userID: userId },
    });

    if (isStoreExist) {
      return NextResponse.json(
        { message: "Thie Store already exist" },
        { status: 400 }
      );
    }
    const isUserHaveTheStore = await prisma.store.findFirst({
      where: { userID: userId, id: String(id) },
    });

    if (!isUserHaveTheStore) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 400 });
    }

    const store = await prisma.store.update({
      where: { userID: userId, id: String(id) },
      data: { name },
    });

    return NextResponse.json({ store }, { status: 203 });
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
 * @description get a store by ID
 * @access private just the owner of store can get his store
 * @route ~/api/store/:id
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (!id) {
      return NextResponse.json({ message: "invalied id" }, { status: 400 });
    }
    const store = await prisma.store.findFirst({
      where: { id: String(id), userID: userId },
    });

    if (!store) {
      return NextResponse.json({ message: "Store not found" }, { status: 404 });
    }
    return NextResponse.json({ store }, { status: 200 });
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
