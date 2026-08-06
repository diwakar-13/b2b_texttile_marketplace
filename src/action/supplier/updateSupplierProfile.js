"use server";

import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { supplierProfiles, profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateSupplierProfile(formData) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized access" };
    }

    const fullName = formData.get("fullName");
    const phone = formData.get("phone");
    const avatarUrl = formData.get("avatarUrl");

    const businessName = formData.get("businessName");
    const businessType = formData.get("businessType");
    const contactNumber = formData.get("contactNumber") || phone;
    const businessAddress = formData.get("businessAddress");
    const operatingHours = formData.get("operatingHours");
    const fabricsOffered = formData.get("fabricsOffered");
    const minimumOrderQuantity =
      Number(formData.get("minimumOrderQuantity")) || 100;

    // 🎯 1. Update PROFILES Table (Full Name, Phone & Avatar Image)
    const profileUpdates = { updatedAt: new Date() };
    if (fullName) profileUpdates.fullName = fullName;
    if (phone) profileUpdates.phone = phone;
    if (avatarUrl) profileUpdates.avatar = avatarUrl;

    await db
      .update(profiles)
      .set(profileUpdates)
      .where(eq(profiles.id, user.id));

    // 🎯 2. Update SUPPLIER_PROFILES Table
    const existingSupplier = await db.query.supplierProfiles.findFirst({
      where: eq(supplierProfiles.profileId, user.id),
    });

    if (existingSupplier) {
      await db
        .update(supplierProfiles)
        .set({
          businessName,
          businessType,
          contactNumber,
          businessAddress,
          operatingHours,
          fabricsOffered,
          minimumOrderQuantity,
          updatedAt: new Date(),
        })
        .where(eq(supplierProfiles.profileId, user.id));
    } else {
      await db.insert(supplierProfiles).values({
        profileId: user.id,
        businessName,
        businessType,
        contactNumber,
        businessAddress,
        operatingHours,
        fabricsOffered,
        minimumOrderQuantity,
      });
    }

    revalidatePath("/supplier/profile");
    revalidatePath("/supplier/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Update Supplier Profile Error:", error);
    return {
      success: false,
      error: error.message || "Failed to update profile",
    };
  }
}
