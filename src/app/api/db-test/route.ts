import { supabase } from "@/lib/supabase";

export const runtime = "edge";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const testSessionId = `test_sess_${Date.now()}`;
  const testData = {
    full_name: "Test Lead User",
    phone_number: "+923000511111",
    budget_range: "1 Crore - 3 Crore",
    purpose: "Investment",
    looking_for: "DHA Phase 2 Plot",
    is_complete: false,
  };

  const results: Record<string, any> = {
    env: {
      NEXT_PUBLIC_SUPABASE_URL: url ? "Defined" : "UNDEFINED",
      SUPABASE_KEY: key ? "Defined" : "UNDEFINED",
    },
    manualFetchResult: null,
    supabaseClientResult: null,
  };

  if (!url || !key) {
    return Response.json({
      success: false,
      message: "Required Supabase environment variables are missing.",
      results,
    });
  }

  try {
    const cleanUrl = url.endsWith("/") ? url.slice(0, -1) : url;
    const res = await fetch(
      `${cleanUrl}/rest/v1/elite_chatbot_leads?on_conflict=session_id`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: key,
          Authorization: `Bearer ${key}`,
          Prefer: "resolution=merge-duplicates,return=representation",
        },
        body: JSON.stringify({ session_id: testSessionId, ...testData }),
      }
    );
    results.manualFetchResult = {
      ok: res.ok,
      status: res.status,
      statusText: res.statusText,
      body: await res.text(),
    };
  } catch (err: any) {
    results.manualFetchResult = { error: err.message };
  }

  try {
    const { data, error } = await supabase
      .from("leads")
      .insert({ ...testData });

    results.supabaseClientResult = {
      success: !error,
      error: error ? { message: error.message } : null,
      data,
    };
  } catch (err: any) {
    results.supabaseClientResult = { error: err.message };
  }

  return Response.json({
    success: true,
    message: "Supabase DB write tests executed.",
    results,
  });
}
