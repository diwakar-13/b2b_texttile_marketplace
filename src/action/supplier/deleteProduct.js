"use server";

import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { products, productImages, supplierProfiles } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function deleteProduct(productId) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized access" };
    }

    const supplier = await db.query.supplierProfiles.findFirst({
      where: eq(supplierProfiles.profileId, user.id),
    });

    if (!supplier) {
      return { success: false, error: "Supplier profile not found" };
    }

    // Delete associated images first
    await db.delete(productImages).where(eq(productImages.productId, productId));

    // Delete product belonging to this supplier
    await db
      .delete(products)
      .where(and(eq(products.id, productId), eq(products.supplierId, supplier.id)));

    revalidatePath("/supplier/inventory");
    revalidatePath("/supplier/dashboard");
    revalidatePath("/marketplace");

    return { success: true };
  } catch (error) {
    console.error("Delete Product Error:", error);
    return { success: false, error: error.message || "Failed to delete product" };
  }
}