import { tool } from "ai";
import { z } from "zod";
import { after } from "next/server";
import { findListing, searchListings } from "./properties";
import { saveLead } from "./leads";

export const getAgentTools = (sessionId: string) => ({
  searchListings: tool({
    description:
      "Search live Elite Property listings. Results are shown to the visitor as cards automatically. Use whenever the visitor describes what they want or asks what's available.",
    inputSchema: z.object({
      kind: z
        .enum(["house", "apartment", "plot", "commercial", "any"])
        .optional()
        .describe("house = home/villa, apartment = flat/penthouse, plot = land, commercial = shop/office/commercial plot"),
      phase: z.number().int().min(1).max(9).optional().describe("DHA phase number, if named"),
      minPrice: z.number().optional().describe("Minimum price in PKR (1 crore = 10000000)"),
      maxPrice: z.number().optional().describe("Maximum price in PKR (1 crore = 10000000)"),
      minSizeMarla: z.number().optional().describe("Minimum size in marla (1 kanal = 20 marla). For an exact size like '10 marla' set min and max to 10."),
      maxSizeMarla: z.number().optional().describe("Maximum size in marla"),
      minBeds: z.number().int().optional().describe("Minimum bedrooms (houses/apartments only, only if the visitor asked)"),
      keywords: z.string().optional().describe("Specific features to look for, e.g. 'basement', 'corner', 'solar', 'furnished'"),
      sort: z.enum(["best", "price_low", "price_high", "newest"]).optional(),
    }),
    execute: async (filters) => {
      try {
        const { matches, exactCount, relaxed } = await searchListings(filters);
        if (matches.length === 0) {
          return { matches: [], note: "No listings of this kind are available right now. Offer to have an advisor find off-market options." };
        }
        return {
          matches,
          exactMatches: exactCount,
          ...(relaxed.length ? { relaxedFilters: relaxed, note: "Not exact matches — tell the visitor which filters were relaxed." } : null),
        };
      } catch (err) {
        console.error("searchListings failed:", err);
        return { matches: [], note: "Search is temporarily unavailable. Offer a call from an advisor instead." };
      }
    },
  }),

  getListingDetails: tool({
    description:
      "Look up full, current details of one specific listing (price, availability, size, bedrooms, features, installments, description). Use whenever the visitor asks about a particular property.",
    inputSchema: z.object({
      query: z
        .string()
        .describe("The listing's URL slug if known, otherwise how the visitor described it, e.g. '2.5 kanal villa phase 5'"),
    }),
    execute: async ({ query }) => {
      try {
        const result = await findListing(query);
        if ("candidates" in result) {
          return { candidates: result.candidates, note: "Several listings fit; show these and ask which one they mean." };
        }
        if ("notFound" in result) return { notFound: true, note: "No listing matches that description." };
        return result.listing;
      } catch (err) {
        console.error("getListingDetails failed:", err);
        return { error: "Listing lookup is temporarily unavailable." };
      }
    },
  }),

  saveContactDetails: tool({
    description:
      "Save the visitor's contact details so an advisor can follow up. Call as soon as they share their name or phone/WhatsApp number.",
    inputSchema: z.object({
      full_name: z.string().optional(),
      phone_number: z.string().optional().describe("Phone or WhatsApp number exactly as given"),
      looking_for: z.string().optional().describe("Short summary of what they want, e.g. '10 marla house, DHA Phase 2'"),
      budget_range: z.string().optional(),
      purpose: z.string().optional().describe("Buying, selling, renting or investment"),
    }),
    execute: async (data) => {
      // Saving happens after the response so it never slows the reply down
      after(() => saveLead(sessionId, data).catch((err) => console.error("saveLead failed:", err)));
      return { saved: true };
    },
  }),
});
