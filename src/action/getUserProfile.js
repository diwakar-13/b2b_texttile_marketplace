"use server";

import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getUserProfile() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const userProfile = await db.query.profiles.findFirst({
      where: eq(profiles.id, user.id),
    });

    return userProfile || null;
  } catch (error) {
    console.error("getUserProfile Error:", error);
    return null;
  }
}
