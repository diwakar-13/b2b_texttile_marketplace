"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { db } from "@/db";
import {
  profiles,
  buyerProfiles,
  orders,
  orderItems,
  products,
  productImages,
} from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function getBuyerDashboardData() {
  const supabase = await createClient();

  // 1. Auth Check
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 2. Fetch User Profile
  const userProfile = await db.query.profiles.findFirst({
    where: eq(profiles.id, user.id),
  });

  if (!userProfile) {
    await supabase.auth.signOut();
    redirect("/login");
  }

  // 3. Fetch Buyer Specific Profile Details
  const buyerDetails = await db.query.buyerProfiles.findFirst({
    where: eq(buyerProfiles.profileId, user.id),
  });

  // 4. Fetch All Orders with Joined Product Items
  let buyerOrdersList = [];
  try {
    const rawOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.profileId, user.id))
      .orderBy(desc(orders.createdAt));

    // Populate each order with its item details
    buyerOrdersList = await Promise.all(
      rawOrders.map(async (ord) => {
        const items = await db
          .select({
            id: orderItems.id,
            quantity: orderItems.quantity,
            price: orderItems.price,
            productName: products.name,
            productImage: productImages.imageUrl,
          })
          .from(orderItems)
          .innerJoin(products, eq(orderItems.productId, products.id))
          .leftJoin(productImages, eq(productImages.productId, products.id))
          .where(eq(orderItems.orderId, ord.id));

        return { ...ord, items };
      }),
    );
  } catch (err) {
    console.error("Failed to fetch buyer orders:", err);
  }

  return {
    user,
    profile: userProfile,
    buyer: buyerDetails || null,
    buyerOrders: buyerOrdersList || [],
  };
}
