export interface PrintSize {
  value: string;
  label: string;
  /** Width × height in inches (custom has none). */
  w?: number;
  h?: number;
  note: string;
  price: number;
}

export interface PrintSubstrate {
  value: string;
  name: string;
  spec: string;
  tag: string;
  description: string;
  detail: string;
  /** Added to every print. */
  delta: number;
  /** Whether the paper is coated on both sides. */
  duplex: boolean;
  /** CSS filter that nudges the soft-proof towards the paper's tone. */
  tint: string;
}

export interface PrintChoice {
  value: string;
  name: string;
  description: string;
  note?: string;
  price: number;
}

export interface PrintConfig {
  copies: number;
  size: string;
  customW: number;
  customL: number;
  substrate: string;
  ink: string;
  duplex: "single" | "double";
  binding: string;
  edges: string[];
  dispatch: string;
}

export interface CostLine {
  key: string;
  label: string;
  amount: number;
}

export type PreflightState = "idle" | "pass" | "warn" | "review";

/** One card in a choice group; extra fields are passed to the card's slot. */
export interface PrintOption {
  value: string;
  disabled?: boolean;
  reason?: string;
  [key: string]: unknown;
}
