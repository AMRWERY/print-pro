<template>
  <div>
    <div class="container-page space-y-6 py-6 lg:py-8">
      <v-breadcrumb :items="crumbs" />

      <header v-reveal class="flex flex-wrap items-start justify-between gap-4">
        <div class="space-y-3">
          <p class="eyebrow flex items-center gap-2 text-accent"><span class="h-2 w-2 bg-accent" aria-hidden="true" />Studio procurement · station 04</p>
          <h1 class="max-w-3xl text-3xl uppercase sm:text-5xl">Studio procurement cart &amp; manifest audit</h1>
          <p class="max-w-2xl text-sm text-mute sm:text-base">
            Calibrated optical instruments, large-format fine-art print engines and certified archival substrates allocated for immediate laboratory dispatch.
          </p>
        </div>
        <div class="flex flex-col items-end gap-3">
          <div class="inline-flex rounded-control border border-line p-0.5 font-mono text-xs uppercase tracking-wider" role="group" aria-label="Cart view mode">
            <button type="button" class="rounded-[4px] px-3 py-1.5 transition-colors duration-200" :class="!preview ? 'bg-accent text-onaccent' : 'text-mute hover:text-paper'" :aria-pressed="!preview" @click="preview = false">Active cart ({{ entries.length }} {{ entries.length === 1 ? "item" : "items" }})</button>
            <button type="button" class="rounded-[4px] px-3 py-1.5 transition-colors duration-200" :class="preview ? 'bg-accent text-onaccent' : 'text-mute hover:text-paper'" :aria-pressed="preview" @click="preview = true">Empty preview</button>
          </div>
          <p class="flex items-center gap-1.5 font-mono text-xs text-mute"><Icon name="lucide:truck" size="14" aria-hidden="true" />Dispatch cutoff: 17:00 CET</p>
        </div>
      </header>

      <p class="sr-only" role="status">{{ announcement }}</p>

      <v-empty-state
        v-if="!entries.length"
        icon="lucide:shopping-cart"
        title="Your procurement cart is empty"
        description="Add instruments from the catalog, or move saved apparatus from your studio registry."
      >
        <nuxt-link-locale to="/products" class="btn-accent">Browse the catalog</nuxt-link-locale>
        <nuxt-link-locale to="/wishlist" class="btn-ghost">Open studio registry</nuxt-link-locale>
      </v-empty-state>

      <div v-else class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div class="space-y-4">
          <!-- Bulk actions -->
          <div class="flex flex-wrap items-center justify-between gap-3 rounded-card border border-line bg-surface p-3">
            <LazyVInput type="checkbox" :model-value="allSelected" :indeterminate="selectedEntries.length > 0 && !allSelected" label-class="items-center" @update:model-value="(v) => selectAll(!!v)">
              Select all ({{ entries.length }} {{ entries.length === 1 ? "item" : "items" }})
            </LazyVInput>
            <div class="flex flex-wrap items-center gap-4 text-sm">
              <button type="button" class="link-quiet inline-flex items-center gap-1.5 disabled:opacity-40" :disabled="!selectedEntries.length" @click="batchLater"><Icon name="lucide:clock" size="14" aria-hidden="true" />Batch save</button>
              <button type="button" class="link-quiet inline-flex items-center gap-1.5 disabled:opacity-40" :disabled="!selectedEntries.length" @click="batchClear"><Icon name="lucide:trash-2" size="14" aria-hidden="true" />Batch clear</button>
              <button type="button" class="link-quiet inline-flex items-center gap-1.5" @click="exportInvoice"><Icon name="lucide:file-down" size="14" aria-hidden="true" />Export pro-forma invoice (PDF)</button>
            </div>
          </div>

          <TransitionGroup tag="ul" name="line" class="relative space-y-4">
            <li v-for="e in entries" :key="e.line.key">
              <cart-line
                :entry="e"
                :selected="isSelected(e.line.key)"
                :in-registry="wishlist.has(e.product.id)"
                @update:selected="(v) => setSelected(e.line.key, v)"
                @qty="(n) => cart.setQty(e.line.key, n)"
                @remove="removeOne(e)"
                @later="laterOne(e)"
                @registry="wishlist.toggle(e.product.id)"
              />
            </li>
          </TransitionGroup>

          <saved-for-later v-if="savedProducts.length" :items="savedProducts" @restore="restore" @remove="cart.removeSaved" />
        </div>

        <div class="lg:sticky lg:top-28 lg:self-start">
          <order-summary :totals="totals" :selected-count="selectedEntries.length" :code="cart.voucher" :notice="notice" @voucher="(c) => (cart.voucher = c)" @checkout="checkout" />
        </div>
      </div>
    </div>

    <section v-if="companions.length" class="border-t border-line py-12 md:py-16" aria-labelledby="companions-title">
      <div class="container-page space-y-8">
        <section-heading id="companions-title" eyebrow="Calibrated companions" title="Complementary studio apparatus & consumables" body="Certified compatible with the items in your manifest." />
        <ul class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <li v-for="(p, i) in companions" :key="p.id" v-reveal="{ delay: i * 70 }" class="flex">
            <VProductCard :product="p" class="w-full" />
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { companionIds } from "~/data/cart";
import { findProduct } from "~/data/product-details";
import type { CartEntry } from "~/composables/useCartTotals";
import type { DetailedProduct } from "~/types/product";

const cart = useCartStore();
const localePath = useLocalePath();
const wishlist = useWishlistStore();

const crumbs = [
  { label: "Studio procurement", to: "/" },
  { label: "Optical & print apparatus", to: "/products" },
  { label: "Cart manifest (active)" },
];

const preview = ref(false);

const entries = computed<CartEntry[]>(() =>
  preview.value
    ? []
    : cart.lines.flatMap((line) => {
        const product = findProduct(line.id);
        return product ? [{ line, product }] : [];
      }),
);

// ---- selection (everything ticked unless the user unticks it) ----
const unselected = ref<string[]>([]);
const isSelected = (key: string) => !unselected.value.includes(key);
const setSelected = (key: string, on: boolean) =>
  (unselected.value = on ? unselected.value.filter((k) => k !== key) : [...unselected.value, key]);
const selectedEntries = computed(() => entries.value.filter((e) => isSelected(e.line.key)));
const allSelected = computed(() => entries.value.length > 0 && selectedEntries.value.length === entries.value.length);
const selectAll = (on: boolean) => (unselected.value = on ? [] : entries.value.map((e) => e.line.key));

// ---- money ----
const code = computed(() => cart.voucher);
const totals = useCartTotals(selectedEntries, code);

// ---- actions ----
const announcement = ref("");
const say = (m: string) => (announcement.value = m);

const removeOne = (e: CartEntry) => {
  cart.remove([e.line.key]);
  say(`${e.product.name} removed from the cart.`);
};
const laterOne = (e: CartEntry) => {
  cart.saveForLater([e.line.key]);
  say(`${e.product.name} saved for later.`);
};
const batchClear = () => {
  const n = selectedEntries.value.length;
  cart.remove(selectedEntries.value.map((e) => e.line.key));
  say(`${n} ${n === 1 ? "item" : "items"} removed.`);
};
const batchLater = () => {
  const n = selectedEntries.value.length;
  cart.saveForLater(selectedEntries.value.map((e) => e.line.key));
  say(`${n} ${n === 1 ? "item" : "items"} saved for later.`);
};

const savedProducts = computed(() =>
  cart.saved.map((id) => findProduct(id)).filter((p): p is DetailedProduct => !!p),
);
const restore = (p: DetailedProduct) => {
  cart.add(p.id, p.price);
  say(`${p.name} moved back to the manifest.`);
};

const notice = ref("");
const checkout = () => {
  // Check out only the lines that are ticked.
  cart.checkoutKeys = selectedEntries.value.map((e) => e.line.key);
  navigateTo(localePath("/checkout"));
};

const exportInvoice = () => window.print();

const companions = computed(() => {
  const inCart = new Set(cart.lines.map((l) => l.id));
  return companionIds
    .filter((id) => !inCart.has(id))
    .map((id) => findProduct(id))
    .filter((p): p is DetailedProduct => !!p)
    .slice(0, 4);
});

useSeoMeta({
  title: "Procurement Cart — Lumen & Press",
  description: "Review your allocation, adjust quantities and prepare your studio order.",
  robots: "noindex",
});
</script>

<style scoped>
.line-enter-active,
.line-leave-active {
  transition:
    opacity 0.25s ease-out,
    transform 0.25s ease-out;
}
.line-enter-from,
.line-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
.line-leave-active {
  position: absolute;
  inset-inline: 0;
}
.line-move {
  transition: transform 0.3s ease-out;
}
</style>
