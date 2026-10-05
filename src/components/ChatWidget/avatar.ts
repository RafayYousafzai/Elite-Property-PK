// The assistant's avatar is proxied through Next's image optimizer so it loads
// from the site's own domain (some ISPs have trouble reaching the photo host).
const AVATAR_SOURCE =
  "https://plus.unsplash.com/premium_photo-1671656349218-5218444643d8?q=80&w=256&auto=format&fit=crop";

export const AVATAR_URL = `/_next/image?url=${encodeURIComponent(AVATAR_SOURCE)}&w=128&q=75`;
