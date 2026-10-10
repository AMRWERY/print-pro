import type { CatalogProduct } from "~/types/catalog";

/** The catalogue from the API. `products` stays undefined while it loads (show a skeleton). */
export const useCatalogProducts = () => {
  const { data, status, error, refresh } = useFetch<CatalogProduct[]>(
    "/api/catalog",
    { key: "catalog", lazy: true },
  );
  return { products: data, pending: computed(() => status.value === "pending"), error, refresh };
};
