import { neon } from "@neondatabase/serverless";

function getSql() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set. Add Neon storage in Vercel or set DATABASE_URL locally.");
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

  const { callNotes, verifiedBy, amazonLink, shippedAt } = extra;

  // Build update conditionally — Neon tagged template doesn't support dynamic field lists,
  // so we handle each combination explicitly.
  if (amazonLink !== undefined && verifiedBy !== undefined) {
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
