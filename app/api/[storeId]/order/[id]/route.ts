import prisma from "@/lib/prisma";
import { updateOrderSchma } from "@/Validations/validation";
// import { updateOrderSchma } from "@/Validations/validation";
import { NextRequest, NextResponse } from "next/server";

/**
 * @method GET
 * @description get single order to display it information
 * @route ~/api/[:storeId]/order/[:id]
 * @access public
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ storeId: string; id: string }> }
) {
  try {
    const { id, storeId } = await params;
    if (!id) {
      return NextResponse.json(
        { message: "Order ID is required" },
        { status: 400 }
      );
    }
    if (!storeId) {
      return NextResponse.json(
        { message: "the store ID is required" },
        { status: 400 }
      );
    }
    const store = await prisma.store.findFirst({ where: { id: storeId } });
    if (!store) {
      return NextResponse.json(
        { message: "the store not found !!" },
        { status: 404 }
      );
    }
    const order = await prisma.order.findUnique({
      where: {
        id: id,
      },
    });
    return NextResponse.json({ order }, { status: 200 });
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
 * @description delete a order
 * @route ~/api/[:storeId]/order/[:id]
 * @access private
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ storeId: string; id: string }> }
) {
  try {
    const { id, storeId } = await params;

    if (!id || !storeId) {
      return NextResponse.json(
        { message: "order ID is required" },
        { status: 400 }
      );
    }

    await prisma.order.delete({
      where: {
        id: id,
      },
    });
    return NextResponse.json({ message: "order deleted" }, { status: 200 });
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
 * @description update a order
 * @route ~/api/[:storeId]/order/[:id]
 * @access private
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ storeId: string; id: string }> }
) {
  try {
    const { id, storeId } = await params;
    // const body = await request.json();

    const existingOrder = await prisma.order.findFirst({
      where: {
        id: id,
        storeId: storeId,
      },
    });
    if (!existingOrder) {
      return NextResponse.json(
        { message: "the order not found !!" },
        { status: 404 }
      );
    }
    // const validation = updateOrderSchma.safeParse(body);
    // if (!validation.success) {
    //   const errors = validation.error.issues.map((err) => err.message);
    //   return NextResponse.json(
    //     { message: "Validation failed", errors },
    //     { status: 400 }
    //   );
    // }

    if (!id || !storeId) {
      return NextResponse.json(
        { message: "Order ID is required" },
        { status: 400 }
      );
    }
    // const {productId,isPaid } = validation.data;

    const body = await request.json();
    const { isPaid, orderItems } = body;

    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Update the order
      const order = await tx.order.update({
        where: { id: id },
        data: {
          isPaid: isPaid !== undefined ? isPaid : existingOrder.isPaid,
        },
      });

      // If orderItems are provided, create them
      if (orderItems && Array.isArray(orderItems) && orderItems.length > 0) {
        // First, delete any existing order items (in case of retry)
        await tx.orderItems.deleteMany({
          where: { orderId: id },
        });

        // Then create new order items
        await tx.orderItems.createMany({
          data: orderItems.map(
            (item: { productId: string; quantity: number }) => ({
              orderId: id,
              productId: item.productId,
              quantity: item.quantity,
            })
          ),
        });
      }

      // Return the complete order with items
      return tx.order.findUnique({
        where: { id },
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
        },
      });
    });
    return NextResponse.json(
      { message: "Order updated", updatedOrder },
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
