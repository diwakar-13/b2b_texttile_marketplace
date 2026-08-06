"use server";

import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { products, productImages, supplierProfiles } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// 🎯 UPDATE PRODUCT (EDIT)
export async function updateProduct(productId, formData) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Unauthorized access" };

    const supplier = await db.query.supplierProfiles.findFirst({
      where: eq(supplierProfiles.profileId, user.id),
    });

    if (!supplier)
      return { success: false, error: "Supplier profile not found" };

    const name = formData.get("name");
    const material = formData.get("material");
    const composition = formData.get("composition");
    const gsm = Number(formData.get("gsm"));
    const width = formData.get("width");
    const price = formData.get("price");
    const stock = Number(formData.get("stock"));
    const moq = Number(formData.get("moq"));
    const description = formData.get("description");
    const imageUrl = formData.get("imageUrl");

    // Update Product Details
    await db
      .update(products)
      .set({
        name,
        material,
        composition,
        gsm,
        width,
        price,
        stock,
        moq,
        description,
        isAvailable: stock > 0,
        updatedAt: new Date(),
      })
      .where(
        and(eq(products.id, productId), eq(products.supplierId, supplier.id)),
      );

    // Update Image if provided
    if (imageUrl) {
      const existingImg = await db.query.productImages.findFirst({
        where: eq(productImages.productId, productId),
      });

      if (existingImg) {
        await db
          .update(productImages)
          .set({ imageUrl })
          .where(eq(productImages.id, existingImg.id));
      } else {
        await db.insert(productImages).values({
          productId,
          imageUrl,
          isPrimary: true,
        });
      }
    }

    revalidatePath("/supplier/inventory");
    revalidatePath("/supplier/dashboard");
    revalidatePath("/marketplace");

    return { success: true };
  } catch (error) {
    console.error("Update Product Error:", error);
    return { success: false, error: error.message };
  }
}

// 🎯 TOGGLE AVAILABILITY (MARK AVAILABLE / OUT OF STOCK)
export async function toggleProductAvailability(productId, currentStatus) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Unauthorized access" };

    await db
      .update(products)
      .set({ isAvailable: !currentStatus, updatedAt: new Date() })
      .where(eq(products.id, productId));

    revalidatePath("/supplier/inventory");
    revalidatePath("/supplier/dashboard");

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
