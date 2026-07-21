import { supabase } from "@/lib/supabase";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { fileName, fileType, sessionId = "anonymous" } = await req.json();

    if (!fileName) {
      return new Response(JSON.stringify({ error: "Missing fileName" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const fileExt = fileName.split(".").pop() || "png";
    const fileNameOnStorage = `${sessionId}/${Date.now()}.${fileExt}`;
    const filePath = `public/${fileNameOnStorage}`;

    const { data, error } = await supabase.storage
      .from("property-uploads")
      .createSignedUploadUrl(filePath);

    if (error) {
      throw error;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("property-uploads").getPublicUrl(filePath);

    return Response.json({
      signedUrl: data.signedUrl,
      publicUrl,
    });
  } catch (error: any) {
    console.error("Upload API Crash:", error);
    return new Response(JSON.stringify({ error: error?.message || "Upload error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
