"use server";

import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { profiles, buyerProfiles, supplierProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function completeProfile(formData) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    const role = formData.get("role");
    // Extract phone number from form data or user metadata
    const phone =
      formData.get("phone") ||
      formData.get("contactNumber") ||
      user.phone ||
      "";

    // 1. UPDATE MAIN PROFILE (ROLE & PHONE SYNC)
    await db
      .update(profiles)
      .set({
        role,
        phone: phone,
        updatedAt: new Date(),
      })
      .where(eq(profiles.id, user.id));

    // 2. HANDLE BUYER PROFILE (UPSERT LOGIC)
    if (role === "BUYER") {
      const buyerData = {
        profileId: user.id,
        businessType: formData.get("businessType"),
        industry: formData.get("industry"),
        preferredFabric: formData.get("preferredFabric"),
        typicalOrderQuantity: Number(formData.get("typicalOrderQuantity")) || 0,
        budgetRange: formData.get("budgetRange"),
        updatedAt: new Date(),
      };

      const existingBuyer = await db
        .select()
        .from(buyerProfiles)
        .where(eq(buyerProfiles.profileId, user.id));

      if (existingBuyer.length > 0) {
        await db
          .update(buyerProfiles)
          .set(buyerData)
          .where(eq(buyerProfiles.profileId, user.id));
      } else {
        await db.insert(buyerProfiles).values(buyerData);
      }

      return {
        success: true,
        redirectTo: "/buyer/dashboard",
      };
    }

    // 3. HANDLE SUPPLIER PROFILE (UPSERT LOGIC)
    const supplierData = {
      profileId: user.id,
      businessName: formData.get("businessName"),
      businessType: formData.get("businessType"),
      contactNumber: formData.get("contactNumber"),
      businessAddress: formData.get("businessAddress"),
      operatingHours: formData.get("operatingHours"),
      fabricsOffered: formData.get("fabricsOffered"),
      minimumOrderQuantity: Number(formData.get("minimumOrderQuantity")) || 0,
      updatedAt: new Date(),
    };

    const existingSupplier = await db
      .select()
      .from(supplierProfiles)
      .where(eq(supplierProfiles.profileId, user.id));

    if (existingSupplier.length > 0) {
      await db
        .update(supplierProfiles)
        .set(supplierData)
        .where(eq(supplierProfiles.profileId, user.id));
    } else {
      await db.insert(supplierProfiles).values(supplierData);
    }

    return {
      success: true,
      redirectTo: "/supplier/dashboard",
    };
  } catch (error) {
    console.error("completeProfile Error:", error);
    return {
      success: false,
      message: error.message || "Something went wrong",
    };
  }
}
