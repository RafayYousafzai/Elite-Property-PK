import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { r2Client, R2_BUCKET_NAME, uploadToR2 } from "@/lib/r2";
import { extractImagePath } from "@/lib/utils";
import { HeadObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";

export const maxDuration = 300; // 5 minute max duration for Vercel/Next API

async function r2FileExists(key: string) {
  try {
    const command = new HeadObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key });
    await r2Client.send(command);
    return true;
  } catch {
    return false;
  }
}

async function fetchImageBuffer(pathOrUrl: string): Promise<Buffer | null> {
  const cleanPath = extractImagePath(pathOrUrl);
  try {
    const command = new GetObjectCommand({ Bucket: R2_BUCKET_NAME, Key: cleanPath });
    const response = await r2Client.send(command);
    const byteArray = await response.Body?.transformToByteArray();
    if (byteArray) return Buffer.from(byteArray);
  } catch {
    try {
      const fullUrl = pathOrUrl.startsWith("http")
        ? pathOrUrl
        : `https://elitepropertyimages.rafaykhan.website/${cleanPath}`;
      const res = await fetch(fullUrl);
      if (res.ok) {
        const arrayBuffer = await res.arrayBuffer();
        return Buffer.from(arrayBuffer);
      }
    } catch {
      // Ignore
    }
  }
  return null;
}

export async function POST() {
  const supabase = await createClient(cookies());

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: properties, error: dbError } = await supabase
      .from("properties")
      .select("id, name, images, image_paths");

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 400 });
    }

    let totalImages = 0;
    let generatedCount = 0;
    let skippedCount = 0;
    let failedCount = 0;

    for (const prop of properties || []) {
      const imageList =
        prop.image_paths && Array.isArray(prop.image_paths) && prop.image_paths.length > 0
          ? prop.image_paths
          : Array.isArray(prop.images)
          ? prop.images
          : [];

      for (const rawImage of imageList) {
        totalImages++;
        const imagePath = extractImagePath(
          typeof rawImage === "string" ? rawImage : rawImage?.src || rawImage?.url || ""
        );

        if (!imagePath || imagePath.startsWith("thumbnails/")) continue;

        const thumbKey = `thumbnails/${imagePath}`.replace(/\.[^.]+$/, ".webp");
        const exists = await r2FileExists(thumbKey);

        if (exists) {
          skippedCount++;
          continue;
        }

        const originalBuffer = await fetchImageBuffer(imagePath);
        if (!originalBuffer) {
          failedCount++;
          continue;
        }

        try {
          let webpBuffer = await sharp(originalBuffer)
            .resize({ width: 600, withoutEnlargement: true })
            .webp({ quality: 75, effort: 6 })
            .toBuffer();

          if (webpBuffer.length > 40 * 1024) {
            webpBuffer = await sharp(originalBuffer)
              .resize({ width: 500, withoutEnlargement: true })
              .webp({ quality: 65, effort: 6 })
              .toBuffer();
          }

          const thumbFileName = imagePath.split("/").pop()?.replace(/\.[^.]+$/, ".webp") || "thumb.webp";
          const thumbFolder = imagePath.includes("/")
            ? `thumbnails/${imagePath.substring(0, imagePath.lastIndexOf("/"))}`
            : "thumbnails";

          await uploadToR2(webpBuffer, thumbFileName, "image/webp", thumbFolder);
          generatedCount++;
        } catch {
          failedCount++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      totalProperties: properties?.length || 0,
      totalImages,
      generatedCount,
      skippedCount,
      failedCount,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to generate thumbnails" }, { status: 500 });
  }
}
