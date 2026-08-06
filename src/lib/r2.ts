import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

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
