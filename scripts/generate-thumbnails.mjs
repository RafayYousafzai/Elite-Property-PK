import { createClient } from "@supabase/supabase-js";
import { S3Client, PutObjectCommand, HeadObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import fs from "fs";
import path from "path";

// Load .env file manually if env variables are not present
function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf8");
    envContent.split("\n").forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        const [key, ...valueParts] = trimmed.split("=");
        if (key && valueParts.length > 0) {
          const val = valueParts.join("=").replace(/^["']|["']$/g, "").trim();
          if (!process.env[key.trim()]) {
            process.env[key.trim()] = val;
          }
        }
      }
    });
  }
}

loadEnv();

const cleanEnv = (val) => (val || "").replace(/^["']|["']$/g, "").trim();

const SUPABASE_URL = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_URL);
const SUPABASE_SERVICE_ROLE_KEY = cleanEnv(process.env.SUPABASE_SERVICE_ROLE_KEY) || cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const R2_ACCOUNT_ID = cleanEnv(process.env.R2_ACCOUNT_ID);
const R2_ACCESS_KEY_ID = cleanEnv(process.env.R2_ACCESS_KEY_ID);
const R2_SECRET_ACCESS_KEY = cleanEnv(process.env.R2_SECRET_ACCESS_KEY);
const R2_BUCKET_NAME = cleanEnv(process.env.R2_BUCKET_NAME) || "elitepropertypk-assets";
const R2_PUBLIC_URL = cleanEnv(process.env.NEXT_PUBLIC_R2_PUBLIC_URL) || "https://pub-3261296f3c5c402391d7ed7b63fbdd6e.r2.dev";

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ Missing Supabase URL or Key in environment");
  process.exit(1);
}

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
  console.error("❌ Missing Cloudflare R2 Credentials in environment");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

function extractImagePath(urlOrPath) {
  if (!urlOrPath || typeof urlOrPath !== "string") return "";
  let clean = urlOrPath.trim();
  if (clean.startsWith("http://") || clean.startsWith("https://")) {
    clean = clean.replace(/^https?:\/\/[^\/]+\//, "");
  }
  if (clean.startsWith("/")) {
    clean = clean.slice(1);
  }
  return clean;
}

async function r2FileExists(key) {
  try {
    const command = new HeadObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key });
    await r2Client.send(command);
    return true;
  } catch (err) {
    if (err.name === "NotFound" || err.$metadata?.httpStatusCode === 404) {
      return false;
    }
    return false;
  }
}

async function fetchImageBuffer(pathOrUrl) {
  const cleanPath = extractImagePath(pathOrUrl);
  // First attempt: try downloading directly from R2 bucket via S3 client
  try {
    const command = new GetObjectCommand({ Bucket: R2_BUCKET_NAME, Key: cleanPath });
    const response = await r2Client.send(command);
    const byteArray = await response.Body.transformToByteArray();
    return Buffer.from(byteArray);
  } catch (r2Err) {
    // Second attempt: fetch via HTTP public domain URL
    try {
      const fullUrl = pathOrUrl.startsWith("http")
        ? pathOrUrl
        : `https://elitepropertyimages.rafaykhan.website/${cleanPath}`;
      const res = await fetch(fullUrl);
      if (res.ok) {
        const arrayBuffer = await res.arrayBuffer();
        return Buffer.from(arrayBuffer);
      }
    } catch (httpErr) {
      // Ignore
    }
  }
  return null;
}

async function runThumbnailMigration() {
  console.log("\n🚀 Starting Safe Production WebP Thumbnail Migration (<40 KB)...");
  console.log(`Bucket: ${R2_BUCKET_NAME}`);

  const { data: properties, error } = await supabase
    .from("properties")
    .select("id, name, images, image_paths");

  if (error) {
    console.error("❌ Error fetching properties from Supabase:", error);
    process.exit(1);
  }

  console.log(`📋 Found ${properties.length} properties in database.\n`);

  let totalImagesCount = 0;
  let generatedCount = 0;
  let skippedCount = 0;
  let failedCount = 0;
  let totalSavedBytes = 0;

  for (let i = 0; i < properties.length; i++) {
    const prop = properties[i];
    const imageList = (prop.image_paths && prop.image_paths.length > 0)
      ? prop.image_paths
      : (prop.images || []);

    if (!Array.isArray(imageList) || imageList.length === 0) continue;

    console.log(`[${i + 1}/${properties.length}] Property: "${prop.name}" (${imageList.length} images)`);

    for (let j = 0; j < imageList.length; j++) {
      totalImagesCount++;
      const rawImage = imageList[j];
      const imagePath = extractImagePath(typeof rawImage === "string" ? rawImage : rawImage?.src || rawImage?.url || "");

      if (!imagePath || imagePath.startsWith("thumbnails/")) continue;

      const thumbKey = `thumbnails/${imagePath}`.replace(/\.[^.]+$/, ".webp");

      // Check if thumbnail already exists in R2
      const exists = await r2FileExists(thumbKey);
      if (exists) {
        skippedCount++;
        process.stdout.write(`  - Image ${j + 1}: Exists (${thumbKey})\n`);
        continue;
      }

      // Download original image
      const originalBuffer = await fetchImageBuffer(imagePath);
      if (!originalBuffer) {
        failedCount++;
        console.error(`  ❌ Image ${j + 1}: Failed to download (${imagePath})`);
        continue;
      }

      try {
        // Compress & convert to 600px WebP (target 25-40 KB)
        let webpBuffer = await sharp(originalBuffer)
          .resize({ width: 600, withoutEnlargement: true })
          .webp({ quality: 75, effort: 6 })
          .toBuffer();

        // Enforce strict <40 KB limit if necessary
        if (webpBuffer.length > 40 * 1024) {
          webpBuffer = await sharp(originalBuffer)
            .resize({ width: 500, withoutEnlargement: true })
            .webp({ quality: 65, effort: 6 })
            .toBuffer();
        }

        // Upload WebP thumbnail to R2
        const putCommand = new PutObjectCommand({
          Bucket: R2_BUCKET_NAME,
          Key: thumbKey,
          Body: webpBuffer,
          ContentType: "image/webp",
          CacheControl: "public, max-age=31536000, immutable",
        });

        await r2Client.send(putCommand);
        generatedCount++;

        const origKb = (originalBuffer.length / 1024).toFixed(1);
        const webpKb = (webpBuffer.length / 1024).toFixed(1);
        const savedKb = Math.max(0, originalBuffer.length - webpBuffer.length);
        totalSavedBytes += savedKb;

        console.log(`  ✅ Image ${j + 1}: Generated ${thumbKey} (${origKb} KB -> ${webpKb} KB)`);
      } catch (procErr) {
        failedCount++;
        console.error(`  ❌ Image ${j + 1}: Sharp processing error:`, procErr.message);
      }
    }
  }

  console.log("\n==========================================");
  console.log("🎉 Thumbnail Migration Completed Successfully!");
  console.log(`Total Properties Processed: ${properties.length}`);
  console.log(`Total Images Evaluated: ${totalImagesCount}`);
  console.log(`New WebP Thumbnails Created: ${generatedCount}`);
  console.log(`Thumbnails Already Existing (Skipped): ${skippedCount}`);
  console.log(`Failed Downloads/Generations: ${failedCount}`);
  console.log(`Total Bandwidth Saved: ${(totalSavedBytes / (1024 * 1024)).toFixed(2)} MB`);
  console.log("==========================================\n");
}

runThumbnailMigration().catch((err) => {
  console.error("Migration Fatal Error:", err);
  process.exit(1);
});
