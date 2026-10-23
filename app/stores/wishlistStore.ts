import { skipHydrate } from "pinia";
import { findProduct } from "~/data/product-details";
// initOnMounted keeps SSR and the first client render identical (both empty).
export const useWishlistStore = defineStore("wishlist", () => {
  const ids = useLocalStorage<string[]>("wishlist-ids", [], {
    initOnMounted: true,
  });

  const tags = useLocalStorage<Record<string, string>>(
    "wishlist-tags",
    {},
    {
      initOnMounted: true,
    },
  );

  const name = useLocalStorage("wishlist-name", "My wishlist", {
    initOnMounted: true,
  });

  // Drop products that no longer exist (saved by an older version of the catalogue).
  onMounted(() => {
    const known = ids.value.filter((id) => findProduct(id));
    if (known.length !== ids.value.length) ids.value = known;
    const staleTags = Object.keys(tags.value).filter((id) => !findProduct(id));
    if (staleTags.length) {
      const next = { ...tags.value };
      for (const id of staleTags) delete next[id];
      tags.value = next;
    }
  });

  const has = (id: string) => ids.value.includes(id);

  const toggle = (id: string) => {
    ids.value = has(id)
      ? ids.value.filter((i) => i !== id)
      : [...ids.value, id];
  };

  const addMany = (list: string[]) => {
    ids.value = [...ids.value, ...list.filter((id) => !has(id))];
  };

  const remove = (list: string[]) => {
    ids.value = ids.value.filter((id) => !list.includes(id));
  };

  const setTag = (id: string, tag: string) => {
    tags.value = { ...tags.value, [id]: tag };
  };

  const clear = () => {
    ids.value = [];
    tags.value = {};
  };

  return { ids: skipHydrate(ids), tags: skipHydrate(tags), name: skipHydrate(name), has, toggle, addMany, remove, setTag, clear };
});
