<template>
  <div class="container-page py-6 lg:py-10">
    <LazyVEmptyState
      v-if="!entries.length"
      icon="lucide:shopping-cart"
      title="There's nothing to check out"
      description="Your cart is empty. Add instruments from the catalog, then come back here to place the order."
    >
      <LazyVButton variant="primary" to="/products"
        >Browse the catalog</LazyVButton
      >

      <LazyVButton variant="secondary" to="/cart">Back to cart</LazyVButton>
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
            />Back to cart
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
            />{{ showSummary ? "Hide" : "Show" }} order summary</span
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
import {
  deliveryOptions,
  deliveryPrices,
  paymentMethods,
  WIRE_DISCOUNT,
} from "~/data/checkout";
import { pricing } from "~/data/cart";
import { findProduct } from "~/data/product-details";
import type { CartEntry } from "~/composables/useCartTotals";
import type { Order } from "~/types/order";

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
const totals = useCartTotals(entries, code);

const discounted = computed(
  () => totals.subtotal - totals.volumeDiscount - totals.voucherDiscount,
);

const prices = computed(() => ({
  crated: discounted.value >= pricing.freeFreightFrom ? 0 : pricing.freight,
  express: deliveryPrices.express,
  pickup: deliveryPrices.pickup,
}));

const amounts = computed(() => {
  const wire =
    f.payment === "wire" ? round2(discounted.value * WIRE_DISCOUNT) : 0;
  const taxable = discounted.value - wire;
  const shipping = prices.value[f.delivery];
  const tax = round2(taxable * pricing.taxRate);
  return {
    units: totals.units,
    subtotal: totals.subtotal,
    volume: totals.volumeDiscount,
    voucher: totals.voucherDiscount,
    voucherLabel: totals.voucher?.label,
    wire,
    shipping,
    tax,
    total: round2(taxable + shipping + tax),
  };
});

const showSummary = ref(false);

// ---- placing the order (simulated: there is no payment backend) ----
const placing = ref(false);
const orders = useOrderStore();
const localePath = useLocalePath();

const buildOrder = (): Order => {
  const id = `LP-${Date.now().toString(36).toUpperCase()}`;
  const delivery = deliveryOptions.find((o) => o.id === f.delivery)!;
  const payment = paymentMethods.find((m) => m.id === f.payment)!;
  const digits = id.replace(/\D/g, "").padEnd(8, "7").slice(0, 8);

  return {
    id,
    createdAt: new Date().toISOString(),
    name: f.fullName.trim(),
    company: f.company.trim() || undefined,
    email: f.email.trim(),
    phone: f.phone.trim(),
    address: {
      line1: f.line1.trim(),
      line2: f.line2.trim() || undefined,
      city: f.city.trim(),
      region: f.region.trim(),
      postal: f.postal.trim(),
      country: f.country,
    },
    delivery: {
      id: delivery.id,
      label: delivery.label,
      note: delivery.note,
      days: delivery.days,
    },
    payment: {
      id: payment.id,
      label: payment.label,
      last4:
        payment.id === "card"
          ? f.cardNumber.replace(/\D/g, "").slice(-4)
          : undefined,
    },
    notes: f.notes.trim() || undefined,
    items: entries.value.map((e) => ({
      key: e.line.key,
      id: e.product.id,
      name: e.product.name,
      brand: e.product.brand,
      qty: e.line.qty,
      unitPrice: e.line.unitPrice,
      option: e.line.option,
      sku: e.product.sku,
      icon: e.product.icon,
      image: e.product.image,
      imageAlt: e.product.imageAlt,
      specs: e.product.specs,
    })),
    amounts: { ...amounts.value },
    pin: `${digits.slice(0, 4)}-${digits.slice(4)}`,
  };
};

const place = async () => {
  const bad = await state.firstInvalidStep();
  if (bad) {
    state.step = bad;
    state.focusFirstError();
    return;
  }

  placing.value = true;
  await new Promise((r) => setTimeout(r, 1200)); // no payment backend: simulate the request

  const order = buildOrder();
  orders.add(order);

  // Leave first, then empty the cart, so the checkout never flashes its "nothing to check out" state.
  const purchased = entries.value.map((e) => e.line.key);
  await navigateTo(localePath(`/order/${order.id}`));
  cart.remove(purchased);
  cart.checkoutKeys = [];
  if (!cart.lines.length) cart.voucher = "";
  placing.value = false;
};

useSeoMeta({
  title: "Secure Checkout",
  description: "Complete your studio order.",
  robots: "noindex",
});
</script>