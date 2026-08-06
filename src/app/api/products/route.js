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

    // 🎯 Removed strict isAvailable condition so out-of-stock items can render with dynamic badges
    const conditions = [];

    if (category && category !== "All") {
      conditions.push(
        or(
          ilike(categories.slug, `%${category}%`),
          ilike(products.material, `%${category}%`),
        ),
      );
    }

    if (search) {
      conditions.push(
        or(
          ilike(products.name, `%${search}%`),
          ilike(products.material, `%${search}%`),
          ilike(supplierProfiles.businessName, `%${search}%`),
        ),
      );
    }

    if (minGsm) conditions.push(gte(products.gsm, Number(minGsm)));
    if (maxGsm) conditions.push(lte(products.gsm, Number(maxGsm)));
    if (maxMoq) conditions.push(lte(products.moq, Number(maxMoq)));

    // Query DB with Limit & Offset
    let query = db
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
        isAvailable: products.isAvailable,
        price: products.price,
        categoryName: categories.name,
        supplier: supplierProfiles.businessName,
        imageUrl: productImages.imageUrl,
        verified: supplierProfiles.id,
        createdAt: products.createdAt,
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
      );

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const resultList = await query.limit(limit).offset(offset);

    // 🎯 Direct Database Image mapping without hardcoded Unsplash fallback
    const formattedData = resultList.map((item) => ({
      ...item,
      price: Number(item.price),
      verified: true,
      image: item.imageUrl || null,
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
