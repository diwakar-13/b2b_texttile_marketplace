"use server";

import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import {
  products,
  productImages,
  supplierProfiles,
  categories,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function addProduct(formData) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized access. Please login." };
    }

    // 1. Get Supplier Profile ID
    const supplier = await db.query.supplierProfiles.findFirst({
      where: eq(supplierProfiles.profileId, user.id),
    });

    if (!supplier) {
      return { success: false, error: "Supplier profile not found." };
    }

    // 2. Auto-assign Category
    const allCategories = await db.select().from(categories);
    let categoryId = formData.get("categoryId");

    if (!categoryId && allCategories.length > 0) {
      categoryId = allCategories[0].id;
    }

    // Fallback if DB has 0 categories
    if (!categoryId) {
      const [newCat] = await db
        .insert(categories)
        .values({
          name: "Cotton Fabrics",
          slug: "cotton-fabrics",
          description: "All types of cotton fabrics",
        })
        .returning();
      categoryId = newCat.id;
    }

    const name = formData.get("name");
    const description = formData.get("description") || "";
    const material = formData.get("material") || "Cotton";
    const composition = formData.get("composition") || "100% Cotton";
    const gsm = Number(formData.get("gsm")) || 180;
    const width = formData.get("width") || '58/60"';
    const color = formData.get("color") || "Natural White";
    const price = formData.get("price") || "100";
    const stock = Number(formData.get("stock")) || 500;
    const moq = Number(formData.get("moq")) || 100;
    const imageUrl = formData.get("imageUrl");

    const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;

    // 3. Insert Product into DB
    const [newProduct] = await db
      .insert(products)
      .values({
        supplierId: supplier.id,
        categoryId,
        name,
        slug,
        description,
        material,
        composition,
        gsm,
        width,
        color,
        price,
        stock,
        moq,
        isAvailable: true,
      })
      .returning();

    // 4. Attach Primary Image
    if (imageUrl && newProduct) {
      await db.insert(productImages).values({
        productId: newProduct.id,
        imageUrl,
        isPrimary: true,
      });
    }

    revalidatePath("/supplier/inventory");
    revalidatePath("/supplier/dashboard");
    revalidatePath("/marketplace");

    return { success: true };
  } catch (error) {
    console.error("Add Product Error:", error);
    return { success: false, error: error.message || "Failed to add fabric." };
  }
}
