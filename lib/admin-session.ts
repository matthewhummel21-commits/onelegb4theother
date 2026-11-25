/** Session cookie value derived from ADMIN_PASSWORD. Not the password itself. */

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function sameText(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function expectedAdminSession(): Promise<string | null> {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`olb4o-admin-session:v1:${password}`)
  );
  return bytesToHex(new Uint8Array(digest));
}

export async function isAdminSession(cookieValue: string | undefined): Promise<boolean> {
  const expected = await expectedAdminSession();
  if (!expected || !cookieValue) return false;
  return sameText(cookieValue, expected);
}
