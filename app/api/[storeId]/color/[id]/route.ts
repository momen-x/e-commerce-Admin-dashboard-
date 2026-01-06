import prisma from "@/lib/prisma";
import { AddColorSchema } from "@/Validations/validation";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * @method GET
 * @description get single color to display it information
 * @route ~/api/[:storeId]/color/[:id]
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
        { message: "Color ID is required" },
        { status: 400 }
      );
    }

    const color = await prisma.color.findUnique({
      where: {
        id: id,
      },
    });
    return NextResponse.json({ color }, { status: 200 });
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
 * @description delete a color
 * @route ~/api/[:storeId]/color/[:id]
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
        { message: "Color ID is required" },
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
    await prisma.color.deleteMany({
      where: {
        id: id,
      },
    });
    return NextResponse.json({ message: "Color deleted" }, { status: 200 });
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
 * @description update a color
 * @route ~/api/[:storeId]/color/[:id]
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
    const validation = AddColorSchema.safeParse(body);
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
        { message: "Color ID is required" },
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
    const updatedColor = await prisma.color.update({
      where: {
        id: id,
      },
      data: {
        name: name,
        value:value,
      },
    });
    return NextResponse.json(
      { message: "Color updated", updatedColor },
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
