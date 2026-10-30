import { skipHydrate } from "pinia";
import type { CartLine } from "~/types/cart";
import type { OrderAmounts } from "~/types/order";

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

  const catalog = useCatalogStore();

  // Once the live catalog has loaded: drop products that are gone or hidden, and re-price the rest, so an
  // admin's price change shows in the cart. (The server prices the order either way.)
  const reconcile = () => {
    if (!catalog.ready) return;
    const known = lines.value.filter((l) => catalog.findProduct(l.id));
    if (known.length !== lines.value.length) lines.value = known;
    for (const line of lines.value) {
      // Only live catalog records re-price a line (the built-in extras keep the price they were added at).
      const p = catalog.products?.find((c) => c.id === line.id);
      if (!p) continue;
      // A package option adds a fixed amount on top of the base price.
      if (line.option && line.base === undefined) continue;
      const delta = line.option ? line.unitPrice - (line.base ?? line.unitPrice) : 0;
      const unit = Math.round((p.price + delta) * 100) / 100;
      if (line.unitPrice !== unit) line.unitPrice = unit;
      if (line.option && line.base !== p.price) line.base = p.price;
    }
    const keep = saved.value.filter((id) => catalog.findProduct(id));
    if (keep.length !== saved.value.length) saved.value = keep;
    if (checkoutKeys.value.some((k) => !known.some((l) => l.key === k)))
      checkoutKeys.value = checkoutKeys.value.filter((k) =>
        known.some((l) => l.key === k),
      );
  };
  // The saved lines arrive after mount (length changes) and the catalog arrives later (products change).
  watch(
    () => [catalog.products, lines.value.length, saved.value.length] as const,
    reconcile,
    { immediate: true },
  );
  // Only a cart with something in it needs the catalog (client only: the lines live in this browser).
  if (import.meta.client)
    watch(
      () => lines.value.length + saved.value.length,
      (n) => n && catalog.ensureCatalog(),
      { immediate: true },
    );

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
    opts: { qty?: number; option?: string; base?: number } = {},
  ) => {
    const key = `${id}|${opts.option ?? ""}`;
    const qty = clampQty(opts.qty ?? 1);
    const existing = lines.value.find((l) => l.key === key);
    if (existing) existing.qty = clampQty(existing.qty + qty);
    else lines.value.push({ key, id, qty, unitPrice, option: opts.option, base: opts.base });
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

  /**
   * Asks the API what these lines cost with a voucher (POST /api/cart/quote). Only product ids, quantities
   * and options are sent; the server prices them. `valid` is false when the code does nothing for this cart.
   * Resolves null when the API couldn't be reached.
   */
  const quote = async (
    items: { id: string; qty: number; option?: string }[],
    code: string,
    delivery: string,
  ): Promise<{ valid: boolean; amounts: OrderAmounts } | null> => {
    const request = api<{ valid: boolean; amounts: OrderAmounts }>("/api/cart/quote", {
      method: "POST",
      body: { items, voucher: code.trim(), delivery },
    });
    try {
      return await request;
    } catch {
      return null;
    }
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
    quote,
    clear,
  };
});