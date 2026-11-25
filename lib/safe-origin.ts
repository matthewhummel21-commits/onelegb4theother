const ALLOWED_ORIGIN = [
  /^https:\/\/(www\.)?onelegb4theother\.com$/,
  /^https:\/\/[a-z0-9-]+\.vercel\.app$/,
  /^http:\/\/localhost:\d+$/,
];

/** Use the browser origin only when it is this site, a Vercel preview, or local dev. */
export function safeSiteOrigin(origin: string | null, fallback = "https://onelegb4theother.com"): string {
  if (origin && ALLOWED_ORIGIN.some((pattern) => pattern.test(origin))) return origin;
  return fallback;
}
