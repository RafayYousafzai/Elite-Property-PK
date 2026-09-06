import { S3Client, PutObjectCommand, DeleteObjectCommand, DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { extractImagePath } from "./utils";

const cleanEnv = (val?: string) => (val || "").replace(/^["']|["']$/g, "").trim();

const accountId = cleanEnv(process.env.R2_ACCOUNT_ID);
const accessKeyId = cleanEnv(process.env.R2_ACCESS_KEY_ID);
const secretAccessKey = cleanEnv(process.env.R2_SECRET_ACCESS_KEY);
export const R2_BUCKET_NAME = cleanEnv(process.env.R2_BUCKET_NAME) || "elitepropertypk-assets";
export const R2_PUBLIC_URL = (
  cleanEnv(process.env.NEXT_PUBLIC_R2_PUBLIC_URL) ||
  "https://pub-3261296f3c5c402391d7ed7b63fbdd6e.r2.dev"
).replace(/\/$/, "");

export const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export async function uploadToR2(
  fileBuffer: Buffer | Uint8Array,
  fileName: string,
  contentType: string,
  folder: string = "uploads"
): Promise<{ key: string; publicUrl: string }> {
  const cleanFolder = folder.replace(/^\/+|\/+$/g, "");
  const key = cleanFolder ? `${cleanFolder}/${fileName}` : fileName;

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: fileBuffer,
    ContentType: contentType,
    CacheControl: "public, max-age=31536000, immutable",
  });

  await r2Client.send(command);

  const publicUrl = `${R2_PUBLIC_URL}/${key}`;

  return { key, publicUrl };
}

export async function deleteFromR2(key: string): Promise<boolean> {
  try {
    const cleanKey = extractImagePath(key);
    if (!cleanKey) return false;
    const command = new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: cleanKey,
    });
    await r2Client.send(command);
    return true;
  } catch (err) {
    console.error("Failed to delete object from R2:", key, err);
    return false;
  }
}

export async function deleteMultipleFromR2(keys: string[]): Promise<boolean> {
  const allKeys: string[] = [];

  keys.forEach((key) => {
    const cleanKey = extractImagePath(key);
    if (cleanKey) {
      allKeys.push(cleanKey);
      // Also delete corresponding WebP thumbnail if main image
      if (!cleanKey.startsWith("thumbnails/")) {
        const thumbKey = `thumbnails/${cleanKey}`.replace(/\.[^.]+$/, ".webp");
        allKeys.push(thumbKey);
      }
    }
  });

  const validKeys = Array.from(new Set(allKeys));
  if (validKeys.length === 0) return true;

  try {
    const command = new DeleteObjectsCommand({
      Bucket: R2_BUCKET_NAME,
      Delete: {
        Objects: validKeys.map((k) => ({ Key: k })),
        Quiet: true,
      },
    });
    await r2Client.send(command);
    return true;
  } catch (err) {
    console.error("Failed to delete objects from R2:", keys, err);
    await Promise.allSettled(validKeys.map((k) => deleteFromR2(k)));
    return false;
  }
}
