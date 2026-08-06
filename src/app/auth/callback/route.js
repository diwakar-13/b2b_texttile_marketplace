import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  const supabase = await createClient();

  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const existingProfiles = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, user.id));

  let profile = existingProfiles[0];

  if (!profile) {
    const newProfile = await db
      .insert(profiles)
      .values({
        id: user.id,
        fullName:
          user.user_metadata?.full_name || user.user_metadata?.name || "",
        email: user.email,
        avatar: user.user_metadata?.avatar_url || null,
      })
      .returning();

    profile = newProfile[0];
  }

  if (!profile?.role) {
    return NextResponse.redirect(new URL("/complete-profile", request.url));
  }

  if (profile.role === "SUPPLIER") {
    return NextResponse.redirect(new URL("/supplier/dashboard", request.url));
  }

  return NextResponse.redirect(new URL("/", request.url));
}
