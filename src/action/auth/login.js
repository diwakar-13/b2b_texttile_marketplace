"use server";

import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function login(formData) {
  const supabase = await createClient();

  const email = formData.get("email");
  const password = formData.get("password");

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: "User not found",
    };
  }

  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.id, user.id),
  });

  if (!profile) {
    return {
      success: false,
      message: "Profile not found",
    };
  }

  if (!profile.role) {
    return {
      success: true,
      redirectTo: "/complete-profile",
    };
  }

  return {
    success: true,
    redirectTo:
      profile.role === "SUPPLIER" ? "/supplier/dashboard" : "/buyer/dashboard",
  };
}
