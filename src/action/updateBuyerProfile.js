"use server";

import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { profiles, buyerProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateBuyerProfile(formData) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // Get current profile as fallback
    const currentProfile = await db.query.profiles.findFirst({
      where: eq(profiles.id, user.id),
    });

    const fullNameInput = formData.get("fullName");
    const phoneInput = formData.get("phone");
    const avatarInput = formData.get("avatar");
    const businessType = formData.get("businessType");
    const industry = formData.get("industry");

    // Null checks for NOT NULL constraints
    const fullName =
      fullNameInput && fullNameInput.trim() !== ""
        ? fullNameInput.trim()
        : currentProfile?.fullName || "Buyer User";

    const avatar =
      avatarInput && avatarInput.trim() !== ""
        ? avatarInput.trim()
        : currentProfile?.avatar || "";

    const phone = phoneInput ? phoneInput.trim() : currentProfile?.phone || "";

    // 1. Update Profiles Table
    await db
      .update(profiles)
      .set({
        fullName,
        phone,
        avatar,
        updatedAt: new Date(),
      })
      .where(eq(profiles.id, user.id));

    // 2. Update Buyer Profiles Table
    const existingBuyer = await db.query.buyerProfiles.findFirst({
      where: eq(buyerProfiles.profileId, user.id),
    });

    if (existingBuyer) {
      await db
        .update(buyerProfiles)
        .set({
          businessType,
          industry,
          updatedAt: new Date(),
        })
        .where(eq(buyerProfiles.profileId, user.id));
    } else {
      await db.insert(buyerProfiles).values({
        profileId: user.id,
        businessType,
        industry,
      });
    }

    revalidatePath("/buyer/profile");
    revalidatePath("/buyer/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Profile update error:", error);
    return { success: false, error: error.message };
  }
}
