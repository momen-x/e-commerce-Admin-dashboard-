import prisma from "@/lib/prisma";
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
 * @description Update an existing order (mark as paid and add order items)
 * @route ~/api/[storeId]/order/[orderId]
 * @access Public (for webhook)
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ storeId: string; id: string }> }
) {
  try {
    const { storeId, id:orderId } = await params;

    console.log("Updating order:", orderId);

    if (!storeId || !orderId) {
      return NextResponse.json(
        { message: "Store ID and Order ID are required" },
        { status: 400 }
      );
    }

    // Verify store exists
    const store = await prisma.store.findFirst({
      where: { id: storeId },
    });

    if (!store) {
      return NextResponse.json({ message: "Store not found" }, { status: 404 });
    }

    // Verify order exists
    const existingOrder = await prisma.order.findFirst({
      where: {
        id: orderId,
        storeId: storeId,
      },
    });

    if (!existingOrder) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    const body = await req.json();
    console.log("Update body:", body);

    const { isPaid, orderItems } = body;

    // Update order
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        isPaid: isPaid !== undefined ? isPaid : existingOrder.isPaid,
      },
    });

    console.log("Order updated:", updatedOrder.id);

    // Add order items if provided
    if (orderItems && Array.isArray(orderItems) && orderItems.length > 0) {
      // Delete existing order items first (if any)
      await prisma.orderItems.deleteMany({
        where: { orderId: orderId },
      });

      // Create new order items
      await prisma.orderItems.createMany({
        data: orderItems.map((item: any) => ({
          orderId: orderId,
          productId: item.productId,
          quantity: item.quantity,
        })),
      });

      console.log("Order items added:", orderItems.length);
    }

    // Fetch complete updated order
    const completeOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    const response = NextResponse.json(
      { Order: completeOrder },
      { status: 200 }
    );

    // Add CORS headers
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );

    return response;
  } catch (error) {
    console.error("Order update error:", error);
    const response = NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Something went wrong",
      },
      { status: 500 }
    );

    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  }
}

/**
 * @method OPTIONS
 * @description Handle CORS preflight
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
