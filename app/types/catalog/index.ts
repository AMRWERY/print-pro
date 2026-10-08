import type { Product } from "~/types/home";

export type CatalogCategory =
  | "digital"
  | "lenses"
  | "printers"
  | "substrates"
  | "lighting"
  | "colorimeters";

export type DispatchKey =
  | "in-stock"
  | "consignment"
  | "factory-order"
  | "freight";

export type SortKey = "featured" | "price-asc" | "price-desc" | "rating";

export interface CatalogProduct extends Product {
  sku: string;
  category: CatalogCategory;
  dispatch: DispatchKey;
}

export interface CatalogFilters {
  query: string;
  categories: CatalogCategory[];
  brands: string[];
  priceMin: number | null;
  priceMax: number | null;
  dispatch: DispatchKey[];
  minRating: number | null;
}

export interface FilterChip {
  key: string;
  label: string;
  remove: () => void;
}
