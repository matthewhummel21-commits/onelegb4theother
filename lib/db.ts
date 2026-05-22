import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DB_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DB_DIR, "requests.db");

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (_db) return _db;

  // Ensure data directory exists
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  _db = new Database(DB_PATH);

  // Enable WAL for better concurrent access
  _db.pragma("journal_mode = WAL");

  _db.exec(`
    CREATE TABLE IF NOT EXISTS requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at TEXT DEFAULT (datetime('now')),
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
      pant_size TEXT,
      waist TEXT,
      inseam TEXT,
      referred_by TEXT,
      notes TEXT,
      id_uploaded INTEGER DEFAULT 0,
      id_file_path TEXT,
      call_notes TEXT,
      verified_by TEXT,
      amazon_link TEXT,
      shipped_at TEXT
    )
  `);

  return _db;
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
  pant_size: string | null;
  waist: string | null;
  inseam: string | null;
  referred_by: string | null;
  notes: string | null;
  id_uploaded: number;
  id_file_path: string | null;
  call_notes: string | null;
  verified_by: string | null;
  amazon_link: string | null;
  shipped_at: string | null;
};
