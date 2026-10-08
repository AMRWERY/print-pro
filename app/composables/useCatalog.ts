import type {
  CatalogCategory,
  CatalogFilters,
  CatalogProduct,
  DispatchKey,
  FilterChip,
  SortKey,
} from "~/types/catalog";
import {
  categoryOptions,
  dispatchOptions,
  perPageOptions,
  sortOptions,
} from "~/data/catalog";

const CATALOG_KEY: InjectionKey<ReturnType<typeof createCatalog>> =
  Symbol("catalog");

const emptyFilters = (): CatalogFilters => ({
  query: "",
  categories: [],
  brands: [],
  priceMin: null,
  priceMax: null,
  dispatch: [],
  minRating: null,
});

const toggle = <T>(list: T[], value: T) => {
  const i = list.indexOf(value);
  if (i === -1) list.push(value);
  else list.splice(i, 1);
};

const money = (n: number) => `$${n.toLocaleString("en-US")}`;

const createCatalog = (products: CatalogProduct[]) => {
  const filters = reactive<CatalogFilters>(emptyFilters());
  const sort = ref<SortKey>("featured");
  const perPage = ref<number>(perPageOptions[0]);
  const page = ref(1);

  const matches = (p: CatalogProduct) => {
    const q = filters.query.trim().toLowerCase();
    if (q) {
      const haystack = [p.name, p.brand, p.blurb, p.sku, ...p.specs]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (filters.categories.length && !filters.categories.includes(p.category))
      return false;
    if (filters.brands.length && !filters.brands.includes(p.brand))
      return false;
    if (filters.priceMin !== null && p.price < filters.priceMin) return false;
    if (filters.priceMax !== null && p.price > filters.priceMax) return false;
    if (filters.dispatch.length && !filters.dispatch.includes(p.dispatch))
      return false;
    if (filters.minRating !== null && p.rating < filters.minRating)
      return false;
    return true;
  };

  const results = computed(() => {
    const list = products.filter(matches);
    if (sort.value === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort.value === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort.value === "rating")
      list.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
    return list;
  });

  const total = computed(() => results.value.length);
  const pageCount = computed(() =>
    Math.max(1, Math.ceil(total.value / perPage.value)),
  );
  const paged = computed(() =>
    results.value.slice(
      (page.value - 1) * perPage.value,
      page.value * perPage.value,
    ),
  );
  const rangeStart = computed(() =>
    total.value ? (page.value - 1) * perPage.value + 1 : 0,
  );
  const rangeEnd = computed(() =>
    Math.min(page.value * perPage.value, total.value),
  );

  // Option lists with counts over the whole catalogue.
  const countBy = (pick: (p: CatalogProduct) => string) => {
    const map = new Map<string, number>();
    for (const p of products) map.set(pick(p), (map.get(pick(p)) ?? 0) + 1);
    return map;
  };
  const categoryCounts = countBy((p) => p.category);
  const dispatchCounts = countBy((p) => p.dispatch);
  const brandCounts = countBy((p) => p.brand);

  const categories = categoryOptions.map((o) => ({
    ...o,
    count: categoryCounts.get(o.key) ?? 0,
  }));
  const dispatches = dispatchOptions.map((o) => ({
    ...o,
    count: dispatchCounts.get(o.key) ?? 0,
  }));
  const brands = [...brandCounts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  const chips = computed<FilterChip[]>(() => {
    const out: FilterChip[] = [];
    if (filters.query.trim())
      out.push({
        key: "query",
        label: `“${filters.query.trim()}”`,
        remove: () => (filters.query = ""),
      });
    for (const c of filters.categories)
      out.push({
        key: `cat-${c}`,
        label: categoryOptions.find((o) => o.key === c)?.label ?? c,
        remove: () => toggle(filters.categories, c),
      });
    for (const b of filters.brands)
      out.push({
        key: `brand-${b}`,
        label: b,
        remove: () => toggle(filters.brands, b),
      });
    for (const d of filters.dispatch)
      out.push({
        key: `dispatch-${d}`,
        label: dispatchOptions.find((o) => o.key === d)?.label ?? d,
        remove: () => toggle(filters.dispatch, d),
      });
    if (filters.priceMin !== null || filters.priceMax !== null) {
      const { priceMin: lo, priceMax: hi } = filters;
      out.push({
        key: "price",
        label:
          lo !== null && hi !== null
            ? `${money(lo)} – ${money(hi)}`
            : lo !== null
              ? `${money(lo)}+`
              : `Up to ${money(hi as number)}`,
        remove: () => {
          filters.priceMin = null;
          filters.priceMax = null;
        },
      });
    }
    if (filters.minRating !== null)
      out.push({
        key: "rating",
        label: `${filters.minRating}★ & up`,
        remove: () => (filters.minRating = null),
      });
    return out;
  });

  const reset = () => Object.assign(filters, emptyFilters());

  // Any change in the result set sends the user back to page one.
  watch([filters, sort, perPage], () => (page.value = 1));
  watch(pageCount, (n) => {
    if (page.value > n) page.value = n;
  });

  return reactive({
    filters,
    sort,
    perPage,
    page,
    results,
    total,
    pageCount,
    paged,
    rangeStart,
    rangeEnd,
    categories,
    dispatches,
    brands,
    chips,
    toggleCategory: (c: CatalogCategory) => toggle(filters.categories, c),
    toggleBrand: (b: string) => toggle(filters.brands, b),
    toggleDispatch: (d: DispatchKey) => toggle(filters.dispatch, d),
    sortOptions,
    reset,
  });
};

/** Creates the catalogue state and shares it with every component below. */
export const provideCatalog = (products: CatalogProduct[]) => {
  const catalog = createCatalog(products);
  provide(CATALOG_KEY, catalog);
  return catalog;
};

export const useCatalog = () => {
  const catalog = inject(CATALOG_KEY);
  if (!catalog)
    throw new Error("useCatalog() needs provideCatalog() above it.");
  return catalog;
};