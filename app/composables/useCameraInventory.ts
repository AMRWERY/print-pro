import type {
  CameraFacets,
  CameraProduct,
  CameraSub,
} from "~/types/cameras";
import { inventorySortOptions, subLabel } from "~/data/cameras";

type InventorySort = (typeof inventorySortOptions)[number]["key"];
type Facet = "sub" | "sensor" | "mount" | "availability";

const KEY: InjectionKey<ReturnType<typeof createInventory>> = Symbol("camera-inventory");

const emptyFacets = (): CameraFacets => ({
  sub: [],
  sensor: [],
  mount: [],
  availability: [],
  minMegapixels: null,
  priceMin: null,
  priceMax: null,
});

const toggle = <T>(list: T[], value: T) => {
  const i = list.indexOf(value);
  if (i === -1) list.push(value);
  else list.splice(i, 1);
};

const createInventory = (products: CameraProduct[]) => {
  const facets = reactive<CameraFacets>(emptyFacets());
  const sort = ref<InventorySort>("featured");
  const perPage = ref(6);
  const page = ref(1);

  const results = computed(() => {
    const f = facets;
    const list = products.filter(
      (p) =>
        (!f.sub.length || f.sub.includes(p.sub)) &&
        (!f.sensor.length || f.sensor.includes(p.sensor)) &&
        (!f.mount.length || f.mount.includes(p.mount)) &&
        (!f.availability.length || f.availability.includes(p.availability)) &&
        (f.minMegapixels === null || p.megapixels >= f.minMegapixels) &&
        (f.priceMin === null || p.price >= f.priceMin) &&
        (f.priceMax === null || p.price <= f.priceMax),
    );
    if (sort.value === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort.value === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort.value === "resolution") list.sort((a, b) => b.megapixels - a.megapixels);
    return list;
  });

  const total = computed(() => results.value.length);
  const paged = computed(() =>
    results.value.slice((page.value - 1) * perPage.value, page.value * perPage.value),
  );

  const options = (pick: (p: CameraProduct) => string) => {
    const map = new Map<string, number>();
    for (const p of products) map.set(pick(p), (map.get(pick(p)) ?? 0) + 1);
    return [...map.entries()]
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
  };

  const activeCount = computed(
    () =>
      facets.sub.length +
      facets.sensor.length +
      facets.mount.length +
      facets.availability.length +
      (facets.minMegapixels !== null ? 1 : 0) +
      (facets.priceMin !== null || facets.priceMax !== null ? 1 : 0),
  );

  watch([facets, sort, perPage], () => (page.value = 1));

  return reactive({
    facets,
    sort,
    perPage,
    page,
    results,
    total,
    paged,
    activeCount,
    subOptions: options((p) => p.sub).map((o) => ({
      ...o,
      label: subLabel[o.value as CameraSub],
    })),
    sensorOptions: options((p) => p.sensor),
    mountOptions: options((p) => p.mount),
    toggle: (facet: Facet, value: string) =>
      toggle(facets[facet] as string[], value),
    setSub: (value: CameraSub) => {
      Object.assign(facets, emptyFacets());
      facets.sub.push(value);
    },
    reset: () => Object.assign(facets, emptyFacets()),
  });
};

export const provideCameraInventory = (products: CameraProduct[]) => {
  const inventory = createInventory(products);
  provide(KEY, inventory);
  return inventory;
};

export const useCameraInventory = () => {
  const inventory = inject(KEY);
  if (!inventory) throw new Error("useCameraInventory() needs provideCameraInventory() above it.");
  return inventory;
};
