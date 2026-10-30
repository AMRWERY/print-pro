import { catalogProducts } from "~/data/catalog";
import { allProducts as staticProducts } from "~/data/product-details";
import type { CatalogProduct } from "~/types/catalog";
import type { DetailedProduct, ProductDetail } from "~/types/product";

export type LoadStatus = "idle" | "pending" | "ready" | "error";

/** What /api/products/:id returns for the product page. */
export interface ProductPage {
  product: DetailedProduct;
  detail: ProductDetail;
  related: DetailedProduct[];
}

export interface ProductState {
  status: LoadStatus;
  /** HTTP status of the failure (404 = hidden or unknown), 0 when the server couldn't be reached. */
  code: number;
  message: string;
}

/** A cached catalog older than this is refreshed in the background the next time something asks for it. */
const CATALOG_TTL = 5 * 60_000;
const PAGE_TTL = 60_000;

// Home-page and account extras that were never catalog products (supplies suggestions, the made-to-order
// print) keep their built-in record; the API sells them from its own copy.
const builtInCatalogIds = new Set(catalogProducts.map((p) => p.id));
const builtInById = new Map(staticProducts.map((p) => [p.id, p]));
const extras = staticProducts.filter((p) => !builtInCatalogIds.has(p.id));

/**
 * The live catalog: products with the admin's current price, name and visibility, from /api/catalog.
 * Every list, card and lookup in the storefront reads from here. State is plain Pinia state, so a catalog
 * loaded during server rendering reaches the browser in the page payload.
 */
export const useCatalogStore = defineStore("catalog", () => {
  const products = ref<CatalogProduct[] | null>(null);
  const status = ref<LoadStatus>("idle");
  const error = ref("");
  const loadedAt = ref(0);
  let inflight: Promise<void> | null = null;

  const ready = computed(() => products.value !== null);

  /** Loads the catalog once and keeps it for the session (refreshing quietly when it gets old). Never rejects. */
  const ensureCatalog = (force = false): Promise<void> => {
    if (inflight) return inflight;
    const fresh = products.value !== null && Date.now() - loadedAt.value < CATALOG_TTL;
    if (fresh && !force) return Promise.resolve();
    if (products.value === null) status.value = "pending";
    error.value = "";
    const p: Promise<void> = api<CatalogProduct[]>("/api/catalog")
      .then((list) => {
        products.value = list;
        loadedAt.value = Date.now();
        status.value = "ready";
      })
      .catch((e: unknown) => {
        error.value = messageOf(e) || "The catalog could not be loaded.";
        // Keep showing what we already have when only a refresh failed.
        if (products.value === null) status.value = "error";
      })
      .finally(() => {
        inflight = null;
      });
    inflight = p;
    return p;
  };

  const live = computed(() => new Map((products.value ?? []).map((p) => [p.id, p])));

  /**
   * Synchronous lookup for carts, wishlists, comparisons and checkout. Once the catalog has loaded, a product
   * the API no longer lists (hidden or on hold in admin) is gone. Until then a catalog product shows its
   * built-in record so lists don't flash empty; don't drop anything as "unknown" before `ready`.
   */
  const findProduct = (id: string): DetailedProduct | undefined => {
    const hit = live.value.get(id);
    if (hit) return hit;
    if (builtInCatalogIds.has(id)) return ready.value ? undefined : builtInById.get(id);
    // Not a catalog product: admin-created ids stay unresolved until the catalog arrives.
    return builtInById.get(id);
  };

  /** Everything that can be shown or carted: the live catalog plus the built-in extras. */
  const all = computed<DetailedProduct[]>(() =>
    ready.value ? [...(products.value ?? []), ...extras] : staticProducts,
  );

  // ---- product pages ----
  const pages = ref<Record<string, { page: ProductPage; at: number }>>({});
  const states = ref<Record<string, ProductState>>({});
  const running = new Map<string, Promise<ProductPage | null>>();

  const setState = (id: string, s: Partial<ProductState>) => {
    states.value = {
      ...states.value,
      [id]: { status: "idle", code: 0, message: "", ...states.value[id], ...s },
    };
  };

  /** The product page's data (product, detail, related) for an id; null when it is hidden, unknown or the API failed. */
  const loadProduct = (id: string): Promise<ProductPage | null> => {
    const cached = pages.value[id];
    if (cached && Date.now() - cached.at < PAGE_TTL) return Promise.resolve(cached.page);
    const again = running.get(id);
    if (again) return again;
    setState(id, { status: cached ? "ready" : "pending", code: 0, message: "" });
    const p = api<ProductPage>(`/api/products/${encodeURIComponent(id)}`)
      .then((page) => {
        pages.value = { ...pages.value, [id]: { page, at: Date.now() } };
        setState(id, { status: "ready" });
        return page;
      })
      .catch((e: unknown): ProductPage | null => {
        const code = statusOf(e);
        const message = messageOf(e);
        // Hidden or removed since it was cached: it is gone. Any other failure keeps the page we have.
        if (code === 404 && cached) {
          const rest = { ...pages.value };
          delete rest[id];
          pages.value = rest;
          setState(id, { status: "error", code, message });
          return null;
        }
        if (cached) return cached.page;
        setState(id, { status: "error", code, message });
        return null;
      })
      .finally(() => {
        running.delete(id);
      });
    running.set(id, p);
    return p;
  };

  const productPage = (id: string): ProductPage | null => pages.value[id]?.page ?? null;
  const productState = (id: string): ProductState =>
    states.value[id] ?? { status: "idle", code: 0, message: "" };

  return {
    products,
    status,
    error,
    ready,
    all,
    ensureCatalog,
    findProduct,
    pages,
    states,
    loadProduct,
    productPage,
    productState,
  };
});
