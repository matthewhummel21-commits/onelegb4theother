import { neon } from "@neondatabase/serverless";
import path from "path";

type SqlTag = (strings: TemplateStringsArray, ...values: unknown[]) => Promise<Record<string, unknown>[]>;

/** SQLite fallback for local dev — same tagged-template API as neon */
function createLocalSqlite(): SqlTag {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Database = require("better-sqlite3");
  const dbPath = path.join(process.cwd(), "local.db");
  const db = new Database(dbPath);

  return function tag(strings: TemplateStringsArray, ...values: unknown[]): Promise<Record<string, unknown>[]> {
    let query = "";
    strings.forEach((s, i) => {
      query += s;
      if (i < values.length) query += "?";
    });

    // SQLite can't bind undefined or booleans — sanitize all values
    const safeValues = values.map(v =>
      v === undefined ? null
      : v === true ? 1
      : v === false ? 0
      : v
    );

    // Convert PostgreSQL syntax → SQLite
    query = query
      .replace(/SERIAL PRIMARY KEY/gi, "INTEGER PRIMARY KEY AUTOINCREMENT")
      .replace(/TIMESTAMP DEFAULT NOW\(\)/gi, "DATETIME DEFAULT CURRENT_TIMESTAMP")
      .replace(/\bTIMESTAMP\b/gi, "DATETIME")
      .replace(/BOOLEAN DEFAULT FALSE/gi, "INTEGER DEFAULT 0")
      .replace(/BOOLEAN DEFAULT TRUE/gi, "INTEGER DEFAULT 1")
      .replace(/\bBOOLEAN\b/gi, "INTEGER")
      .replace(/NOW\(\)/gi, "CURRENT_TIMESTAMP");

    const trimmed = query.trim();
    const upper = trimmed.toUpperCase();

    try {
      // ALTER TABLE … ADD COLUMN [IF NOT EXISTS] — emulate for SQLite
      if (upper.includes("ALTER TABLE") && upper.includes("ADD COLUMN")) {
        // Extract table name and column name so we can check existence first
        const tableMatch = trimmed.match(/ALTER\s+TABLE\s+(\w+)/i);
        const colMatch = trimmed.match(/ADD\s+COLUMN\s+(?:IF\s+NOT\s+EXISTS\s+)?(\w+)/i);
        if (tableMatch && colMatch) {
          const [, tableName] = tableMatch;
          const [, colName] = colMatch;
          const cols = db.prepare(`PRAGMA table_info(${tableName})`).all() as { name: string }[];
          if (cols.some(c => c.name === colName)) return Promise.resolve([]); // already exists
          // Remove IF NOT EXISTS clause before running
          const safe = trimmed.replace(/\bIF\s+NOT\s+EXISTS\b/gi, "").replace(/\s+/, " ");
          db.prepare(safe).run();
        }
        return Promise.resolve([]);
      }

      // INSERT … RETURNING id
      if (upper.startsWith("INSERT") && upper.includes("RETURNING")) {
        const withoutReturning = trimmed.replace(/\s+RETURNING\s+\w+\s*$/i, "");
        const info = db.prepare(withoutReturning).run(...safeValues);
        return Promise.resolve([{ id: info.lastInsertRowid }]);
      }

      // DDL / DML with no rows returned
      if (upper.startsWith("CREATE") || upper.startsWith("UPDATE") || upper.startsWith("DELETE")) {
        db.prepare(trimmed).run(...safeValues);
        return Promise.resolve([]);
      }

      // SELECT
      const rows = db.prepare(trimmed).all(...safeValues) as Record<string, unknown>[];
      return Promise.resolve(rows.map(r => ({
        ...r,
        wants_follow_up_call: Boolean(r.wants_follow_up_call),
        id_uploaded: Boolean(r.id_uploaded),
      })));

    } catch (err) {
      console.error("[SQLite] error:", err, "\nQuery:", trimmed);
      return Promise.reject(err);
    }
  };
}

let _localDb: SqlTag | null = null;

function getSql() {
  if (!process.env.DATABASE_URL) {
    if (!_localDb) _localDb = createLocalSqlite();
    return _localDb;
  }
  return neon(process.env.DATABASE_URL);
}

export type RequestRow = {
  id: number;
  created_at: string;
  status: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  branch: string | null;
  years_served: string | null;
  household_size: string | null;
  annual_income: string | null;
  pant_type: string | null;
  pant_fit: string | null;
  pant_color: string | null;
  pant_brand: string | null;
  pant_size: string | null;
  waist: string | null;
  inseam: string | null;
  referred_by: string | null;
  notes: string | null;
  wants_follow_up_call: boolean;
  id_uploaded: boolean;
  id_file_path: string | null;
  call_notes: string | null;
  verified_by: string | null;
  amazon_link: string | null;
  printful_order_id: string | null;
  shipped_at: string | null;
};

export async function initDb(): Promise<void> {
  try {
    const sql = getSql();
    await sql`
      CREATE TABLE IF NOT EXISTS requests (
        id SERIAL PRIMARY KEY,
        created_at TIMESTAMP DEFAULT NOW(),
        status TEXT DEFAULT 'pending',
        first_name TEXT,
        last_name TEXT,
        email TEXT,
        phone TEXT,
        address TEXT,
        city TEXT,
        state TEXT,
        zip TEXT,
        branch TEXT,
        years_served TEXT,
        household_size TEXT,
        annual_income TEXT,
        pant_type TEXT,
        pant_fit TEXT,
        pant_color TEXT,
        pant_brand TEXT,
        pant_size TEXT,
        waist TEXT,
        inseam TEXT,
        referred_by TEXT,
        notes TEXT,
        wants_follow_up_call BOOLEAN DEFAULT FALSE,
        id_uploaded BOOLEAN DEFAULT FALSE,
        id_file_path TEXT,
        call_notes TEXT,
        verified_by TEXT,
        amazon_link TEXT,
        shipped_at TIMESTAMP
      )
    `;
    // Migrations — add columns that may not exist on older tables
    await sql`ALTER TABLE requests ADD COLUMN IF NOT EXISTS pant_fit TEXT`;
    await sql`ALTER TABLE requests ADD COLUMN IF NOT EXISTS pant_color TEXT`;
    await sql`ALTER TABLE requests ADD COLUMN IF NOT EXISTS pant_brand TEXT`;
    await sql`ALTER TABLE requests ADD COLUMN IF NOT EXISTS wants_follow_up_call BOOLEAN DEFAULT FALSE`;
    await sql`ALTER TABLE requests ADD COLUMN IF NOT EXISTS printful_order_id TEXT`;
  } catch (err) {
    console.error("initDb error:", err);
    throw err;
  }
}

export async function insertRequest(data: {
  status: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  branch?: string | null;
  yearsServed?: string | null;
  householdSize?: string | null;
  annualIncome?: string | null;
  pantType?: string | null;
  pantFit?: string | null;
  pantColor?: string | null;
  pantBrand?: string | null;
  pantSize?: string | null;
  waist?: string | null;
  inseam?: string | null;
  referredBy?: string | null;
  notes?: string | null;
  wantsFollowUpCall?: boolean;
  idUploaded?: boolean;
  idFilePath?: string | null;
  verifiedBy?: string | null;
}): Promise<number> {
  const sql = getSql();
  const rows = await sql`
    INSERT INTO requests (
      status, first_name, last_name, email, phone,
      address, city, state, zip,
      branch, years_served,
      household_size, annual_income,
      pant_type, pant_fit, pant_color, pant_brand, pant_size, waist, inseam,
      referred_by, notes,
      wants_follow_up_call, id_uploaded, id_file_path, verified_by
    ) VALUES (
      ${data.status},
      ${data.firstName ?? null},
      ${data.lastName ?? null},
      ${data.email ?? null},
      ${data.phone ?? null},
      ${data.address ?? null},
      ${data.city ?? null},
      ${data.state ?? null},
      ${data.zip ?? null},
      ${data.branch ?? null},
      ${data.yearsServed ?? null},
      ${data.householdSize ?? null},
      ${data.annualIncome ?? null},
      ${data.pantType ?? null},
      ${data.pantFit ?? null},
      ${data.pantColor ?? null},
      ${data.pantBrand ?? null},
      ${data.pantSize ?? null},
      ${data.waist ?? null},
      ${data.inseam ?? null},
      ${data.referredBy ?? null},
      ${data.notes ?? null},
      ${data.wantsFollowUpCall ?? false},
      ${data.idUploaded ?? false},
      ${data.idFilePath ?? null},
      ${data.verifiedBy ?? null}
    )
    RETURNING id
  `;
  return (rows[0] as { id: number }).id;
}

export async function getAllRequests(): Promise<RequestRow[]> {
  const sql = getSql();
  const rows = await sql`
    SELECT * FROM requests ORDER BY created_at DESC
  `;
  return rows as RequestRow[];
}

export async function getRequestById(id: number): Promise<RequestRow | null> {
  const sql = getSql();
  const rows = await sql`
    SELECT * FROM requests WHERE id = ${id}
  `;
  return (rows[0] as RequestRow) ?? null;
}

export async function updateRequestStatus(
  id: number,
  status: string,
  extra?: {
    callNotes?: string | null;
    verifiedBy?: string | null;
    amazonLink?: string | null;
    shippedAt?: string | null;
  }
): Promise<void> {
  const sql = getSql();

  if (!extra || Object.keys(extra).length === 0) {
    await sql`UPDATE requests SET status = ${status} WHERE id = ${id}`;
    return;
  }

  // Build update conditionally — Neon tagged template doesn't support dynamic field lists,
  // so we handle each combination explicitly.
  const { callNotes, verifiedBy, amazonLink, shippedAt } = extra;
  const printfulOrderId = (extra as { printfulOrderId?: string | null }).printfulOrderId;

  if (printfulOrderId !== undefined && verifiedBy !== undefined) {
    await sql`
      UPDATE requests
      SET status = ${status},
          printful_order_id = ${printfulOrderId ?? null},
          verified_by = COALESCE(verified_by, ${verifiedBy ?? "manual"})
      WHERE id = ${id}
    `;
  } else if (amazonLink !== undefined && verifiedBy !== undefined) {
    await sql`
      UPDATE requests
      SET status = ${status},
          amazon_link = ${amazonLink ?? null},
          verified_by = COALESCE(verified_by, ${verifiedBy ?? "manual"})
      WHERE id = ${id}
    `;
  } else if (callNotes !== undefined && verifiedBy !== undefined) {
    await sql`
      UPDATE requests
      SET status = ${status},
          call_notes = ${callNotes ?? null},
          verified_by = ${verifiedBy ?? null}
      WHERE id = ${id}
    `;
  } else if (shippedAt !== undefined) {
    await sql`
      UPDATE requests
      SET status = ${status},
          shipped_at = NOW()
      WHERE id = ${id}
    `;
  } else {
    await sql`UPDATE requests SET status = ${status} WHERE id = ${id}`;
  }
}
