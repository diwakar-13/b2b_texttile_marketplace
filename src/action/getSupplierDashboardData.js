"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { profiles, supplierProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getSupplierDashboardData() {
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

  // 3. Fetch Supplier Profile
  const supplierDetails = await db
    .select()
    .from(supplierProfiles)
    .where(eq(supplierProfiles.profileId, user.id));

  return {
    user,
    profile: userProfile[0],
    supplier: supplierDetails[0] || null,
  };
}