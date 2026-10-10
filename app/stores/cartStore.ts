import { skipHydrate } from "pinia";
import type { CartLine } from "~/types/cart";

export const MAX_QTY = 99;

// initOnMounted keeps SSR and the first client render identical (both empty).
export const useCartStore = defineStore("cart", () => {
  const lines = useLocalStorage<CartLine[]>("cart-lines", [], {
    initOnMounted: true,
  });
  /** Product ids set aside with "save for later". */
  const saved = useLocalStorage<string[]>("cart-saved", [], {
    initOnMounted: true,
  });
  const voucher = useLocalStorage("cart-voucher", "", { initOnMounted: true });
  /** Lines ticked on the cart page for checkout. Empty means "everything". */
  const checkoutKeys = useLocalStorage<string[]>("cart-checkout-keys", [], {
    initOnMounted: true,
  });

  /** Mini-cart drawer (opens from the end side). Not persisted. */
  const drawerOpen = ref(false);
  const openDrawer = () => (drawerOpen.value = true);
  const closeDrawer = () => (drawerOpen.value = false);

  const count = computed(() => lines.value.reduce((n, l) => n + l.qty, 0));
  const total = computed(() =>
    lines.value.reduce((n, l) => n + l.qty * l.unitPrice, 0),
  );

  const clampQty = (n: number) =>
    Math.min(MAX_QTY, Math.max(1, Math.floor(Number(n) || 1)));

  const add = (
    id: string,
    unitPrice: number,
    opts: { qty?: number; option?: string } = {},
  ) => {
    const key = `${id}|${opts.option ?? ""}`;
    const qty = clampQty(opts.qty ?? 1);
    const existing = lines.value.find((l) => l.key === key);
    if (existing) existing.qty = clampQty(existing.qty + qty);
    else lines.value.push({ key, id, qty, unitPrice, option: opts.option });
    // A product that is in the cart is no longer "saved for later".
    saved.value = saved.value.filter((s) => s !== id);
    // Show the result right away.
    openDrawer();
  };

  const setQty = (key: string, qty: number) => {
    const line = lines.value.find((l) => l.key === key);
    if (line) line.qty = clampQty(qty);
  };

  const remove = (keys: string[]) => {
    lines.value = lines.value.filter((l) => !keys.includes(l.key));
  };

  const saveForLater = (keys: string[]) => {
    const ids = lines.value
      .filter((l) => keys.includes(l.key))
      .map((l) => l.id);
    remove(keys);
    saved.value = [...new Set([...saved.value, ...ids])];
  };

  const removeSaved = (id: string) => {
    saved.value = saved.value.filter((s) => s !== id);
  };

  const clear = () => {
    lines.value = [];
    voucher.value = "";
  };

  return {
    lines: skipHydrate(lines),
    saved: skipHydrate(saved),
    voucher: skipHydrate(voucher),
    checkoutKeys: skipHydrate(checkoutKeys),
    drawerOpen,
    openDrawer,
    closeDrawer,
    count,
    total,
    add,
    setQty,
    remove,
    saveForLater,
    removeSaved,
    clear,
  };
});