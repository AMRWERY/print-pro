import { pricing, vouchers } from "~/data/cart";
import type { CartEntry, Voucher } from "~/types/cart";
import type { OrderAmounts } from "~/types/order";

const round2 = (n: number) => Math.round(n * 100) / 100;

interface Quote {
  key: string;
  amounts: OrderAmounts;
}

/**
 * Order maths for the entries the user has ticked, plus the voucher state.
 * Voucher codes are checked by the API (POST /api/cart/quote), so codes created in the admin app work and
 * the discount shown is the one the server will charge. Until a quote arrives, the built-in demo codes
 * are worked out locally.
 */
export const useCartTotals = (
  entries: Ref<CartEntry[]>,
  code: Ref<string>,
  delivery: Ref<string> = ref("crated"),
) => {
  const cart = useCartStore();
  const items = computed(() =>
    entries.value.map((e) => ({
      id: e.line.id,
      qty: e.line.qty,
      ...(e.line.option ? { option: e.line.option } : {}),
    })),
  );

  const keyOf = (c: string) =>
    JSON.stringify([c.trim().toUpperCase(), delivery.value, items.value]);

  const quote = shallowRef<Quote | null>(null);

  const requestQuote = async (c: string): Promise<Quote | null> => {
    const key = keyOf(c);
    const res = await cart.quote(items.value, c, delivery.value);
    return res ? { key, amounts: res.amounts } : null;
  };

  /** Asks the server about a code (called when the shopper presses Apply). Resolves true when it applies to this cart. */
  const check = async (c: string): Promise<boolean> => {
    if (!c.trim() || !items.value.length) return false;
    const q = await requestQuote(c);
    if (!q) return false;
    quote.value = q;
    return !!q.amounts.voucherLabel;
  };

  // Keep the quote in step with the cart (quantities, delivery, an applied code).
  if (import.meta.client) {
    watchDebounced(
      [code, items, delivery],
      async () => {
        if (!code.value.trim() || !items.value.length) {
          quote.value = null;
          return;
        }
        const q = await requestQuote(code.value);
        if (q && q.key === keyOf(code.value)) quote.value = q;
      },
      { debounce: 400, immediate: true, deep: true },
    );
  }

  /** The server's answer for the current cart and code, once it has arrived. */
  const quoted = computed(() =>
    quote.value && quote.value.key === keyOf(code.value) ? quote.value.amounts : null,
  );
  const freeShipping = computed(
    () => !!quoted.value?.voucherLabel && quoted.value.voucher === 0,
  );

  const units = computed(() =>
    entries.value.reduce((n, e) => n + e.line.qty, 0),
  );
  
  const subtotal = computed(() =>
    entries.value.reduce((n, e) => n + e.line.qty * e.line.unitPrice, 0),
  );

  // Ink and toner bought in bulk get a tier price.
  const volumeDiscount = computed(() =>
    round2(
      entries.value.reduce((n, e) => {
        const isSupply = (e.product as { group?: string }).group === "ink";
        return isSupply && e.line.qty >= pricing.volumeMinQty
          ? n + e.line.qty * e.line.unitPrice * pricing.volumeRate
          : n;
      }, 0),
    ),
  );

  const voucher = computed<Voucher | undefined>(() => {
    const demo = vouchers[code.value.trim().toUpperCase()];
    if (demo) return demo;
    const q = quoted.value;
    return q?.voucherLabel ? { label: q.voucherLabel, type: "flat", amount: q.voucher } : undefined;
  });
 
  const afterVolume = computed(() => subtotal.value - volumeDiscount.value);

  const voucherBelowMin = computed(
    () =>
      !!voucher.value?.minSubtotal &&
      subtotal.value < voucher.value.minSubtotal,
  );

  const voucherDiscount = computed(() => {
    if (quoted.value) return quoted.value.voucher;
    const v = voucher.value;
    if (!v || voucherBelowMin.value) return 0;
    const raw =
      v.type === "flat" ? v.amount : afterVolume.value * (v.amount / 100);
    return round2(Math.min(raw, afterVolume.value));
  });

  const discounted = computed(() => afterVolume.value - voucherDiscount.value);
 
  const freight = computed(() =>
    !units.value || freeShipping.value || discounted.value >= pricing.freeFreightFrom
      ? 0
      : pricing.freight,
  );

  const tax = computed(() => round2(discounted.value * pricing.taxRate));
 
  const payable = computed(() =>
    round2(discounted.value + freight.value + tax.value),
  );

  const leaseMonthly = computed(() =>
    entries.value.reduce((n, e) => n + e.line.qty * (e.product.lease || 0), 0),
  );

  return reactive({
    units,
    subtotal,
    volumeDiscount,
    voucher,
    voucherBelowMin,
    voucherDiscount,
    freeShipping,
    check,
    freight,
    tax,
    payable,
    leaseMonthly,
  });
};