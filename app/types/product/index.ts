import type { Product } from "~/types/home";

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

/** Any product that can have a details page. */
export type DetailedProduct = Product & { sku?: string };

export interface GalleryItem {
  label: string;
  src?: string;
  alt?: string;
  icon?: string;
}

export interface PackageOption {
  id: string;
  label: string;
  note: string;
  /** Added to the base price. */
  delta: number;
}

export interface SpecGroup {
  title: string;
  rows: { label: string; value: string }[];
}

export interface DocumentLink {
  title: string;
  meta: string;
  icon: string;
}

export interface ReviewItem {
  author: string;
  location: string;
  badge: string;
  title: string;
  body: string;
  date: string;
}

export interface ReviewSummary {
  score: number;
  count: number;
  /** Counts for 5, 4, 3, 2, 1 stars. */
  distribution: number[];
  items: ReviewItem[];
}

export interface ProductDetail {
  subtitle: string;
  crumbs?: BreadcrumbItem[];
  compareAt?: number;
  stockLabel: string;
  leaseNote?: string;
  gallery: GalleryItem[];
  packages: PackageOption[];
  assurance: string[];
  keyFacts: { label: string; value: string }[];
  feature?: {
    eyebrow: string;
    title: string;
    body: string;
    cards: { eyebrow: string; title: string; body: string; metric: string }[];
  };
  benchmark?: {
    title: string;
    note: string;
    columns: string[];
    rows: string[][];
  };
  specGroups: SpecGroup[];
  documents: DocumentLink[];
  reviews?: ReviewSummary;
  qa: { q: string; a: string }[];
  related: string[];
}