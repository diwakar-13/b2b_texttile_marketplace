import { db } from "@/db";
import { supplierProfiles, profiles, products } from "@/db/schema";
import { eq, ilike, or, and, lte, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search");
    const type = searchParams.get("type");
    const fabric = searchParams.get("fabric");
    const country = searchParams.get("country");
    const maxMoq = searchParams.get("maxMoq");

    const conditions = [];

    if (search) {
      conditions.push(
        or(
          ilike(supplierProfiles.businessName, `%${search}%`),
          ilike(supplierProfiles.businessAddress, `%${search}%`),
          ilike(supplierProfiles.fabricsOffered, `%${search}%`)
        )
      );
    }

    if (type && type !== "All") {
      conditions.push(ilike(supplierProfiles.businessType, `%${type}%`));
    }

    if (fabric && fabric !== "All") {
      conditions.push(ilike(supplierProfiles.fabricsOffered, `%${fabric}%`));
    }

    if (country && country !== "All") {
      conditions.push(ilike(supplierProfiles.businessAddress, `%${country}%`));
    }

    if (maxMoq) {
      conditions.push(lte(supplierProfiles.minimumOrderQuantity, Number(maxMoq)));
    }

    const suppliersList = await db
      .select({
        id: supplierProfiles.id,
        businessName: supplierProfiles.businessName,
        businessType: supplierProfiles.businessType,
        businessAddress: supplierProfiles.businessAddress,
        fabricsOffered: supplierProfiles.fabricsOffered,
        moq: supplierProfiles.minimumOrderQuantity,
        avatar: profiles.avatar,
        phone: profiles.phone,
        totalProducts: sql`count(${products.id})::int`,
      })
      .from(supplierProfiles)
      .leftJoin(profiles, eq(supplierProfiles.profileId, profiles.id))
      .leftJoin(products, eq(supplierProfiles.id, products.supplierId))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .groupBy(supplierProfiles.id, profiles.id);

    const formattedSuppliers = suppliersList.map((s) => {
      const addressParts = s.businessAddress ? s.businessAddress.split(",") : [];
      const derivedCountry = addressParts.length > 0 ? addressParts[addressParts.length - 1].trim() : "India";

      return {
        id: s.id,
        businessName: s.businessName || "Verified Textile Mill",
        businessType: s.businessType || "Manufacturer",
        country: derivedCountry,
        avatar: s.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(s.businessName || "Supplier")}`,
        rating: 4.8,
        reviewsCount: 120,
        productsCount: s.totalProducts || 0,
        fabrics: s.fabricsOffered || "Cotton, Linen, Silk",
        moq: s.moq || 100,
      };
    });

    return NextResponse.json({ success: true, suppliers: formattedSuppliers });
  } catch (error) {
    console.error("❌ Error fetching suppliers:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load suppliers" },
      { status: 500 }
    );
  }
}