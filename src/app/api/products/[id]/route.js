import { db } from "@/db";
import {
  products,
  categories,
  supplierProfiles,
  productImages,
} from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    const result = await db
      .select({
        id: products.id,
        title: products.name,
        slug: products.slug,
        description: products.description,
        material: products.material,
        composition: products.composition,
        gsm: products.gsm,
        width: products.width,
        color: products.color,
        moq: products.moq,
        stock: products.stock,
        price: products.price,
        isAvailable: products.isAvailable,
        categoryName: categories.name,
        supplierName: supplierProfiles.businessName,
        supplierAddress: supplierProfiles.businessAddress,
        imageUrl: productImages.imageUrl,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(supplierProfiles, eq(products.supplierId, supplierProfiles.id))
      .leftJoin(
        productImages,
        and(
          eq(products.id, productImages.productId),
          eq(productImages.isPrimary, true)
        )
      )
      .where(eq(products.id, id));

    if (!result || result.length === 0) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    const product = {
      ...result[0],
      price: Number(result[0].price),
      verified: true,
      image: result[0].imageUrl || "https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?q=80&w=600",
    };

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("❌ Error fetching product by ID:", error);
    return NextResponse.json(
      { success: false, message: "Server Error", error: error.message },
      { status: 500 }
    );
  }
}