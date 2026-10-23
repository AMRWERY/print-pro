import type {
  CatalogCategory,
  CatalogProduct,
  CopierAttrs,
  InkAttrs,
  PrinterAttrs,
} from "~/types/catalog";
import type {
  CompareSectionDef,
  ComparePreset,
  ProductCompareData,
  SpecValue,
} from "~/types/compare";
import type { DetailedProduct } from "~/types/product";

export const MAX_COMPARE = 4;

/** Rows to compare, per category. Products are only compared within one category. */
export const compareSections: Record<CatalogCategory, CompareSectionDef[]> = {
  printers: [
    {
      key: "print",
      title: "Printing",
      rows: [
        { key: "technology", label: "Technology", hint: "Inkjet, laser or large-format" },
        { key: "colour", label: "Colour or black & white" },
        { key: "maxPaper", label: "Largest paper size" },
        { key: "duplex", label: "Automatic two-sided printing" },
        { key: "resolution", label: "Maximum resolution" },
        { key: "speed", label: "Print speed" },
        { key: "runningCost", label: "Running cost", hint: "Per page, at 5% coverage" },
      ],
    },
    {
      key: "connect",
      title: "Connectivity and size",
      rows: [
        { key: "connectivity", label: "Connectivity" },
        { key: "paperCapacity", label: "Paper capacity" },
        { key: "dims", label: "Dimensions and weight" },
      ],
    },
  ],
  copiers: [
    {
      key: "performance",
      title: "Performance",
      rows: [
        { key: "ppm", label: "Print and copy speed", hint: "Pages per minute" },
        { key: "paper", label: "Paper size" },
        { key: "colour", label: "Colour or black & white" },
        { key: "duplex", label: "Automatic two-sided" },
        { key: "duty", label: "Monthly duty cycle", hint: "Maximum pages per month" },
        { key: "runningCost", label: "Running cost", hint: "Per page, at 5% coverage" },
      ],
    },
    {
      key: "functions",
      title: "Functions and paper handling",
      rows: [
        { key: "functions", label: "Functions" },
        { key: "capacity", label: "Paper capacity" },
        { key: "scanSpeed", label: "Scan speed" },
        { key: "finishing", label: "Finishing options" },
      ],
    },
    {
      key: "size",
      title: "Size and power",
      rows: [
        { key: "dims", label: "Dimensions and weight" },
        { key: "power", label: "Power" },
      ],
    },
  ],
  "inks-toner": [
    {
      key: "supply",
      title: "Supply",
      rows: [
        { key: "kind", label: "Type" },
        { key: "colour", label: "Colour" },
        { key: "yield", label: "Yield", hint: "Pages or volume" },
        { key: "fits", label: "Fits models" },
      ],
    },
  ],
};

const v = (value: string, note?: string): SpecValue => ({ value, note });

const cap = (s: string) => s[0]!.toUpperCase() + s.slice(1);
const colourLabel = (c: "colour" | "mono") => (c === "colour" ? "Colour" : "Black & white");

/** Spec values every catalog product has, taken from its attributes. */
export const derivedSpecs = (p: DetailedProduct): Record<string, SpecValue> => {
  const cp = p as Partial<CatalogProduct>;
  if (!cp.attrs) return {};
  if (cp.category === "printers") {
    const a = cp.attrs as PrinterAttrs;
    return {
      technology: v(cap(a.technology.replace("-", " "))),
      colour: v(colourLabel(a.colour)),
      maxPaper: v(a.maxPaper),
      duplex: v(a.duplex ? "Yes" : "No"),
      connectivity: v(
        a.connectivity.map((c) => ({ wifi: "Wi-Fi", ethernet: "Ethernet", usb: "USB" })[c]).join(", "),
      ),
    };
  }
  if (cp.category === "copiers") {
    const a = cp.attrs as CopierAttrs;
    return {
      ppm: v(`${a.ppm} ppm`),
      paper: v(a.paper),
      colour: v(colourLabel(a.colour)),
      duplex: v(a.duplex ? "Yes" : "No"),
      functions: v(a.functions.map(cap).join(", ")),
    };
  }
  const a = cp.attrs as InkAttrs;
  return {
    kind: v(cap(a.kind)),
    colour: v(a.colour === "multi" ? "Multi-colour set" : cap(a.colour)),
    yield: v(a.yield),
    fits: v(a.compatibleWith.join(", ")),
  };
};

// Fuller spec sheets for the flagship products. Everything else uses derivedSpecs
// plus the core facts (price, rating, lease, availability) that every product has.
export const compareData: Record<string, ProductCompareData> = {
  "nordjet-lf-44": {
    profile: {
      origin: "Nordjet · wide-format range",
      bench: 98.4,
      highlights: ["44″ roll, A0 posters", "A1 in 28 seconds", "300 ml cartridges"],
      primary: "Add to cart",
      secondary: "View details",
    },
    specs: {
      resolution: v("2400 × 1200 dpi"),
      speed: v("A1 in 28 seconds", "Draft mode"),
      runningCost: v("EGP 4.20 per A1", "Standard mode"),
      paperCapacity: v("One roll, auto cutter"),
      dims: v("1900 × 920 × 1250 mm", "58 kg with stand"),
    },
  },
  "nordjet-lf-24": {
    profile: {
      origin: "Nordjet · wide-format range",
      bench: 96.9,
      highlights: ["24″ roll, A1 drawings", "Compact footprint", "Wi-Fi and Ethernet"],
      primary: "Add to cart",
      secondary: "View details",
    },
    specs: {
      resolution: v("2400 × 1200 dpi"),
      speed: v("A1 in 40 seconds", "Draft mode"),
      runningCost: v("EGP 4.60 per A1", "Standard mode"),
      paperCapacity: v("One roll, auto cutter"),
      dims: v("1020 × 700 × 1100 mm", "34 kg with stand"),
    },
  },
  "kopira-pro-a3-30c": {
    profile: {
      origin: "Kopira · Pro A3 series",
      bench: 97.8,
      highlights: ["30 ppm colour and mono", "Scan to cloud", "Secure print release"],
      primary: "Add to cart",
      secondary: "View details",
    },
    specs: {
      duty: v("150,000 pages"),
      runningCost: v("EGP 0.09 mono · EGP 0.48 colour", "Black and C/M/Y toner"),
      capacity: v("1,150 sheets", "Up to 3,300 with options"),
      scanSpeed: v("80 ipm duplex"),
      finishing: v("Booklet finisher (optional)"),
      dims: v("587 × 685 × 790 mm", "78 kg"),
      power: v("220–240 V, 50/60 Hz"),
    },
  },
  "kopira-pro-a3-45c": {
    profile: {
      origin: "Kopira · Pro A3 series",
      bench: 98.1,
      highlights: ["45 ppm colour", "Booklet finisher", "Large paper capacity"],
      primary: "Add to cart",
      secondary: "View details",
    },
    specs: {
      duty: v("300,000 pages"),
      runningCost: v("EGP 0.08 mono · EGP 0.45 colour", "Black and C/M/Y toner"),
      capacity: v("2,300 sheets", "Up to 6,300 with options"),
      scanSpeed: v("120 ipm duplex"),
      finishing: v("Booklet finisher (included)"),
      dims: v("615 × 750 × 1100 mm", "142 kg"),
      power: v("220–240 V, 50/60 Hz"),
    },
  },
  "kopira-pro-a3-35": {
    profile: {
      origin: "Kopira · Pro A3 series",
      bench: 97.2,
      highlights: ["35 ppm mono", "Finisher ready", "Fax included"],
      primary: "Add to cart",
      secondary: "View details",
    },
    specs: {
      duty: v("200,000 pages"),
      runningCost: v("EGP 0.09 mono", "Black toner"),
      capacity: v("1,150 sheets", "Up to 3,300 with options"),
      scanSpeed: v("80 ipm duplex"),
      finishing: v("Stapling finisher (optional)"),
      dims: v("587 × 685 × 790 mm", "72 kg"),
      power: v("220–240 V, 50/60 Hz"),
    },
  },
};

export const comparePresets: ComparePreset[] = [
  {
    key: "office-printers",
    label: "Office printers",
    title: "Printa Tank 500 vs Corex Laser 210 vs Corex Laser 450 Colour",
    body: "Ink tank, mono laser and colour laser compared on speed, running cost and connectivity.",
    ids: ["printa-tank-500", "corex-laser-210", "corex-laser-450c"],
  },
  {
    key: "a3-copiers",
    label: "A3 photocopiers",
    title: "Kopira Pro A3 25, 35, 30 colour and 45 colour",
    body: "Speed, duty cycle, paper capacity and finishing across the Pro A3 range.",
    ids: ["kopira-pro-a3-25", "kopira-pro-a3-35", "kopira-pro-a3-30c", "kopira-pro-a3-45c"],
  },
  {
    key: "toner",
    label: "Toner yield",
    title: "Corex Toner 210: standard vs high-yield",
    body: "Pages per cartridge and price for the same machine.",
    ids: ["corex-toner-210", "corex-toner-210-hy"],
  },
];
