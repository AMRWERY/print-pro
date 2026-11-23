import type { CatalogCategory } from "~/types/catalog";

export type CategoryKind = "printer" | "copier" | "supply" | "general";

/** A category the shop shows: visible ones only, from /api/categories. */
export interface StorefrontCategory {
  key: CatalogCategory;
  name: string;
  slug: string;
  icon: string;
  abstract: string;
  kind: CategoryKind;
  /** Products on sale in it. */
  count: number;
}

export type CategoryStatus = "idle" | "pending" | "ready" | "error";

/** A list older than this is refreshed the next time something asks for it. */
const TTL = 5 * 60_000;

/** The shop's categories: what the menu, the home page and the category pages are built from. */
export const useCategoriesStore = defineStore("categories", () => {
  const items = ref<StorefrontCategory[]>([]);
  const status = ref<CategoryStatus>("idle");
  const loadedAt = ref(0);
  let inflight: Promise<void> | null = null;

  /** Loads the categories once and keeps them (refreshing quietly when they get old). Never rejects. */
  const ensure = (force = false): Promise<void> => {
    if (inflight) return inflight;
    if (status.value === "ready" && !force && Date.now() - loadedAt.value < TTL) return Promise.resolve();
    if (status.value !== "ready") status.value = "pending";
    const p: Promise<void> = api<StorefrontCategory[]>("/api/categories")
      .then((list) => {
        items.value = list;
        loadedAt.value = Date.now();
        status.value = "ready";
      })
      .catch(() => {
        status.value = items.value.length ? "ready" : "error";
      })
      .finally(() => {
        if (inflight === p) inflight = null;
      });
    inflight = p;
    return p;
  };

  const byKey = computed(() => new Map(items.value.map((c) => [c.key, c])));
  /** The category's name, or the raw key when it is not shown (hidden, or not loaded yet). */
  const label = (key: string) => byKey.value.get(key)?.name ?? key;
  const kindOf = (key: string): CategoryKind => byKey.value.get(key)?.kind ?? "general";

  return { items, status, ensure, byKey, label, kindOf };
});
