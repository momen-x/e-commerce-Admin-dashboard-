import prisma from "@/lib/prisma";
// import { updateOrderSchma } from "@/Validations/validation";
import { auth } from "@clerk/nextjs/server";
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
if(!store){
    return NextResponse.json({message:"the store not found !!"},{status:404})
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
    const { userId } = await auth();
    const { id, storeId } = await params;
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (!id) {
      return NextResponse.json(
        { message: "order ID is required" },
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
// export async function PATCH(
//   request: NextRequest,
//   { params }: { params: Promise<{ storeId: string; id: string }> }
// ) {
//   try {
//     const { userId } = await auth();
//     const { id, storeId } = await params;
//     const body = await request.json();

//     if (!userId) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }
//     const validation = updateOrderSchma.safeParse(body);
//     if (!validation.success) {
//       const errors = validation.error.issues.map((err) => err.message);
//       return NextResponse.json(
//         { message: "Validation failed", errors },
//         { status: 400 }
//       );
//     }
//     const {productId, } = validation.data;

//     if (!id) {
//       return NextResponse.json(
//         { message: "Size ID is required" },
//         { status: 400 }
//       );
//     }
//     if (!storeId) {
//       return NextResponse.json(
//         { message: "Store ID is required" },
//         { status: 400 }
//       );
//     }
//     const storeByUser = await prisma.store.findFirst({
//       where: {
//         id: storeId,
//         userID: userId,
//       },
//     });
//     if (!storeByUser) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
//     }
//     const updatedSize = await prisma.size.update({
//       where: {
//         id: id,
//       },
//       data: {
//         name: name,
//         value,
//       },
//     });
//     return NextResponse.json(
//       { message: "Size updated", updatedSize },
//       { status: 200 }
//     );
//   } catch (error) {
//     return NextResponse.json(
//       {
//         message:
//           error instanceof Error ? error.message : "Something went wrong",
//       },
//       { status: 500 }
//     );
//   }
// }
