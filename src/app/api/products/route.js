import { db } from "@/db";
import {
  products,
  categories,
  supplierProfiles,
  productImages,
} from "@/db/schema";
import { eq, gte, lte, and, ilike, or } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const minGsm = searchParams.get("minGsm");
    const maxGsm = searchParams.get("maxGsm");
    const maxMoq = searchParams.get("maxMoq");

    // Pagination Parameters
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 8;
    const offset = (page - 1) * limit;

    const conditions = [eq(products.isAvailable, true)];

    if (category && category !== "All") {
      conditions.push(
        or(
          ilike(categories.slug, `%${category}%`),
          ilike(products.material, `%${category}%`),
        )
      );
    }

    if (search) {
      conditions.push(
        or(
          ilike(products.name, `%${search}%`),
          ilike(products.material, `%${search}%`),
          ilike(supplierProfiles.businessName, `%${search}%`),
        )
      );
    }

    if (minGsm) conditions.push(gte(products.gsm, Number(minGsm)));
    if (maxGsm) conditions.push(lte(products.gsm, Number(maxGsm)));
    if (maxMoq) conditions.push(lte(products.moq, Number(maxMoq)));

    // Query DB with Limit & Offset
    const resultList = await db
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
        categoryName: categories.name,
        supplier: supplierProfiles.businessName,
        image: productImages.imageUrl,
        verified: supplierProfiles.id,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(supplierProfiles, eq(products.supplierId, supplierProfiles.id))
      .leftJoin(
        productImages,
        and(
          eq(products.id, productImages.productId),
          eq(productImages.isPrimary, true),
        ),
      )
      .where(and(...conditions))
      .limit(limit)
      .offset(offset);

    // Image Fallback Handling
    const formattedData = resultList.map((item) => ({
      ...item,
      price: Number(item.price),
      verified: true,
      image:
        item.image && item.image.startsWith("http")
          ? item.image
          : "https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?q=80&w=600",
    }));

    return NextResponse.json({
      success: true,
      count: formattedData.length,
      hasMore: formattedData.length === limit,
      products: formattedData,
    });
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch products" },
      { status: 500 },
    );
  }
}