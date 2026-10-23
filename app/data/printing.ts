import type {
  CostLine,
  PrintChoice,
  PrintConfig,
  PrintSize,
  PrintSubstrate,
} from "~/types/printing";

// Print Lab price list. There is no pricing service yet, so the configurator prices from this file.

export const MAX_FILE_MB = 500;
export const FILE_PATTERN = /\.(tiff?|psd|pdf|jpe?g|png)$/i;
export const FILE_ACCEPT = [
  ".tif",
  ".tiff",
  ".psd",
  ".pdf",
  ".jpg",
  ".jpeg",
  ".png",
];

export const sizes: PrintSize[] = [
  {
    value: "a4",
    label: "A4 Document",
    w: 8.3,
    h: 11.7,
    note: '8.3" × 11.7" (210 × 297 mm)',
    price: 8,
  },
  {
    value: "a3",
    label: "A3 Drawing",
    w: 11.7,
    h: 16.5,
    note: '11.7" × 16.5" (297 × 420 mm)',
    price: 15,
  },
  {
    value: "a2",
    label: "A2 Poster",
    w: 16.5,
    h: 23.4,
    note: '16.5" × 23.4" (420 × 594 mm)',
    price: 45,
  },
  {
    value: "a1",
    label: "A1 Plan",
    w: 23.4,
    h: 33.1,
    note: '23.4" × 33.1" (594 × 841 mm)',
    price: 85,
  },
  {
    value: "a0",
    label: "A0 Large poster",
    w: 33.1,
    h: 46.8,
    note: '33.1" × 46.8" (841 × 1189 mm)',
    price: 150,
  },
  {
    value: "custom",
    label: "Custom roll size",
    note: 'Continuous up to 44" width',
    price: 0,
  },
];

/** Custom sizes are priced by area. */
export const CUSTOM_PER_SQFT = 14;
export const CUSTOM_MAX_WIDTH = 44;

export const substrates: PrintSubstrate[] = [
  {
    value: "plain",
    name: "Plain Paper",
    spec: "80gsm · bright white",
    tag: "Everyday",
    description:
      "Bright white office paper for drafts, documents and CAD checks. The lowest cost per page.",
    detail: "Best value",
    delta: 0,
    duplex: true,
    tint: "none",
  },
  {
    value: "coated",
    name: "Coated Paper",
    spec: "130gsm · coated matt",
    tag: "Sharp lines",
    description:
      "Coated stock that keeps thin lines and small text crisp. Good for technical drawings, flyers and reports.",
    detail: "Crisp detail",
    delta: 6,
    duplex: true,
    tint: "contrast(1.04)",
  },
  {
    value: "poster",
    name: "Poster Paper",
    spec: "190gsm · satin",
    tag: "Posters",
    description:
      "Heavier satin paper with rich colour for posters, menus and displays.",
    detail: "Rich colour",
    delta: 12,
    duplex: false,
    tint: "contrast(1.06) saturate(1.04)",
  },
  {
    value: "card",
    name: "Silk Card",
    spec: "300gsm · silk coated",
    tag: "Cards & covers",
    description:
      "Stiff silk-coated card for report covers, business cards and signage.",
    detail: "Premium feel",
    delta: 16,
    duplex: true,
    tint: "saturate(1.02)",
  },
];

export const inks: PrintChoice[] = [
  {
    value: "colour",
    name: "Full colour",
    description:
      "Vivid, accurate colour from our wide-format and laser machines. Good for presentations, posters and marketing.",
    note: "Colour check included",
    price: 0,
  },
  {
    value: "mono",
    name: "Black & white",
    description:
      "Sharp text and line work at the lowest price. Best for plans, forms and documents.",
    note: "Lowest cost per page",
    price: 0,
  },
];

export const bindings: PrintChoice[] = [
  {
    value: "loose",
    name: "None / loose sheets",
    description: "Delivered flat",
    price: 0,
  },
  {
    value: "staple",
    name: "Stapled corner",
    description: "Up to 30 sheets",
    price: 5,
  },
  {
    value: "spiral",
    name: "Spiral binding",
    description: "Plastic comb with a clear cover",
    price: 25,
  },
  {
    value: "hardcover",
    name: "Hardcover binding",
    description: "Thermal glue, cloth cover",
    price: 60,
  },
];

/** Priced per print. */
export const edges: PrintChoice[] = [
  {
    value: "trim",
    name: "Trim to size",
    description:
      "Cut to the exact size you choose with a guillotine, for clean straight edges.",
    price: 3,
  },
  {
    value: "laminate",
    name: "Gloss or matt lamination",
    description:
      "Protects posters and menus from spills, fingerprints and everyday wear.",
    price: 12,
  },
  {
    value: "foam",
    name: "Mounted on foam board",
    description:
      "Rigid 5 mm foam board backing for displays, exhibitions and shop windows.",
    price: 20,
  },
  {
    value: "border",
    name: "White border",
    description:
      "Adds a clean white margin around the artwork, so nothing is cut off when framed.",
    price: 0,
  },
];

export const dispatches: PrintChoice[] = [
  {
    value: "courier",
    name: "Courier delivery",
    description:
      "Insured courier, flat-packed or rolled in a protective tube. Tracking included.",
    note: "2–3 business days",
    price: 25,
  },
  {
    value: "pickup",
    name: "Pick up from our branch",
    description:
      "Collect your order from our print room as soon as it is ready. We email you when it is.",
    note: "Free",
    price: 0,
  },
];

export const volumeTiers = [
  { from: 10, rate: 0.18 },
  { from: 5, rate: 0.1 },
];

export const FLAT_FEES = { preflight: 10, crate: 8 };
export const DUPLEX_SUPPLEMENT = 0.6;

export const defaultConfig = (): PrintConfig => ({
  copies: 1,
  size: "a1",
  customW: 24,
  customL: 36,
  substrate: "coated",
  ink: "colour",
  duplex: "single",
  binding: "loose",
  edges: ["trim"],
  dispatch: "courier",
});

export const volumeRate = (copies: number) =>
  volumeTiers.find((t) => copies >= t.from)?.rate ?? 0;

const round = (n: number) => Math.round(n * 100) / 100;

export const sizeOf = (cfg: PrintConfig) => {
  const preset = sizes.find((s) => s.value === cfg.size) ?? sizes[3]!;
  if (preset.value !== "custom")
    return { ...preset, w: preset.w!, h: preset.h! };
  return {
    ...preset,
    w: cfg.customW,
    h: cfg.customL,
    price: round((cfg.customW * cfg.customL * CUSTOM_PER_SQFT) / 144),
  };
};

/** Everything that costs money, as lines for the itemised summary. */
export const priceConfig = (cfg: PrintConfig) => {
  const size = sizeOf(cfg);
  const paper =
    substrates.find((s) => s.value === cfg.substrate) ?? substrates[0]!;
  const ink = inks.find((i) => i.value === cfg.ink) ?? inks[0]!;
  const binding = bindings.find((b) => b.value === cfg.binding) ?? bindings[0]!;
  const dispatch =
    dispatches.find((d) => d.value === cfg.dispatch) ?? dispatches[0]!;
  const edgePer = cfg.edges.reduce(
    (sum, v) => sum + (edges.find((e) => e.value === v)?.price ?? 0),
    0,
  );
  const duplex =
    cfg.duplex === "double" ? round(size.price * DUPLEX_SUPPLEMENT) : 0;

  const unit = round(size.price + paper.delta + edgePer + duplex);
  const prints = round(unit * cfg.copies);
  const discount = round(prints * volumeRate(cfg.copies));

  const lines: CostLine[] = [
    {
      key: "prints",
      label: `${cfg.size === "custom" ? `${cfg.customW}″ × ${cfg.customL}″ custom` : size.label} × ${cfg.copies} · ${paper.name}`,
      amount: prints,
    },
  ];
  if (discount)
    lines.push({
      key: "volume",
      label: `Volume discount (−${Math.round(volumeRate(cfg.copies) * 100)}%)`,
      amount: -discount,
    });
  lines.push({
    key: "preflight",
    label: "File check",
    amount: FLAT_FEES.preflight,
  });
  if (ink.price) lines.push({ key: "ink", label: ink.name, amount: ink.price });
  if (binding.price)
    lines.push({ key: "binding", label: binding.name, amount: binding.price });
  lines.push({
    key: "crate",
    label: "Protective packaging",
    amount: FLAT_FEES.crate,
  });
  if (dispatch.price)
    lines.push({
      key: "dispatch",
      label: dispatch.name,
      amount: dispatch.price,
    });

  const total = round(lines.reduce((sum, l) => sum + l.amount, 0));
  return { lines, total, unit, size, paper };
};

/** Working days in the print room before the order can leave. */
export const productionDays = (cfg: PrintConfig) =>
  2 +
  (cfg.duplex === "double" ? 1 : 0) +
  (cfg.edges.includes("foam") ? 1 : 0) +
  (cfg.copies >= 10 ? 1 : 0);
