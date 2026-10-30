<template>
  <div class="container-page py-6 lg:py-10">
    <LazyVEmptyState
      v-if="!entries.length"
      icon="lucide:shopping-cart"
      eyebrow="CHECKOUT :: EMPTY"
      tag="0 UNITS"
      title="There's nothing to check out"
      description="Your cart is empty. Add products from the catalog, then come back here to place the order."
    >
      <LazyVButton variant="primary" to="/products">{{
        t("btn.browse_the_catalog")
      }}</LazyVButton>

      <LazyVButton variant="secondary" to="/cart">{{
        t("btn.back_to_cart")
      }}</LazyVButton>
    </LazyVEmptyState>

    <template v-else>
      <div class="mb-6 space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <h1 class="font-display text-3xl">Checkout</h1>
          <LazyVButton
            variant="tertiary"
            to="/cart"
            class="inline-flex items-center gap-1.5 text-sm"
          >
            <Icon
              name="lucide:arrow-left"
              size="14"
              class="rtl:-scale-x-100"
              aria-hidden="true"
            />{{ t("btn.back_to_cart") }}
          </LazyVButton>
        </div>
        <checkout-progress />
      </div>

      <!-- Phones: the order total stays one tap away -->
      <div class="mb-4 lg:hidden">
        <LazyVButton
          variant="plain"
          block
          class="card-compact flex items-center justify-between gap-3 text-start"
          :aria-expanded="showSummary"
          aria-controls="co-summary-mobile"
          @click="showSummary = !showSummary"
        >
          <span class="flex items-center gap-2 text-sm"
            ><Icon
              name="lucide:shopping-bag"
              size="16"
              class="text-accent"
              aria-hidden="true"
            />{{ showSummary ? t("btn.hide") : t("btn.show") }}
            {{ t("btn.order_summary") }}</span
          >
          <span class="flex items-center gap-2 font-display text-lg"
            >{{ money.format(amounts.total)
            }}<Icon
              name="lucide:chevron-down"
              size="16"
              class="text-mute transition-transform duration-200"
              :class="showSummary && 'rotate-180'"
              aria-hidden="true"
          /></span>
        </LazyVButton>
        <div
          id="co-summary-mobile"
          class="collapse-grid"
          :class="showSummary ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
          :inert="!showSummary"
        >
          <div class="overflow-hidden">
            <div class="pt-3">
              <checkout-summary :entries="entries" :amounts="amounts" />
            </div>
          </div>
        </div>
      </div>

      <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <div class="space-y-4">
          <address-step />

          <delivery-step :prices="prices" />

          <payment-step />

          <review-step
            :shipping="amounts.shipping"
            :total="amounts.total"
            :placing="placing"
            @place="place"
          />
        </div>

        <div class="hidden lg:sticky lg:top-6 lg:block lg:self-start">
          <checkout-summary :entries="entries" :amounts="amounts" />
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { deliveryPrices } from "~/data/checkout";
import { pricing } from "~/data/cart";
import type { CartEntry } from "~/composables/useCartTotals";
import type { OrderRequest } from "~/stores/orderStore";

const catalog = useCatalogStore();
const { findProduct } = catalog;
onMounted(() => catalog.ensureCatalog());
const { t } = useI18n();

// Always open at the top, whatever page (or open drawer) the visitor came from.
onMounted(() => window.scrollTo({ top: 0, left: 0, behavior: "instant" }));

const cart = useCartStore();
const money = useMoney();
const state = provideCheckout();
const f = state.form;

const round2 = (n: number) => Math.round(n * 100) / 100;

// ---- what is being bought: the lines ticked in the cart (or everything) ----
const entries = computed<CartEntry[]>(() => {
  const picked = cart.checkoutKeys.length
    ? cart.lines.filter((l) => cart.checkoutKeys.includes(l.key))
    : cart.lines;
  const lines = picked.length ? picked : cart.lines;
  return lines.flatMap((line) => {
    const product = findProduct(line.id);
    return product ? [{ line, product }] : [];
  });
});

// ---- every cost is visible from the first step ----
const code = computed(() => cart.voucher);
const totals = useCartTotals(entries, code, computed(() => f.delivery));

const discounted = computed(
  () => totals.subtotal - totals.volumeDiscount - totals.voucherDiscount,
);

const prices = computed(() => ({
  crated:
    totals.freeShipping || discounted.value >= pricing.freeFreightFrom
      ? 0
      : pricing.freight,
  express: totals.freeShipping ? 0 : deliveryPrices.express,
  pickup: totals.freeShipping ? 0 : deliveryPrices.pickup,
}));

const amounts = computed(() => {
  const taxable = discounted.value;
  const shipping = prices.value[f.delivery];
  const tax = round2(taxable * pricing.taxRate);
  return {
    units: totals.units,
    subtotal: totals.subtotal,
    volume: totals.volumeDiscount,
    voucher: totals.voucherDiscount,
    voucherLabel: totals.voucher?.label,
    shipping,
    tax,
    total: round2(taxable + shipping + tax),
  };
});

const showSummary = ref(false);

// ---- placing the order (the server prices it again and takes the stock) ----
const placing = ref(false);
const orders = useOrderStore();
const localePath = useLocalePath();
const toast = useToast();

// Card details stay in this form: only the last four digits go to the API, for the receipt.
const orderRequest = (): OrderRequest => ({
  items: entries.value.map((e) => ({
    id: e.line.id,
    qty: e.line.qty,
    ...(e.line.option ? { option: e.line.option } : {}),
  })),
  voucher: cart.voucher.trim() || undefined,
  contact: {
    name: f.fullName.trim(),
    company: f.company.trim() || undefined,
    email: f.email.trim(),
    phone: f.phone.trim(),
  },
  address: {
    line1: f.line1.trim(),
    line2: f.line2.trim() || undefined,
    city: f.city.trim(),
    region: f.region.trim(),
    postal: f.postal.trim(),
    country: f.country,
  },
  delivery: f.delivery,
  payment: {
    id: f.payment,
    last4:
      f.payment === "card"
        ? f.cardNumber.replace(/\D/g, "").slice(-4) || undefined
        : undefined,
  },
  notes: f.notes.trim() || undefined,
});

const place = async () => {
  const bad = await state.firstInvalidStep();
  if (bad) {
    state.step = bad;
    state.focusFirstError();
    return;
  }

  placing.value = true;
  const result = await orders.place(orderRequest());

  if (!result.ok) {
    placing.value = false;
    toast.error(
      result.reason === "stock"
        ? t("orders.place_stock_error", "Some items are no longer available in that quantity")
        : result.reason === "invalid"
          ? t("orders.place_invalid_error", "We couldn't place this order")
          : t("orders.place_failed_error", "The order wasn't placed"),
      { description: result.message || undefined },
    );
    return;
  }

  // Leave first, then empty the cart, so the checkout never flashes its "nothing to check out" state.
  const purchased = entries.value.map((e) => e.line.key);
  await navigateTo(localePath(`/order/${result.order.id}`));
  cart.remove(purchased);
  cart.checkoutKeys = [];
  if (!cart.lines.length) cart.voucher = "";
  placing.value = false;
};

useSeoMeta({
  title: "Secure Checkout",
  description: "Complete your order.",
  robots: "noindex",
});
</script>