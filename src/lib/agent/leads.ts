/**
 * Chat lead storage.
 *
 * Progress is upserted per chat session into `elite_chatbot_leads`. The first
 * time a session yields a phone number we also add one row to `leads`, the
 * table the admin Leads page and CRM read, so chat enquiries reach the team.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export type LeadUpdate = {
  full_name?: string;
  phone_number?: string;
  looking_for?: string;
  budget_range?: string;
  purpose?: string;
};

const headers = () => ({
  "Content-Type": "application/json",
  apikey: SUPABASE_KEY!,
  Authorization: `Bearer ${SUPABASE_KEY}`,
});

/** Pakistani mobile numbers: 03XX-XXXXXXX, +92 3XX XXXXXXX, 923XXXXXXXXX */
const PK_MOBILE = /(?:\+?92|0)[\s-]?3\d{2}[\s-]?\d{7}\b/;

export function extractPhone(text: string): string | null {
  const match = text.replace(/[()]/g, "").match(PK_MOBILE);
  return match ? match[0].replace(/[\s-]/g, "") : null;
}

export async function saveLead(sessionId: string, update: LeadUpdate): Promise<void> {
  const clean = Object.fromEntries(
    Object.entries(update).filter(([, v]) => typeof v === "string" && v.trim() !== ""),
  ) as LeadUpdate;
  if (Object.keys(clean).length === 0) return;

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.warn("Supabase credentials missing, skipped saving chat lead.");
    return;
  }

  let existing: LeadUpdate & { is_complete?: boolean } = {};
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/elite_chatbot_leads?session_id=eq.${encodeURIComponent(sessionId)}&select=*`,
      { headers: headers() },
    );
    if (res.ok) existing = (await res.json())[0] ?? {};
  } catch (err) {
    console.warn("Could not read existing chat lead:", err);
  }

  const merged = {
    full_name: clean.full_name || existing.full_name || null,
    phone_number: clean.phone_number || existing.phone_number || null,
    looking_for: clean.looking_for || existing.looking_for || null,
    budget_range: clean.budget_range || existing.budget_range || null,
    purpose: clean.purpose || existing.purpose || null,
  };

  const res = await fetch(`${SUPABASE_URL}/rest/v1/elite_chatbot_leads?on_conflict=session_id`, {
    method: "POST",
    headers: { ...headers(), Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify({
      session_id: sessionId,
      ...merged,
      is_complete: Boolean(merged.phone_number && merged.full_name),
      updated_at: new Date().toISOString(),
    }),
  });
  if (!res.ok) console.error("Chat lead upsert failed:", await res.text());

  // Hand the enquiry to the team once, when a phone number first appears
  const isNewPhone = merged.phone_number && merged.phone_number !== existing.phone_number;
  if (isNewPhone) {
    const crm = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
      method: "POST",
      headers: { ...headers(), Prefer: "return=minimal" },
      body: JSON.stringify({
        full_name: merged.full_name || "Website chat visitor",
        phone_number: merged.phone_number,
        budget_range: merged.budget_range || "Not specified",
        purpose: merged.purpose || "Not specified",
        looking_for: `Website chat: ${merged.looking_for || "General enquiry"}`,
      }),
    });
    if (!crm.ok) console.error("Chat lead hand-off to leads table failed:", await crm.text());
  }
}
