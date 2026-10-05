import { Cormorant_Garamond } from "next/font/google";

// Editorial serif used for headings on the Team and About pages (exposed as --font-display)
export const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-display",
});
