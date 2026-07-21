import { tool } from "ai";
import { z } from "zod";
import { after } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function saveLead(sessionId: string, data: Record<string, any>) {
  const clean = Object.fromEntries(
    Object.entries(data).filter(([_, v]) => v !== undefined && v !== null && v.toString().trim() !== "")
  );

  if (Object.keys(clean).length === 0) return "Nothing to save.";

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.warn("Supabase credentials missing, skipped saving lead progress.");
    return "Supabase credentials not configured.";
  }

  // Ensure default fallback values so NOT NULL constraints in 'leads' table are never violated
  const leadPayload = {
    session_id: sessionId,
    full_name: clean.full_name || clean.name || "Chatbot Visitor",
    phone_number: clean.phone_number || clean.phone || "Pending",
    budget_range: clean.budget_range || "Pending",
    purpose: clean.purpose || "Pending",
    looking_for: clean.looking_for || clean.product_of_interest || "Pending",
    is_complete: Boolean(clean.is_complete),
    updated_at: new Date().toISOString(),
  };

  const cleanUrl = SUPABASE_URL.endsWith("/") ? SUPABASE_URL.slice(0, -1) : SUPABASE_URL;

  // 1. Try upserting to 'elite_chatbot_leads' table
  let res = await fetch(`${cleanUrl}/rest/v1/elite_chatbot_leads?on_conflict=session_id`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify(leadPayload),
  });

  // 2. Fallback to 'leads' table
  if (!res.ok) {
    const errText = await res.text();
    console.warn("Primary elite_chatbot_leads save failed, attempting fallback to leads table:", errText);

    res = await fetch(`${cleanUrl}/rest/v1/leads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        full_name: leadPayload.full_name,
        phone_number: leadPayload.phone_number,
        budget_range: leadPayload.budget_range,
        purpose: leadPayload.purpose,
        looking_for: leadPayload.looking_for,
      }),
    });

    if (!res.ok) {
      const fallbackErr = await res.text();
      console.error("Fallback leads insert error:", fallbackErr);
      return "Failed to save lead: " + fallbackErr;
    }
  }

  return "Progress saved successfully.";
}

export const getAgentTools = (sessionId: string) => ({
  updateLeadProgress: tool({
    description:
      "Updates the database with client real estate inquiry & lead details. Call this IMMEDIATELY the moment the user provides a Phone Number, Full Name, Looking For location/type, Budget Range, or Purpose. Pass is_complete as true when all intake details are collected.",
    inputSchema: z.object({
      full_name: z.string().optional().describe("The user's full name"),
      phone_number: z.string().optional().describe("The user's phone or WhatsApp number"),
      looking_for: z.string().optional().describe("Property type, plot size, sector, or location of interest"),
      budget_range: z.string().optional().describe("Budget or price range specified by user"),
      purpose: z.string().optional().describe("Purpose of inquiry: Buying, Selling, Renting, Investment, or Consultation"),
      is_complete: z.boolean().optional().describe("Set to true once all key intake details are collected"),
    }),
    execute: async (data) => {
      try {
        after(() => {
          saveLead(sessionId, data).catch((err) => {
            console.error("Background saveLead error:", err);
          });
        });
        return "Progress saved successfully.";
      } catch (err) {
        console.warn("after() fallback to blocking saveLead:", err);
        return saveLead(sessionId, data);
      }
    },
  }),

  getCompanyInfoTool: tool({
    description:
      "Retrieves verified details about Elite Property PK's key locations (DHA, Bahria Town, Gulberg, CDA sectors), property categories, investment advice, and client consultation process.",
    inputSchema: z.object({
      topic: z
        .string()
        .describe("The topic to query (e.g. 'locations', 'properties', 'services', 'investment', 'process')."),
    }),
    execute: async ({ topic }) => {
      console.log(`>>> getCompanyInfoTool TRIGGERED for topic: "${topic}"`);

      const companyDetails = {
        company: "Elite Property PK",
        tagline: "Your Trusted Real Estate Partner in Pakistan",
        website: "https://eliteproperty.pk",
        contact_phone: "+92-300-0511111",
        locations: [
          "DHA Islamabad & Rawalpindi (Phases 1 to 9, DHA Valley, DHA Homes, Phase 2 Extension)",
          "Bahria Town Islamabad & Rawalpindi (Phases 1-8, Enclave, Garden City)",
          "Gulberg Greens & Gulberg Residencia Islamabad",
          "CDA Sectors (B-17 Multi Gardens, F-11, E-11, G-13, Park View City)",
        ],
        property_types: [
          "Residential Plots (5 Marla, 10 Marla, 1 Kanal, 2 Kanal)",
          "Commercial Plots & Plazas (4 Marla, 8 Marla, Commercial Files)",
          "Luxury Houses & Designer Villas",
          "Modern Apartments & Penthouses",
        ],
        services: [
          "Property Buying & Selling Assistance",
          "High-ROI Commercial Investment Advisory",
          "Portfolio Management & Plot Assessments",
          "Free Site Visits & Layout Map Delivery on WhatsApp",
        ],
        process:
          "Clients share their phone/WhatsApp number, target area, and budget. Our senior location specialists prepare curated listings, plot maps, and current price trends, and connect directly on WhatsApp within 15 minutes.",
      };

      return JSON.stringify(companyDetails, null, 2);
    },
  }),
});
