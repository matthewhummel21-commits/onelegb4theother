/**
 * Move veteran ID files (DD-214 / VA ID) off public blob links.
 *
 * This script does not run unless you pass --confirm.
 * It uses the database and blob store named by the environment you load.
 * There is no new environment variable. It needs the two the site already uses:
 *   DATABASE_URL
 *   BLOB_READ_WRITE_TOKEN
 *
 * See the file once, without connecting to anything:
 *   node scripts/migrate-private-id-files.mjs
 *
 * Run it only when you mean to change that database:
 *   DATABASE_URL="postgres://..." BLOB_READ_WRITE_TOKEN="..." \
 *     node scripts/migrate-private-id-files.mjs --confirm
 *
 * On Vercel, copy those values from Project → Settings → Environment Variables
 * into your shell for this one command. Do not commit them.
 *
 * What it does for each request whose id_file_path is still a public
 * *.public.blob.vercel-storage.com URL:
 *   1. Downloads that file.
 *   2. Saves a new private copy.
 *   3. Points the database row at the private pathname.
 *   4. Deletes the public copy.
 *
 * After step 4, the old public link stops working.
 * If step 2 or 3 fails, the public file is left in place.
 * Rows that are already a private pathname are skipped.
 */

import { del, put } from "@vercel/blob";
import { neon } from "@neondatabase/serverless";

const PUBLIC_HOST = ".public.blob.vercel-storage.com";

function help() {
  console.log(`Private ID-file migration

Does not connect anywhere unless you pass --confirm.

Needs (already used by the site, no new variable):
  DATABASE_URL
  BLOB_READ_WRITE_TOKEN

Run against the database in your shell, production only when you intend to:
  DATABASE_URL="..." BLOB_READ_WRITE_TOKEN="..." node scripts/migrate-private-id-files.mjs --confirm

A finished row's old public link will no longer open, because the public copy is deleted.
`);
}

function isPublicBlobUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname.endsWith(PUBLIC_HOST);
  } catch {
    return false;
  }
}

async function main() {
  if (!process.argv.includes("--confirm")) {
    help();
    process.exit(0);
  }

  const databaseUrl = process.env.DATABASE_URL;
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  if (!databaseUrl || !blobToken) {
    console.error("Refusing to run: DATABASE_URL and BLOB_READ_WRITE_TOKEN must both be set.");
    process.exit(1);
  }

  const sql = neon(databaseUrl);
  const rows = await sql`
    SELECT id, id_file_path
    FROM requests
    WHERE id_file_path IS NOT NULL AND id_file_path <> ''
    ORDER BY id
  `;

  let moved = 0;
  let skipped = 0;
  let failed = 0;

  for (const row of rows) {
    const id = Number(row.id);
    const current = String(row.id_file_path || "");
    if (!isPublicBlobUrl(current)) {
      skipped += 1;
      console.log(`skip ${id}: not a public blob URL`);
      continue;
    }

    let uploadedPath = null;
    try {
      const downloaded = await fetch(current);
      if (!downloaded.ok) {
        throw new Error(`download failed (${downloaded.status})`);
      }
      const bytes = Buffer.from(await downloaded.arrayBuffer());
      const ext = new URL(current).pathname.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
      const contentType = downloaded.headers.get("content-type") || "application/octet-stream";
      const saved = await put(`vet-ids/${crypto.randomUUID()}.${ext}`, bytes, {
        access: "private",
        addRandomSuffix: true,
        contentType,
        token: blobToken,
        cacheControlMaxAge: 60,
      });
      uploadedPath = saved.pathname;
      await sql`UPDATE requests SET id_file_path = ${saved.pathname} WHERE id = ${id}`;
      await del(current, { token: blobToken });
      moved += 1;
      console.log(`moved ${id}`);
    } catch (err) {
      failed += 1;
      const message = err instanceof Error ? err.message : "unknown error";
      console.error(`failed ${id}: ${message}`);
      if (uploadedPath) {
        try {
          await del(uploadedPath, { token: blobToken });
        } catch {
          console.error(`failed ${id}: private copy could not be removed after the database update failed`);
        }
      }
    }
  }

  console.log(`done: moved ${moved}, skipped ${skipped}, failed ${failed}`);
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : "migration failed");
  process.exit(1);
});
