// app/api/[storeId]/order/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AddOrderSchema } from "@/Validations/validation";

/**
 * @method POST
 * @description Create a new Order for a store
 * @route ~/api/[:storeId]/order
 * @access Public (for customer orders)
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const { storeId } = await params;

    console.log("Received order creation request for store:", storeId);

    if (!storeId) {
      return NextResponse.json(
        { message: "Store ID is required" },
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

    const body = await req.json();
    console.log("Request body:", body);

    const validation = AddOrderSchema.safeParse(body);

    if (!validation.success) {
      console.error("Validation error:", validation.error.issues);
      return NextResponse.json(
        {
          message: validation.error.issues[0].message,
          errors: validation.error.issues,
        },
        { status: 400 }
      );
    }

    const { phone, address, isPaid, orderItems, customerEmail } =
      validation.data;

    // Create order first
    const order = await prisma.order.create({
      data: {
        storeId,
        phone: phone || "",
        address: address || "",
        customerEmail: customerEmail || "",
        isPaid: isPaid || false,
      },
    });

    console.log("Order created:", order.id);

    // Create order items if provided
    if (orderItems && orderItems.length > 0) {
      await prisma.orderItems.createMany({
        data: orderItems.map((item) => ({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
        })),
      });

      console.log("Order items created:", orderItems.length);
    }

    // Fetch complete order with items
    const completeOrder = await prisma.order.findUnique({
      where: { id: order.id },
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
      {
        status: 201,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Order creation error:", error);
    const response = NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Something went wrong",
      },
      { status: 500 }
    );

    // Add CORS headers to error response too
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
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

/**
 * @method GET
 * @route ~/api/[:storeId]/order
 * @description Retrieve all orders for a specific store
 * @access Public
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

    const store = await prisma.store.findFirst({
      where: { id: storeId },
    });

    if (!store) {
      return NextResponse.json({ message: "Store not found" }, { status: 404 });
    }

    const orders = await prisma.order.findMany({
      where: { storeId },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Something went wrong",
      },
      { status: 500 }
    );
  }
}
