import { db } from "@/db";
import {
  supplierProfiles,
  profiles,
  products,
  productImages,
} from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    // 1. Fetch Supplier Info
    const supplierData = await db
      .select({
        id: supplierProfiles.id,
        businessName: supplierProfiles.businessName,
        businessType: supplierProfiles.businessType,
        contactNumber: supplierProfiles.contactNumber,
        businessAddress: supplierProfiles.businessAddress,
        operatingHours: supplierProfiles.operatingHours,
        fabricsOffered: supplierProfiles.fabricsOffered,
        moq: supplierProfiles.minimumOrderQuantity,
        fullName: profiles.fullName,
        email: profiles.email,
        phone: profiles.phone,
        avatar: profiles.avatar,
      })
      .from(supplierProfiles)
      .leftJoin(profiles, eq(supplierProfiles.profileId, profiles.id))
      .where(eq(supplierProfiles.id, id));

    if (!supplierData || supplierData.length === 0) {
      return NextResponse.json(
        { success: false, message: "Supplier not found" },
        { status: 404 },
      );
    }

    const supplier = supplierData[0];

    // 2. Fetch All Products of this Supplier
    const supplierProducts = await db
      .select({
        id: products.id,
        title: products.name,
        gsm: products.gsm,
        width: products.width,
        price: products.price,
        moq: products.moq,
        material: products.material,
        image: productImages.imageUrl,
      })
      .from(products)
      .leftJoin(
        productImages,
        and(
          eq(products.id, productImages.productId),
          eq(productImages.isPrimary, true),
        ),
      )
      .where(eq(products.supplierId, id));

    const formattedProducts = supplierProducts.map((p) => ({
      ...p,
      price: Number(p.price),
      supplier: supplier.businessName,
      image:
        p.image ||
        "https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?q=80&w=600",
    }));

    return NextResponse.json({
      success: true,
      supplier: {
        ...supplier,
        rating: 4.8,
        reviewsCount: 120,
      },
      products: formattedProducts,
    });
  } catch (error) {
    console.error("Supplier Fetch Error:", error);
    return NextResponse.json(
      { success: false, message: "Error loading supplier details" },
      { status: 500 },
    );
  }
}
