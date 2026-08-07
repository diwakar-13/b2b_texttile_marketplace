import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin; // Dynamically handles localhost vs Vercel URL

  const supabase = await createClient();

  if (code) {
    const { error: exchangeError } =
      await supabase.auth.exchangeCodeForSession(code);
    if (exchangeError) {
      console.error("Auth Code Exchange Error:", exchangeError);
      return NextResponse.redirect(
        `${origin}/login?error=OAuthTokenExchangeFailed`,
      );
    }
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.redirect(`${origin}/login`);
  }

  // Check if profile exists in Drizzle database
  const existingProfiles = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, user.id));

  let profile = existingProfiles[0];

  // If profile doesn't exist, create it with null role
  if (!profile) {
    const newProfile = await db
      .insert(profiles)
      .values({
        id: user.id,
        fullName:
          user.user_metadata?.full_name || user.user_metadata?.name || "User",
        email: user.email,
        avatar: user.user_metadata?.avatar_url || null,
        role: null, // Explicitly null so it triggers onboarding
      })
      .returning();

    profile = newProfile[0];
  }

  // 🎯 CRITICAL CHECK: If role is not selected/set, ALWAYS send to onboarding
  if (!profile || !profile.role) {
    return NextResponse.redirect(`${origin}/complete-profile`);
  }

  // If role exists, redirect to respective dashboard
  if (profile.role === "SUPPLIER") {
    return NextResponse.redirect(`${origin}/supplier/dashboard`);
  }

  if (profile.role === "BUYER") {
    return NextResponse.redirect(`${origin}/buyer/dashboard`);
  }

  return NextResponse.redirect(`${origin}/`);
}
