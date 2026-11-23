/**
 * One-time migration script: upload all existing local assets to MinIO.
 *
 * Vendure stores asset identifiers in the DB as bare paths relative to the
 * storage root (e.g. "preview/a1/product.webp", "source/a1/product.jpg").
 * This script walks static/assets/, re-creates that same path hierarchy inside
 * the configured MinIO bucket, and skips files that are already present.
 *
 * Run once after enabling the MinIO storage strategy:
 *   npx ts-node -r tsconfig-paths/register src/scripts/migrate-assets-to-minio.ts
 *
 * Safe to run multiple times – existing objects are never overwritten.
 */

import "dotenv/config";
import fs from "fs";
import path from "path";
import {
  S3Client,
  HeadObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import mime from "mime-types";

const ASSETS_DIR = path.resolve(__dirname, "../../static/assets");
const BUCKET = process.env.MINIO_BUCKET || "vendure-assets";
const ENDPOINT = process.env.MINIO_ENDPOINT || "http://localhost:9000";

const client = new S3Client({
  endpoint: ENDPOINT,
  forcePathStyle: true,
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY || "",
    secretAccessKey: process.env.MINIO_SECRET_KEY || "",
  },
});

async function objectExists(key: string): Promise<boolean> {
  try {
    await client.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }));
    return true;
  } catch {
    return false;
  }
}

async function uploadFile(localPath: string, key: string): Promise<void> {
  const body = fs.readFileSync(localPath);
  const contentType =
    (mime.lookup(localPath) as string | false) || "application/octet-stream";
  await client.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  );
}

function walkDir(dir: string, base: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkDir(full, base));
    } else {
      // Key is the path relative to the assets root, using forward slashes
      files.push(path.relative(base, full).split(path.sep).join("/"));
    }
  }
  return files;
}

async function main(): Promise<void> {
  if (!fs.existsSync(ASSETS_DIR)) {
    console.log(`Assets directory not found at ${ASSETS_DIR} – nothing to migrate.`);
    return;
  }

  const keys = walkDir(ASSETS_DIR, ASSETS_DIR);
  console.log(`Found ${keys.length} file(s) in ${ASSETS_DIR}`);

  let uploaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const key of keys) {
    const localPath = path.join(ASSETS_DIR, key);
    try {
      if (await objectExists(key)) {
        skipped++;
        console.log(`  skip  ${key}`);
        continue;
      }
      await uploadFile(localPath, key);
      uploaded++;
      console.log(`  upload ${key}`);
    } catch (err) {
      failed++;
      console.error(`  ERROR ${key}:`, (err as Error).message);
    }
  }

  console.log(`\nDone. uploaded=${uploaded}  skipped=${skipped}  failed=${failed}`);
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
