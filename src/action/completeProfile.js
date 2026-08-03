"use server";

import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { profiles, buyerProfiles, supplierProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function completeProfile(formData) {
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

  // Update main profile
  await db
    .update(profiles)
    .set({
      role,
    })
    .where(eq(profiles.id, user.id));

  if (role === "BUYER") {
    await db.insert(buyerProfiles).values({
      profileId: user.id,
      businessType: formData.get("businessType"),
      industry: formData.get("industry"),
      preferredFabric: formData.get("preferredFabric"),
      typicalOrderQuantity: Number(formData.get("typicalOrderQuantity")),
      budgetRange: formData.get("budgetRange"),
    });

    return {
      success: true,
      redirectTo: "/buyer/dashboard",
    };
  }

  await db.insert(supplierProfiles).values({
    profileId: user.id,
    businessName: formData.get("businessName"),
    businessType: formData.get("businessType"),
    contactNumber: formData.get("contactNumber"),
    businessAddress: formData.get("businessAddress"),
    operatingHours: formData.get("operatingHours"),
    fabricsOffered: formData.get("fabricsOffered"),
    minimumOrderQuantity: Number(formData.get("minimumOrderQuantity")),
  });

  return {
    success: true,
    redirectTo: "/supplier/dashboard",
  };
}
