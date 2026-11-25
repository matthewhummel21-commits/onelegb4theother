-- ID review columns for pants requests.
--
-- Do not run this against production until you mean to.
-- It only adds columns and backfills the upload time. It does not delete files.
--
-- Run the private-file script first, while the old public files still exist:
--   DATABASE_URL="..." BLOB_READ_WRITE_TOKEN="..." node scripts/migrate-private-id-files.mjs --confirm
--
-- Then run this SQL against that same database, for example:
--   psql "$DATABASE_URL" -f scripts/sql/2026-11-25-id-file-review.sql
--
-- After this, add CRON_SECRET in Vercel and deploy this branch.
-- The daily job will 401 until CRON_SECRET is set, and it will fail until these columns exist.

ALTER TABLE requests ADD COLUMN IF NOT EXISTS id_uploaded_at TIMESTAMP;
ALTER TABLE requests ADD COLUMN IF NOT EXISTS id_review_status TEXT;
ALTER TABLE requests ADD COLUMN IF NOT EXISTS id_reviewed_at TIMESTAMP;
ALTER TABLE requests ADD COLUMN IF NOT EXISTS id_reviewed_by TEXT;
ALTER TABLE requests ADD COLUMN IF NOT EXISTS id_document_type TEXT;
ALTER TABLE requests ADD COLUMN IF NOT EXISTS id_review_note TEXT;

UPDATE requests
SET id_uploaded_at = created_at
WHERE id_file_path IS NOT NULL
  AND id_file_path <> ''
  AND id_uploaded_at IS NULL;
