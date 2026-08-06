"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { profiles, buyerProfiles, products, productImages } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getBuyerDashboardData() {
  const supabase = await createClient();

  // 1. Check Auth Session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 2. Database User Verification
  const userProfile = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, user.id));

  if (!userProfile || userProfile.length === 0) {
    await supabase.auth.signOut();
    redirect("/login");
  }

  // 3. Fetch Buyer Specific Details
  const buyerDetails = await db
    .select()
    .from(buyerProfiles)
    .where(eq(buyerProfiles.profileId, user.id));

  // 4. Fetch Products with Images for Marketplace Grid
  let catalogProducts = [];
  try {
    catalogProducts = await db
      .select({
        id: products.id,
        name: products.name,
        material: products.material,
        price: products.price,
        moq: products.moq,
        stock: products.stock,
        imageUrl: productImages.imageUrl,
      })
      .from(products)
      .leftJoin(productImages, eq(products.id, productImages.productId))
      .where(eq(products.isAvailable, true));
  } catch (err) {
    console.error("Failed to fetch products:", err);
  }

  return {
    user,
    profile: userProfile[0],
    buyer: buyerDetails[0] || null,
    products: catalogProducts || [],
  };
}
