/** Words that should make a category light up in the menu while someone searches for them. */
const TERMS: Record<string, string[]> = {
  printer: ["printer", "printers"],
  copier: ["copier", "copiers", "photocopier", "photocopiers"],
  supply: ["ink", "inks", "toner", "toners"],
};

/**
 * The shop's categories as menu entries: `{ label, to, terms, icon, blurb, category, noun, count }`.
 * Starts loading right away and, on the server, waits so the HTML already has them.
 */
export const useStorefrontCategories = () => {
  const store = useCategoriesStore();
  // Called before any await, so on the server the visitor's request context is available.
  const loading = store.ensure();
  if (import.meta.server) onServerPrefetch(() => loading);

  const categories = computed(() =>
    store.items.map((c) => ({
      label: c.name,
      to: `/products/${c.key}`,
      terms: [...(TERMS[c.kind] ?? []), c.name.toLowerCase()],
      icon: c.icon,
      blurb: c.abstract || `Browse ${c.name.toLowerCase()}.`,
      category: c.key,
      noun: c.kind === "supply" ? "supplies" : "models",
      count: c.count,
    })),
  );

  return { categories, pending: computed(() => store.status === "idle" || store.status === "pending") };
};
