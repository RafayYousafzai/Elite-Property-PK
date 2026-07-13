import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const supabase = await createClient(cookies());
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const { data: profile, error: profileError } = await supabase
      .from("crm_users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      // Auto-create profile in crm_users to prevent redirect loops and lockouts
      const { data: newProfile, error: insertError } = await supabase
        .from("crm_users")
        .insert({
          id: user.id,
          email: user.email!,
          name: user.user_metadata?.name || "Administrator",
          role: user.user_metadata?.role || "agent", // Sync role from metadata
        })
        .select()
        .single();

      if (insertError) {
        console.error("Failed to auto-create crm profile:", insertError);
        return NextResponse.json({ authenticated: false }, { status: 401 });
      }

      return NextResponse.json({
        authenticated: true,
        user: newProfile,
      });
    }

    return NextResponse.json({
      authenticated: true,
      user: profile,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
