"use server";

import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { profiles } from "@/db/schema";

export async function register(formData) {
  const supabase = await createClient();

  const fullName = formData.get("fullName");
  const email = formData.get("email");
  const password = formData.get("password");

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        fullName,
      },
    },
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  const user = data.user;

  if (!user) {
    return {
      success: false,
      message: "User not created",
    };
  }

  await db.insert(profiles).values({
    id: user.id,
    fullName,
    email,
  });

  return {
    success: true,
    user,
  };
}
