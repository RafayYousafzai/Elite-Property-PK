"use server";

import { createClient as createServerSupabase } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { createClient as createRawSupabase } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

async function verifyAdmin() {
  const supabase = await createServerSupabase(cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const { data: profile } = await supabase
    .from("crm_users")
    .select("role")
    .eq("id", user.id)
    .single();

  return profile?.role === "admin";
}

export async function getAllAgents() {
  try {
    const supabase = await createServerSupabase(cookies());
    const { data, error } = await supabase
      .from("crm_users")
      .select("*")
      .eq("role", "agent")
      .order("name", { ascending: true });

    if (error) throw error;
    return { success: true, data };
  } catch (err: any) {
    console.error("Failed to fetch agents:", err);
    return { success: false, error: err.message };
  }
}

export async function createAgent(email: string, password: string, name: string) {
  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
      return { success: false, error: "Unauthorized. Admin permissions required." };
    }

    // Create raw client that doesn't modify admin cookies
    const authClient = createRawSupabase(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const { data, error } = await authClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role: "agent",
        },
      },
    });

    if (error) throw error;

    revalidatePath("/admin/agents");
    return { success: true, user: data.user };
  } catch (err: any) {
    console.error("Failed to create agent:", err);
    return { success: false, error: err.message };
  }
}

export async function deleteAgent(agentId: string) {
  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
      return { success: false, error: "Unauthorized." };
    }

    const supabase = await createServerSupabase(cookies());
    const { error } = await supabase.from("crm_users").delete().eq("id", agentId);

    if (error) throw error;

    revalidatePath("/admin/agents");
    return { success: true };
  } catch (err: any) {
    console.error("Failed to delete agent:", err);
    return { success: false, error: err.message };
  }
}
