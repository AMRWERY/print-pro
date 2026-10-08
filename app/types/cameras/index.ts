import type { Product } from "~/types/home";

export type CameraSub =
  | "backs"
  | "mirrorless"
  | "cine"
  | "achromatic"
  | "pro35"
  | "technical";

export type CameraAvailability = "immediate" | "certified" | "preorder";

export interface CameraProduct extends Product {
  sku: string;
  sub: CameraSub;
  /** e.g. "44×33 mm" */
  sensor: string;
  mount: string;
  megapixels: number;
  availability: CameraAvailability;
}

export interface CameraFacets {
  sub: CameraSub[];
  sensor: string[];
  mount: string[];
  availability: CameraAvailability[];
  minMegapixels: number | null;
  priceMin: number | null;
  priceMax: number | null;
}

export interface Flagship {
  id: string;
  tag: string;
  tone: "accent" | "warning";
  sku: string;
  name: string;
  price: number;
  blurb: string;
  specs: { label: string; value: string }[];
  action: string;
  secondary?: string;
  icon: string;
  image?: string;
}
