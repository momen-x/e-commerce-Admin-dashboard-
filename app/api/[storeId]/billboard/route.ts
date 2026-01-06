import { prisma } from "@/lib/prisma";
import { AddBillboardsSchema } from "@/Validations/validation";
// import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { cloudinary } from "@/lib/cloudinary";

/**
 * @method POST
 * @description Create a new billboard for a store with Cloudinary image upload.
 * @route ~/api/[:storeId]/billboard
 * @access Private (Requires authentication)
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    // const { userId } = await auth();
    const { storeId } = await params;

    // if (!userId) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    if (!storeId) {
      return NextResponse.json(
        { message: "Store ID is required" },
        { status: 400 }
      );
    }

    // Verify user owns this store
    const store = await prisma.store.findFirst({
      where: { id: storeId },
    });

    if (!store) {
      return NextResponse.json(
        { message: "Store not found or unauthorized" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validation = AddBillboardsSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { imageUrl, label } = validation.data;

    // Upload image to Cloudinary and get the URL
    const uploadResult = await cloudinary.uploader.upload(imageUrl, {
      folder: "ecommerce-billboards",
      resource_type: "image",
      transformation: [
        { width: 2000, height: 1000, crop: "limit" }, // Billboard dimensions
        { quality: "auto:good" },
        { fetch_format: "auto" }, // WebP when supported
      ],
    });

    // Cloudinary returns the URL in uploadResult.secure_url
    const cloudinaryImageUrl = uploadResult.secure_url;

    // Create billboard with the Cloudinary URL
    const billboard = await prisma.billboard.create({
      data: {
        label,
        imageUrl: cloudinaryImageUrl, // Store the Cloudinary URL
        storeId,
      },
    });

    return NextResponse.json({ billboard }, { status: 201 });
  } catch (error) {
    console.error("Billboard creation error:", error);
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
 * @route ~/api/[:storeId]/billboard
 * @description Retrieve all billboards for a specific store.
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
    // if (!userId) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }
    const isUserHaveTheStore = await prisma.store.findFirst({
      where: { id: storeId },
    });
    if (!isUserHaveTheStore) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const billboards = await prisma.billboard.findMany({
      where: { storeId: storeId },
    });
    return NextResponse.json({ billboards }, { status: 200 });
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
