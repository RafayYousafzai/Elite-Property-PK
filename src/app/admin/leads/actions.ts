"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function getAllLeads() {
  try {
    const supabase = await createClient(cookies());
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (err: any) {
    console.error("Failed to fetch leads:", err);
    return { success: false, error: err.message || "Failed to load leads" };
  }
}

export async function deleteLead(id: string) {
  try {
    const supabase = await createClient(cookies());
    const { error } = await supabase.from("leads").delete().eq("id", id);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (err: any) {
    console.error("Failed to delete lead:", err);
    return { success: false, error: err.message || "Failed to delete lead" };
  }
}
