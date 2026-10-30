/**
 * The live catalog for a page (lists, search, home rails). Starts loading it right away and, when the page is
 * server-rendered, waits for it so the HTML already has the products. `products` stays null while it loads
 * (show a skeleton) and when it failed (`error` says so; `refresh` tries again).
 */
export const useCatalogProducts = () => {
  const catalog = useCatalogStore();
  // Called before any await, so on the server the visitor's request context is available.
  const loading = catalog.ensureCatalog();
  if (import.meta.server) onServerPrefetch(() => loading);

  return {
    products: computed(() => catalog.products),
    pending: computed(() => catalog.status === "pending" || catalog.status === "idle"),
    error: computed(() => (catalog.status === "error" ? catalog.error : "")),
    refresh: () => catalog.ensureCatalog(true),
  };
};
