import prisma from "@/lib/prisma";
import { AddProductSchema } from "@/Validations/validation";
import { NextRequest, NextResponse } from "next/server";
import { cloudinary } from "@/lib/cloudinary";
import { auth } from "@clerk/nextjs/server";

/**
 *@method GET
 *@description get all products
 *@route ~/api/:storeId/product
 *@access public
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const { storeId } = await params;
    if (!storeId) {
      return NextResponse.json(
        { message: "Store id is required" },
        { status: 400 }
      );
    }
    const store = await prisma.store.findFirst({
      where: {
        id: storeId,
      },
    });
    if (!store) {
      return NextResponse.json({ message: "Store not found" }, { status: 404 });
    }
    const products = await prisma.product.findMany({
      where: {
        storeId: storeId,
      },
      include: {
        category: true,
        size: true,
        color: true,
      },

    });
    return NextResponse.json({products}, { status: 200 });
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
 * @method POST
 * @description Add new product with Cloudinary image upload.
 * @route ~/api/:storeId/product
 * @access Private - Only store owner can add products
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
      where: {
        id: storeId,
        userID: userId, // Make sure this matches your Prisma schema field name
      },
    });

    if (!store) {
      return NextResponse.json(
        { message: "Store not found or unauthorized" },
        { status: 403 }
      );
    }

    // Validate request body
    const body = await req.json();
    const validation = AddProductSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const {
      name,
      images,
      price,
      categoryId,
      sizeId,
      colorId,
      isFeatured,
      isArchived,
    } = validation.data;

    // Upload all images to Cloudinary
    const uploadedImageUrls: string[] = [];

    for (const imageUrl of images) {
      const uploadResult = await cloudinary.uploader.upload(imageUrl, {
        folder: "ecommerce-products",
        resource_type: "image",
        transformation: [
          {  width: 2000, height: 1000, crop: "limit" },
          { quality: "auto:good" },
          { fetch_format: "auto" },
        ],
      });
      
      uploadedImageUrls.push(uploadResult.secure_url);
    }

    // Create product with images as string array
    const product = await prisma.product.create({
      data: {
        name,
        price,
        isFeatured: isFeatured ?? false,
        isArchived: isArchived ?? false,
        storeId,
        categoryId,
        sizeId,
        colorId,
        images: uploadedImageUrls, 
      },
      include: {
        category: true,
        size: true,
        color: true,
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("Product creation error:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Something went wrong",
      },
      { status: 500 }
    );
  }
}