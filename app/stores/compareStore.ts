import { skipHydrate } from "pinia";
import { MAX_COMPARE } from "~/data/compare";
import { findProduct } from "~/data/product-details";
import type { CatalogCategory } from "~/types/catalog";

const categoryOf = (id: string) =>
  (findProduct(id) as { category?: CatalogCategory } | undefined)?.category;

export const useCompareStore = defineStore("compare", () => {
  // initOnMounted keeps SSR and the first client render identical (both empty).
  const ids = useLocalStorage<string[]>("compare-ids", [], {
    initOnMounted: true,
  });

  const toast = useToast();

  // Drop ids of products that no longer exist (saved by an older version of the catalogue).
  onMounted(() => {
    const known = ids.value.filter((id) => findProduct(id));
    if (known.length !== ids.value.length) ids.value = known;
  });

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
