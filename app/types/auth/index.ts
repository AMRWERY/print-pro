export type Tier = "business" | "reseller" | "home";

/** The account as the API returns it (never includes the password). */
export interface Account {
  id: string;
  email: string;
  role: "customer" | "admin";
  name: string;
  studio: string;
  tier: Tier;
  newsletter: boolean;
  /** Job title shown on the profile. */
  title?: string;
  phone?: string;
  createdAt: string;
}

export type LoginResult =
  | { ok: true }
  | { ok: false; reason: "invalid" }
  | { ok: false; reason: "locked"; retryInSeconds: number };

export type Validatable = { validate: () => Promise<{ valid: boolean }> };
