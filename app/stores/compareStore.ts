import { skipHydrate } from "pinia";
import { MAX_COMPARE } from "~/data/compare";

export const useCompareStore = defineStore("compare", () => {
  // initOnMounted keeps SSR and the first client render identical (both empty).
  const ids = useLocalStorage<string[]>("compare-ids", [], {
    initOnMounted: true,
  });

  const full = computed(() => ids.value.length >= MAX_COMPARE);
  
  const has = (id: string) => ids.value.includes(id);

  const toggle = (id: string) => {
    if (has(id)) ids.value = ids.value.filter((i) => i !== id);
    else if (!full.value) ids.value = [...ids.value, id];
  };

  const set = (next: string[]) => (ids.value = next.slice(0, MAX_COMPARE));

  const clear = () => (ids.value = []);

  return { ids: skipHydrate(ids), full, has, toggle, set, clear };
});
