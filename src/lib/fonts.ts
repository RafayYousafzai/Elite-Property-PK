import localFont from "next/font/local";

// Editorial serif used for headings (exposed as --font-display).
// Self-hosted (Cormorant Garamond, latin) so builds don't depend on fetching Google Fonts.
export const display = localFont({
  src: [
    { path: "../fonts/cormorant-garamond-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../fonts/cormorant-garamond-latin-500-italic.woff2", weight: "500", style: "italic" },
    { path: "../fonts/cormorant-garamond-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../fonts/cormorant-garamond-latin-600-italic.woff2", weight: "600", style: "italic" },
  ],
  display: "swap",
  variable: "--font-display",
});
