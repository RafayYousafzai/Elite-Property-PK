import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { full_name, phone_number, budget_range, purpose, looking_for } = data;

    if (!full_name || !phone_number || !budget_range || !purpose || !looking_for) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient(cookies());

    const { error } = await supabase.from("leads").insert({
      full_name,
      phone_number,
      budget_range,
      purpose,
      looking_for,
    });

    if (error) {
      console.error("⚠️ Supabase Leads insert failed. Ensure the 'leads' table exists (run database/create_leads_table.sql in Supabase SQL editor). Error detail:", error);
      // Fallback so the client workflow does not break for campaigns if table is not yet migrated
      return NextResponse.json({
        success: true,
        warning: "Database insert failed, but request received.",
        error_detail: error.message,
      });
    }

    return NextResponse.json({ success: true, message: "Lead submitted successfully" });
  } catch (err: any) {
    console.error("Error saving lead:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Failed to process lead request" },
      { status: 500 }
    );
  }
}
