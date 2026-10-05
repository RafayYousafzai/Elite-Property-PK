import { createStaticClient } from "@/utils/supabase/static";

// Serves team photos that are stored in the database as base64 data URIs as
// real, cacheable image responses. The URL includes the row's updated_at, so
// a new photo gets a new URL and the long cache never serves a stale one.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string; version: string }> },
) {
  const { id } = await params;

  const { data, error } = await createStaticClient()
    .from("team_members")
    .select("image")
    .eq("id", id)
    .single();

  const image: string | undefined = data?.image;
  if (error || !image) return new Response("Not found", { status: 404 });

  // Regular URL photos: just point there
  if (!image.startsWith("data:")) return Response.redirect(image, 302);

  const match = image.match(/^data:([^;,]+);base64,([\s\S]*)$/);
  if (!match) return new Response("Unsupported image", { status: 415 });

  return new Response(Buffer.from(match[2], "base64"), {
    headers: {
      "Content-Type": match[1],
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
