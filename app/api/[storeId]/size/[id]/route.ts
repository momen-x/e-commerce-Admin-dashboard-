import prisma from "@/lib/prisma";
import { AddSizeSchema } from "@/Validations/validation";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * @method GET
 * @description get single size to display it information
 * @route ~/api/[:storeId]/size/[:id]
 * @access public
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { message: "Size ID is required" },
        { status: 400 }
      );
    }

    const size = await prisma.size.findUnique({
      where: {
        id: id,
      },
    });
    return NextResponse.json({ size }, { status: 200 });
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
 * @method DELETE
 * @description delete a size
 * @route ~/api/[:storeId]/size/[:id]
 * @access private
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ storeId: string; id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id, storeId } = await params;
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (!id) {
      return NextResponse.json(
        { message: "Size ID is required" },
        { status: 400 }
      );
    }
    if (!storeId) {
      return NextResponse.json(
        { message: "Store ID is required" },
        { status: 400 }
      );
    }
    const storeByUser = await prisma.store.findFirst({
      where: {
        id: storeId,
        userID: userId,
      },
    });
    if (!storeByUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }
    await prisma.size.delete({
      where: {
        id: id,
      },
    });
    return NextResponse.json({ message: "size deleted" }, { status: 200 });
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
 * @method PATCH
 * @description update a size
 * @route ~/api/[:storeId]/size/[:id]
 * @access private
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ storeId: string; id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id, storeId } = await params;
    const body = await request.json();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const validation = AddSizeSchema.safeParse(body);
    if (!validation.success) {
      const errors = validation.error.issues.map((err) => err.message);
      return NextResponse.json(
        { message: "Validation failed", errors },
        { status: 400 }
      );
    }
    const { name, value } = validation.data;

    if (!id) {
      return NextResponse.json(
        { message: "Size ID is required" },
        { status: 400 }
      );
    }
    if (!storeId) {
      return NextResponse.json(
        { message: "Store ID is required" },
        { status: 400 }
      );
    }
    const storeByUser = await prisma.store.findFirst({
      where: {
        id: storeId,
        userID: userId,
      },
    });
    if (!storeByUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }
    const updatedSize = await prisma.size.update({
      where: {
        id: id,
      },
      data: {
        name: name,
        value,
      },
    });
    return NextResponse.json(
      { message: "Size updated", updatedSize },
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
