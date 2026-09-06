import { uploadToR2 } from "@/lib/r2";
import sharp from "sharp";

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      const folder = (formData.get("folder") as string) || "uploads";

      if (!file) {
        return Response.json({ error: "No file provided" }, { status: 400 });
      }

      const fileExt = file.name.split(".").pop() || "jpg";
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Upload main original file
      const { publicUrl, key } = await uploadToR2(
        buffer,
        fileName,
        file.type || "image/jpeg",
        folder
      );

      let thumbPublicUrl = "";
      let thumbKey = "";

      // Generate & upload WebP thumbnail (<40KB) for image uploads
      if (file.type.startsWith("image/")) {
        try {
          let thumbnailBuffer = await sharp(buffer)
            .resize({ width: 600, withoutEnlargement: true })
            .webp({ quality: 75, effort: 6 })
            .toBuffer();

          // Enforce strict < 40 KB file size limit
          if (thumbnailBuffer.length > 40 * 1024) {
            thumbnailBuffer = await sharp(buffer)
              .resize({ width: 500, withoutEnlargement: true })
              .webp({ quality: 65, effort: 6 })
              .toBuffer();
          }

          const thumbFileName = fileName.replace(/\.[^.]+$/, ".webp");
          const thumbFolder = `thumbnails/${folder}`;

          const thumbRes = await uploadToR2(
            thumbnailBuffer,
            thumbFileName,
            "image/webp",
            thumbFolder
          );
          thumbPublicUrl = thumbRes.publicUrl;
          thumbKey = thumbRes.key;
        } catch (thumbErr) {
          console.error("Error generating WebP thumbnail:", thumbErr);
        }
      }

      return Response.json({ publicUrl, key, thumbPublicUrl, thumbKey });
    } else {
      const body = await req.json();
      const { fileName, fileType = "image/jpeg", folder = "uploads" } = body;

      if (!fileName) {
        return Response.json({ error: "Missing fileName" }, { status: 400 });
      }

      const fileExt = fileName.split(".").pop() || "jpg";
      const generatedName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const { publicUrl, key } = await uploadToR2(
        Buffer.from(""),
        generatedName,
        fileType,
        folder
      );

      return Response.json({ publicUrl, key });
    }
  } catch (error: any) {
    console.error("Upload API Crash:", error);
    const errorMessage =
      error?.Code === "Unauthorized" || error?.name === "Unauthorized"
        ? "Cloudflare R2 Unauthorized: Please verify your R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY credentials in .env"
        : error?.message || "Upload error";

    return Response.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
