import { skipHydrate } from "pinia";
import { MAX_COMPARE } from "~/data/compare";
import type { CatalogCategory } from "~/types/catalog";

export const useCompareStore = defineStore("compare", () => {
  // initOnMounted keeps SSR and the first client render identical (both empty).
  const ids = useLocalStorage<string[]>("compare-ids", [], {
    initOnMounted: true,
  });

  const toast = useToast();
  const catalog = useCatalogStore();

  const categoryOf = (id: string) =>
    (catalog.findProduct(id) as { category?: CatalogCategory } | undefined)?.category;

  // Drop ids of products that are gone or hidden, once the live catalog has loaded.
  watch(
    () => [catalog.products, ids.value.length] as const,
    () => {
      if (!catalog.ready) return;
      const known = ids.value.filter((id) => catalog.findProduct(id));
      if (known.length !== ids.value.length) ids.value = known;
    },
    { immediate: true },
  );
  if (import.meta.client)
    watch(() => ids.value.length, (n) => n && catalog.ensureCatalog(), { immediate: true });

  const full = computed(() => ids.value.length >= MAX_COMPARE);
  
  const has = (id: string) => ids.value.includes(id);

  const toggle = (id: string) => {
    if (has(id)) ids.value = ids.value.filter((i) => i !== id);
    else if (full.value)
      toast.warning(`You can compare up to ${MAX_COMPARE} products`, {
        description: "Remove one from your list to add another.",
      });
    else if (ids.value.length && categoryOf(ids.value[0]!) !== categoryOf(id))
      toast.warning("Compare one category at a time", {
        description: "Clear your list to compare a different kind of product.",
      });
    else ids.value = [...ids.value, id];
  };

  const set = (next: string[]) => (ids.value = next.slice(0, MAX_COMPARE));

  const clear = () => (ids.value = []);

  return { ids: skipHydrate(ids), full, has, toggle, set, clear };
});
