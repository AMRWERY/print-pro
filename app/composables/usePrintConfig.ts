import { addWorkingDays } from "~/data/order";
import {
  FILE_PATTERN,
  MAX_FILE_MB,
  defaultConfig,
  bindings,
  dispatches,
  edges,
  priceConfig,
  productionDays,
  substrates,
} from "~/data/printing";
import type { PreflightState, PrintConfig } from "~/types/printing";

const KEY = Symbol("print-config");

/** Id of the made-to-order product the configurator puts in the cart. */
export const CUSTOM_PRINT_ID = "custom-print";

const bytes = (n: number) =>
  n >= 1e6
    ? `${(n / 1e6).toFixed(1)} MB`
    : `${Math.max(1, Math.round(n / 1e3))} KB`;

/**
 * State for the printing configurator: the options, the uploaded file (checked in this
 * browser only), and the price. Provide it on the page, use it in the step components.
 */
export const providePrintConfig = () => {
  const cart = useCartStore();
  const localePath = useLocalePath();

  const config = reactive<PrintConfig>(defaultConfig());

  // ---- file (never leaves the browser; there is no upload endpoint yet) ----
  const file = shallowRef<File | null>(null);
  const previewUrl = ref("");
  const pixels = ref<{ w: number; h: number } | null>(null);
  const hash = ref("");
  const fileError = ref("");
  const checking = ref(false);

  const clearFile = () => {
    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
    file.value = null;
    previewUrl.value = "";
    pixels.value = null;
    hash.value = "";
    fileError.value = "";
  };

  const setFile = async (f: File) => {
    fileError.value = "";
    if (!FILE_PATTERN.test(f.name)) {
      fileError.value =
        "That file type isn’t supported. Upload a TIFF, PSD, PDF, JPEG or PNG.";
      return;
    }
    if (f.size > MAX_FILE_MB * 1e6) {
      fileError.value = `That file is ${bytes(f.size)}. The limit is ${MAX_FILE_MB} MB — export a flattened copy and try again.`;
      return;
    }
    clearFile();
    checking.value = true;
    file.value = f;

    // JPEG and PNG can be read here. TIFF, PSD and PDF are accepted and measured at the bench.
    if (/^image\/(jpeg|png)$/.test(f.type)) {
      const url = URL.createObjectURL(f);
      previewUrl.value = url;
      await new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          pixels.value = { w: img.naturalWidth, h: img.naturalHeight };
          resolve();
        };
        img.onerror = () => resolve();
        img.src = url;
      });
    }

    if (f.size <= 64e6 && globalThis.crypto?.subtle) {
      const digest = await crypto.subtle.digest(
        "SHA-256",
        await f.arrayBuffer(),
      );
      hash.value = [...new Uint8Array(digest)]
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    }
    checking.value = false;
  };

  const size = computed(() => priceConfig(config).size);

  /** Pixels per inch at the chosen print size (lowest of the two sides). */
  const dpi = computed(() => {
    const p = pixels.value;
    if (!p) return null;
    const [pl, ps] = p.w >= p.h ? [p.w, p.h] : [p.h, p.w];
    const [il, is] =
      size.value.w >= size.value.h
        ? [size.value.w, size.value.h]
        : [size.value.h, size.value.w];
    return Math.round(Math.min(pl / il, ps / is));
  });

  const preflight = computed<{
    state: PreflightState;
    title: string;
    detail: string;
  }>(() => {
    const f = file.value;
    if (!f)
      return {
        state: "idle",
        title: "No asset yet",
        detail: "Upload your master file to run the preflight.",
      };
    if (dpi.value === null)
      return {
        state: "review",
        title: "Accepted — bench review",
        detail:
          "We measure resolution and colour space on ingest and email you before printing anything.",
      };
    if (dpi.value >= 250)
      return {
        state: "pass",
        title: "Preflight passed",
        detail: `${dpi.value} ppi at this size — comfortably above the 250 ppi archival target.`,
      };
    if (dpi.value >= 150)
      return {
        state: "warn",
        title: "Soft at this size",
        detail: `${dpi.value} ppi at this size. It will print, but fine detail may look soft. A smaller size or a larger master helps.`,
      };
    return {
      state: "warn",
      title: "Low resolution",
      detail: `Only ${dpi.value} ppi at this size — expect visible softness. Choose a smaller print or upload a larger master.`,
    };
  });

  // ---- options that depend on each other ----
  const paper = computed(
    () =>
      substrates.find((s) => s.value === config.substrate) ?? substrates[0]!,
  );
  // Double-sided printing needs a paper coated on both sides.
  watch(
    () => config.substrate,
    () => {
      if (!paper.value.duplex) config.duplex = "single";
    },
  );

  // ---- price and schedule ----
  const price = computed(() => priceConfig(config));
  const readyOn = ref<Date | null>(null);

  onMounted(() => {
    readyOn.value = new Date();
  });

  const handover = computed(() =>
    readyOn.value
      ? addWorkingDays(readyOn.value, productionDays(config))
      : null,
  );
  const arrival = computed(() => {
    if (!handover.value) return null;
    return config.dispatch === "courier"
      ? addWorkingDays(handover.value, 3)
      : handover.value;
  });

  const optionText = computed(() => {
    const p = price.value;
    return [
      config.size === "custom"
        ? `${config.customW}″×${config.customL}″`
        : p.size.label,
      p.paper.name,
      config.ink === "mono" ? "Monochrome" : "PRO12",
      config.duplex === "double" ? "double-sided" : "single-sided",
      bindings.find((b) => b.value === config.binding)?.name ?? "",
      ...config.edges.map((v) => edges.find((e) => e.value === v)?.name ?? v),
      dispatches.find((d) => d.value === config.dispatch)?.name ?? "",
      file.value ? `file: ${file.value.name}` : "",
    ]
      .filter(Boolean)
      .join(" · ");
  });

  const addToCart = () => {
    const unit = Math.round((price.value.total / config.copies) * 100) / 100;
    cart.add(CUSTOM_PRINT_ID, unit, {
      qty: config.copies,
      option: optionText.value,
    });
    return `${CUSTOM_PRINT_ID}|${optionText.value}`;
  };

  const checkoutNow = async () => {
    const key = addToCart();
    cart.closeDrawer();
    cart.checkoutKeys = [key];
    await navigateTo(localePath("/checkout"));
  };

  onBeforeUnmount(clearFile);

  const api = {
    config,
    file,
    previewUrl,
    pixels,
    hash,
    fileError,
    checking,
    dpi,
    preflight,
    paper,
    price,
    handover,
    arrival,
    setFile,
    clearFile,
    addToCart,
    checkoutNow,
  };
  provide(KEY, api);
  return api;
};

export const usePrintConfig = () =>
  inject(KEY) as ReturnType<typeof providePrintConfig>;
