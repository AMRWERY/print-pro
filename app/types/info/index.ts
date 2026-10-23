export interface InfoSection {
  heading: string;
  /** Paragraphs. */
  body?: string[];
  /** Bulleted list shown after the paragraphs. */
  list?: string[];
}

export interface InfoPage {
  slug: string;
  group: "services" | "guides" | "legal";
  eyebrow: string;
  title: string;
  summary: string;
  icon: string;
  /** Short label/value highlights shown under the intro. */
  facts?: { label: string; value: string }[];
  sections: InfoSection[];
  cta?: { label: string; to: string; text: string };
  /** Shown on legal pages. */
  updated?: string;
}
