import { cloudinary } from "@/lib/cloudinary";
import prisma from "@/lib/prisma";
import { UpdateProductSchema } from "@/Validations/validation";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * @method GET
 * @description get single product
 * @route ~/api/:storeId/product/:productId
 * @access public
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; storeId: string }> }
) {
  try {
    const { id, storeId } = await params;
    if (!storeId) {
      return NextResponse.json(
        { message: "Store ID is required" },
        { status: 400 }
      );
    }
    if (!id) {
      return NextResponse.json(
        { message: "Product ID is required" },
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
    const product = await prisma.product.findFirst({
      where: {
        id: id,
        storeId: storeId,
      },
      include: {
        category: true,
        size: true,
        color: true,
      },
    });
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ product }, { status: 200 });
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
 * @description delete a product
 * @route ~/api/[:storeId]/product/[:id]
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
        { message: "Product ID is required" },
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
    await prisma.product.deleteMany({
      where: {
        id: id,
      },
    });
    return NextResponse.json({ message: "Product deleted" }, { status: 200 });
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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ storeId: string; id: string }> }
) {
  try {
    const { userId } = await auth();
    const { storeId, id } = await params;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

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
    const validation = UpdateProductSchema.safeParse(body);

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

    // Upload only NEW images (base64) to Cloudinary
    const uploadedImageUrls: string[] = [];

    for (const imageUrl of images || []) {
      // If it's already a Cloudinary URL, keep it
      if (imageUrl.startsWith("http")) {
        uploadedImageUrls.push(imageUrl);
      }
      // If it's base64, upload to Cloudinary
      else if (imageUrl.startsWith("data:image")) {
        const uploadResult = await cloudinary.uploader.upload(imageUrl, {
          folder: "ecommerce-products",
          resource_type: "image",
          transformation: [
            { width: 1200, height: 1200, crop: "limit" },
            { quality: "auto:good" },
            { fetch_format: "auto" },
          ],
        });
        uploadedImageUrls.push(uploadResult.secure_url);
      }
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(price && { price }),
        ...(categoryId && { categoryId }),
        ...(sizeId && { sizeId }),
        ...(colorId && { colorId }),
        ...(isFeatured !== undefined && { isFeatured }),
        ...(isArchived !== undefined && { isArchived }),
        ...(uploadedImageUrls.length > 0 && { images: uploadedImageUrls }),
      },
      include: {
        category: true,
        size: true,
        color: true,
      },
    });

    return NextResponse.json({ updatedProduct }, { status: 200 });
  } catch (error) {
    console.error("Product update error:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Something went wrong",
      },
      { status: 500 }
    );
  }
}
