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
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("Auth Error in completeProfile:", authError);
      return {
        success: false,
        message: "Unauthorized - Please login again",
      };
    }

    const role = formData.get("role");
    const phone =
      formData.get("phone") ||
      formData.get("contactNumber") ||
      user.phone ||
      "";

    // 1. UPDATE MAIN PROFILE (ROLE & PHONE SYNC)
    await db
      .update(profiles)
      .set({
        role: role,
        phone: phone,
        updatedAt: new Date(),
      })
      .where(eq(profiles.id, user.id));

    // 2. HANDLE BUYER PROFILE
    if (role === "BUYER") {
      const buyerData = {
        profileId: user.id,
        businessType: formData.get("businessType") || "Garment Manufacturer",
        industry: formData.get("industry") || "Apparel & Fashion",
        preferredFabric: formData.get("preferredFabric") || "Cotton",
        typicalOrderQuantity: Number(formData.get("typicalOrderQuantity")) || 0,
        budgetRange: formData.get("budgetRange") || "$2,000 - $10,000",
        updatedAt: new Date(),
      };

      const existingBuyer = await db
        .select()
        .from(buyerProfiles)
        .where(eq(buyerProfiles.profileId, user.id));

      if (existingBuyer && existingBuyer.length > 0) {
        await db
          .update(buyerProfiles)
          .set(buyerData)
          .where(eq(buyerProfiles.profileId, user.id));
      } else {
        await db.insert(buyerProfiles).values(buyerData);
      }

      return {
        success: true,
        redirectTo: "/", // BUYER HOME
      };
    }

    // 3. HANDLE SUPPLIER PROFILE
    if (role === "SUPPLIER") {
      const supplierData = {
        profileId: user.id,
        businessName: formData.get("businessName") || "Textile Business",
        businessType: formData.get("businessType") || "Mill",
        contactNumber: formData.get("contactNumber") || "",
        businessAddress: formData.get("businessAddress") || "",
        operatingHours: formData.get("operatingHours") || "",
        fabricsOffered: formData.get("fabricsOffered") || "",
        minimumOrderQuantity: Number(formData.get("minimumOrderQuantity")) || 0,
        updatedAt: new Date(),
      };

      const existingSupplier = await db
        .select()
        .from(supplierProfiles)
        .where(eq(supplierProfiles.profileId, user.id));

      if (existingSupplier && existingSupplier.length > 0) {
        await db
          .update(supplierProfiles)
          .set(supplierData)
          .where(eq(supplierProfiles.profileId, user.id));
      } else {
        await db.insert(supplierProfiles).values(supplierData);
      }

      return {
        success: true,
        redirectTo: "/supplier/dashboard", // SUPPLIER DASHBOARD
      };
    }

    return {
      success: false,
      message: "Invalid Role Selected",
    };
  } catch (error) {
    console.error("completeProfile Execution Error:", error);
    return {
      success: false,
      message: error.message || "Failed to complete onboarding",
    };
  }
}
