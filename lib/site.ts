/**
 * Single source for public facts on onelegb4theother.com.
 *
 * UNCONFIRMED — awaiting the board. Do not invent replacements.
 * The values below are the figures already published on the home page.
 * They are centralized so every page shows the same set.
 * The shop's "100% to veterans, no overhead" claim is not in this file.
 *
 * Confirmed by the board president:
 * - PAIRS_POLICY: "as many pairs as they need". Never "one pair" or "up to 7".
 * - CONTACT_EMAIL: Joseph@onelegb4theother.com (public inbox only; no personal emails)
 * - ADDRESS.suite: 203
 * - Phone (605) 277-2721
 * - Board: Matthew Hummel, President; Joseph Powell, Founder; Rachael Larson, Director
 * - Income is a soft guideline (about 150% of the federal poverty level,
 *   roughly $23,475/yr for a single person). A person reviews every request.
 *   Never auto-deny.
 *
 * Still UNCONFIRMED — awaiting the board:
 * - FUNDS_RAISED, FUNDS_GOAL, FUNDS_GOAL_PERIOD_LABEL ("monthly goal")
 * - VETERANS_WAITING, VETERANS_SUPPORTED, STATES_REACHED, COMMUNITY_SUPPORTERS
 * - CENTS_OF_EVERY_DOLLAR_TO_VETERANS (94) vs MONEY_ALLOCATION (90 / 7 / 3)
 * - SOCIAL_LINKS (profile URLs are not in the repo)
 * - NEWS_STORIES urls (Keloland article URLs are not in the repo)
 * - SPONSORS (the sponsor page promises a logo section; no logos are in the repo)
 * - A photo for Rachael Larson (initials stand in)
 */

export const SITE_NAME = "One Leg B4 the Other";
export const SITE_URL = "https://onelegb4theother.com";
export const FOUNDED_YEAR = 2024;
export const EIN = "99-3332965";

/** IRS Tax Exempt Organization Search. Visitors look the EIN up here. */
export const IRS_TEOS_URL = "https://apps.irs.gov/app/eos/";

export const PHONE_DISPLAY = "(605) 277-2721";
export const PHONE_TEL = "+16052772721";

/** Confirmed public contact. Do not publish anyone's personal email. */
export const CONTACT_EMAIL = "Joseph@onelegb4theother.com";

export function isContactEmailSet(email: string = CONTACT_EMAIL): boolean {
  return email.trim().length > 0 && !email.startsWith("TODO");
}

/** Suite 203 is confirmed by the board. */
export const ADDRESS = {
  street: "230 S Phillips Ave",
  suite: "203",
  city: "Sioux Falls",
  region: "SD",
  regionName: "South Dakota",
  postalCode: "57104",
  country: "US",
} as const;

export function formatAddressLine(): string {
  return `${ADDRESS.street}, Suite ${ADDRESS.suite} · ${ADDRESS.city}, ${ADDRESS.region} ${ADDRESS.postalCode}`;
}

export function formatStreetAddress(): string {
  return `${ADDRESS.street}, Suite ${ADDRESS.suite}`;
}

/** Existing home-page mission line. */
export const MISSION_LINE = "We provide the pants. Veterans put their best foot forward.";

/** Existing home-page explanation, with the confirmed pairs wording. */
export const MISSION_DETAIL =
  "Veterans receive new civilian pants — as many pairs as they need — given with respect.";

/**
 * UNCONFIRMED — awaiting the board.
 * Home progress bar: $11,340 raised of a $20,000 goal, labeled "monthly goal".
 * Whether that goal is actually monthly has not been confirmed. Do not relabel it.
 */
export const FUNDS_RAISED = 11340;
export const FUNDS_GOAL = 20000;
export const FUNDS_GOAL_PERIOD_LABEL = "monthly goal";
export const GOAL_PROGRESS_PERCENT = Math.round((FUNDS_RAISED / FUNDS_GOAL) * 100);

/**
 * UNCONFIRMED — awaiting the board.
 * Hero and progress bar say this count. Stat tiles add a "+" (see HOME_STATS).
 */
export const VETERANS_WAITING = 33;

/** UNCONFIRMED — awaiting the board. Home-page stat tile. */
export const VETERANS_SUPPORTED = 500;

/** UNCONFIRMED — awaiting the board. Founder-story tile on the home page. */
export const STATES_REACHED = 12;

/** UNCONFIRMED — awaiting the board. Founder-story tile on the home page. */
export const COMMUNITY_SUPPORTERS = 933;

/**
 * Confirmed by the board. Use this everywhere a quantity of pants is described.
 * Never write "one pair" or "up to 7".
 */
export const PAIRS_POLICY = "as many pairs as they need";

/** Approximate cost of jeans on the donation form. Not a per-veteran cap. */
export const PAIR_COST_DOLLARS = 35;

/**
 * Confirmed by the board. Soft guideline only — never an automatic denial.
 * About 150% of the federal poverty level, roughly $23,475 a year for a single person.
 */
export const INCOME_GUIDELINE =
  "Income is optional. A soft guideline is about 150% of the federal poverty level, roughly $23,475 a year for a single person. Every request is reviewed by a person. We never turn a request down automatically.";

/**
 * What the request form actually offers.
 * The shop previously called these "adaptive pants". That phrase is removed.
 * Home-page copy stays "a pair of pants" / "a pair of jeans".
 */
export const PANT_OPTIONS_LABEL = "Lee or Wrangler jeans, or sweatpants";

/**
 * UNCONFIRMED — awaiting the board.
 * Headline stat on the home page: 94 cents of every $1 to veterans.
 * This does not match MONEY_ALLOCATION (90 / 7 / 3). Both are existing
 * home-page figures. Do not average them or replace either one.
 * The shop's "100%, no overhead" line has been removed.
 */
export const CENTS_OF_EVERY_DOLLAR_TO_VETERANS = 94;

/**
 * UNCONFIRMED — awaiting the board.
 * "Where Your Money Goes" on the home page. Percents are 90 / 7 / 3.
 * See CENTS_OF_EVERY_DOLLAR_TO_VETERANS — these two displays do not reconcile.
 */
export const MONEY_ALLOCATION = [
  { pct: 90, icon: "👖", label: "Buying & delivering pants to veterans directly" },
  { pct: 7, icon: "🚗", label: "Transportation, outreach & community events" },
  { pct: 3, icon: "📣", label: "Awareness & fundraising to grow our reach" },
] as const;

export const HOME_STATS = [
  { value: VETERANS_SUPPORTED, suffix: "+", label: "Veterans Supported" },
  { value: VETERANS_WAITING, suffix: "+", label: "On the Waitlist Now" },
  { value: CENTS_OF_EVERY_DOLLAR_TO_VETERANS, suffix: "¢", label: "Of every $1 to veterans" },
] as const;

export const STORY_STATS = [
  { value: STATES_REACHED, suffix: "", label: "States Reached" },
  { value: VETERANS_WAITING, suffix: "+", label: "On the Waitlist" },
  { value: COMMUNITY_SUPPORTERS, suffix: "", label: "Community Supporters" },
] as const;

/** The request form promises pants at no charge to the veteran. */
export const COST_TO_VETERAN_DOLLARS = 0;

export type Leader = {
  name: string;
  role: string;
  detail: string;
  /** Null until a real photo is added. Render initials, not an emoji. */
  image: string | null;
  initials: string;
};

/** Confirmed board. Do not list personal emails. Do not add officers who are not on this list. */
export const LEADERSHIP: Leader[] = [
  {
    name: "Matthew Hummel",
    role: "President",
    detail:
      "Matthew leads day-to-day operations, veteran outreach, and mission strategy. He served as an aircraft maintenance and crash recovery technician for 20 years.",
    image: "/images/veteran-pants-fitting.jpg",
    initials: "MH",
  },
  {
    name: "Joseph Powell",
    role: "Founder",
    detail:
      "Joseph started this mission after a prayer and an epiphany. His family's veteran roots made the answer clear: give pants to those who served.",
    image: "/images/joseph-christmas-sponsor.jpg",
    initials: "JP",
  },
  {
    name: "Rachael Larson",
    role: "Director",
    detail: "Rachael Larson serves as a director of One Leg B4 the Other.",
    // No photo is in the repo. Initials stand in. Do not display a personal email.
    image: null,
    initials: "RL",
  },
];

export type NewsStory = {
  outlet: string;
  image: string;
  alt: string;
  /**
   * TODO(board): Keloland story URLs are not in this repo.
   * Leave "" until the real article URL is confirmed. Empty urls are not linked.
   */
  url: string;
};

export const NEWS_STORIES: NewsStory[] = [
  {
    outlet: "Keloland News",
    image: "/images/news-interview-1.jpg",
    alt: "Keloland News interview with One Leg B4 the Other in Sioux Falls, South Dakota",
    url: "",
  },
  {
    outlet: "Keloland News",
    image: "/images/news-interview-2.jpg",
    alt: "Keloland News coverage of One Leg B4 the Other, a Sioux Falls veteran nonprofit",
    url: "",
  },
];

export type SocialLink = {
  name: "Facebook" | "Instagram" | "YouTube";
  /**
   * TODO(board): Profile URL is not in the repo.
   * Leave "" until the board supplies the real profile. Empty urls are not linked.
   */
  url: string;
};

export const SOCIAL_LINKS: SocialLink[] = [
  { name: "Facebook", url: "" },
  { name: "Instagram", url: "" },
  { name: "YouTube", url: "" },
];

export type Sponsor = {
  name: string;
  logoSrc: string;
  url: string;
};

/**
 * TODO(board): /advertise promises a Sponsors section on the website.
 * No approved sponsor list or logo files are in this repo.
 * Leave this empty. Do not invent sponsor names or logos.
 */
export const SPONSORS: Sponsor[] = [];
