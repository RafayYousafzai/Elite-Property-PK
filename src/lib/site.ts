// Single source of truth for the public site address. The live site is served
// from the apex domain (www redirects to it), so every canonical URL, sitemap
// entry and structured-data URL must use the apex — never a redirecting host.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://elitepropertypk.com")
  .replace("://www.", "://")
  .replace(/\/$/, "");

export const SITE_NAME = "Elite Property Exchange";

export const absoluteUrl = (path = "/") => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

export const BUSINESS = {
  name: SITE_NAME,
  phone: "+92-334-4111778",
  email: "pk.eliteproperty@gmail.com",
  streetAddress: "2nd Floor, Plaza No. 19, Tipu Boulevard, Sector G, DHA Phase II",
  locality: "Islamabad",
  postalCode: "44000",
  country: "PK",
  geo: { latitude: 33.535113, longitude: 73.170038 },
  mapsUrl: "https://www.google.com/maps/dir/?api=1&destination=33.535113,73.170038",
  // Profiles linked from the site footer
  sameAs: [
    "https://www.facebook.com/elitepropexch/",
    "https://www.instagram.com/elitepropertyexchange/",
    "https://www.tiktok.com/@elitepropertiespk",
    "https://www.youtube.com/@elitepropertypk",
  ],
};
