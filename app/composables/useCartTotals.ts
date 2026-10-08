import { pricing, vouchers } from "~/data/cart";
import type { CartLine } from "~/stores/cartStore";
import type { DetailedProduct } from "~/types/product";

export interface CartEntry {
  line: CartLine;
  product: DetailedProduct;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

/** Order maths for the entries the user has ticked, plus the voucher state. */
export const useCartTotals = (
  entries: Ref<CartEntry[]>,
  code: Ref<string>,
) => {
  const units = computed(() => entries.value.reduce((n, e) => n + e.line.qty, 0));
  const subtotal = computed(() =>
    entries.value.reduce((n, e) => n + e.line.qty * e.line.unitPrice, 0),
  );

  // Media bought in bulk gets a tier price.
  const volumeDiscount = computed(() =>
    round2(
      entries.value.reduce((n, e) => {
        const isMedia = (e.product as { category?: string }).category === "substrates";
        return isMedia && e.line.qty >= pricing.volumeMinQty
          ? n + e.line.qty * e.line.unitPrice * pricing.volumeRate
          : n;
      }, 0),
    ),
  );

  const voucher = computed(() => vouchers[code.value.trim().toUpperCase()]);
  const afterVolume = computed(() => subtotal.value - volumeDiscount.value);

  const voucherBelowMin = computed(
    () => !!voucher.value?.minSubtotal && subtotal.value < voucher.value.minSubtotal,
  );
  const voucherDiscount = computed(() => {
    const v = voucher.value;
    if (!v || voucherBelowMin.value) return 0;
    const raw = v.type === "flat" ? v.amount : afterVolume.value * (v.amount / 100);
    return round2(Math.min(raw, afterVolume.value));
  });

  const discounted = computed(() => afterVolume.value - voucherDiscount.value);
  const freight = computed(() =>
    !units.value || discounted.value >= pricing.freeFreightFrom ? 0 : pricing.freight,
  );
  const tax = computed(() => round2(discounted.value * pricing.taxRate));
  const payable = computed(() => round2(discounted.value + freight.value + tax.value));
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
    freight,
    tax,
    payable,
    leaseMonthly,
  });
};
