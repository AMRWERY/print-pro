<template>
  <div>
    <div class="container-page page-stack">
      <LazyVBreadcrumb :items="crumbs" />

      <header v-reveal class="flex flex-wrap items-start justify-between gap-4">
        <div class="space-y-3">
          <p class="eyebrow-accent">
            <span class="pip" aria-hidden="true" />{{ t("cart_ui.eyebrow") }}
          </p>
          <h1 class="max-w-3xl text-3xl sm:text-5xl">
            {{ t("cart.your_cart") }}
          </h1>
          <p class="max-w-2xl text-sm text-mute sm:text-base">
            {{ t("cart_ui.page_description") }}
          </p>
        </div>
      </header>

      <p class="sr-only" role="status">{{ announcement }}</p>

      <LazyVEmptyState
        v-if="!entries.length"
        icon="lucide:shopping-cart"
        :eyebrow="t('cart_ui.page_empty_eyebrow')"
        :tag="t('cart_ui.empty_caption')"
        :caption="t('cart_ui.empty_caption')"
        :meta="[t('cart_ui.empty_meta_items'), t('cart_ui.empty_meta_weight')]"
        :title="t('cart_ui.empty_title')"
        :description="t('cart_ui.page_empty_description')"
      >
        <LazyVButton variant="primary" to="/products">{{
          t("btn.browse_the_catalog")
        }}</LazyVButton>

        <LazyVButton variant="secondary" to="/wishlist">{{
          t("btn.open_wishlist")
        }}</LazyVButton>
      </LazyVEmptyState>

      <div
        v-else
        class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] xl:grid-cols-[minmax(0,1fr)_24rem]"
      >
        <div class="space-y-4">
          <!-- Bulk actions -->
          <div
            class="flex flex-wrap items-center justify-between gap-3 card p-3"
          >
            <LazyVCheckboxInput
              :model-value="allSelected"
              :indeterminate="selectedEntries.length > 0 && !allSelected"
              label-class="items-center"
              @update:model-value="(v) => selectAll(!!v)"
            >
              {{
                entries.length === 1
                  ? t("cart_ui.select_all_one", { n: entries.length })
                  : t("cart_ui.select_all_other", { n: entries.length })
              }}
            </LazyVCheckboxInput>
            <div class="flex flex-wrap items-center gap-4 text-sm">
              <LazyVButton
                variant="tertiary"
                class="inline-flex items-center gap-1.5 disabled:opacity-40"
                :disabled="!selectedEntries.length"
                @click="batchLater"
                ><Icon name="lucide:clock" size="14" aria-hidden="true" />{{
                  t("btn.save")
                }}</LazyVButton
              >

              <LazyVButton
                variant="tertiary"
                class="inline-flex items-center gap-1.5 disabled:opacity-40"
                :disabled="!selectedEntries.length"
                @click="batchClear"
                ><Icon
                  name="lucide:trash-2"
                  size="14"
                  aria-hidden="true"
                />{{ t('btn.batch_clear') }}</LazyVButton
              >

              <LazyVButton
                variant="tertiary"
                class="inline-flex items-center gap-1.5"
                @click="exportInvoice"
                ><Icon name="lucide:file-down" size="14" aria-hidden="true" />{{
                  t("btn.export_pro_forma_invoice")
                }}
                (PDF)</LazyVButton
              >
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

          <saved-for-later
            v-if="savedProducts.length"
            :items="savedProducts"
            @restore="restore"
            @remove="cart.removeSaved"
          />
        </div>

        <div class="lg:sticky lg:top-28 lg:self-start">
          <order-summary
            :totals="totals"
            :selected-count="selectedEntries.length"
            :code="cart.voucher"
            :notice="notice"
            @voucher="(c) => (cart.voucher = c)"
            @checkout="checkout"
          />
        </div>
      </div>
    </div>

    <section
      v-if="companions.length"
      class="border-t border-line py-12 md:py-16"
      aria-labelledby="companions-title"
    >
      <div class="container-page space-y-8">
        <section-heading
          id="companions-title"
          :eyebrow="t('cart_ui.companions_eyebrow')"
          :title="t('cart_ui.companions_title')"
          :body="t('cart_ui.companions_body')"
        />
        <ul class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <li
            v-for="(p, i) in companions"
            :key="p.id"
            v-reveal="{ delay: i * 70 }"
            class="flex"
          >
            <LazyVProductCard :product="p" class="w-full" />
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { companionIds } from "~/data/cart";
import type { CartEntry } from "~/composables/useCartTotals";
import type { DetailedProduct } from "~/types/product";

const catalog = useCatalogStore();
const { findProduct } = catalog;
onMounted(() => catalog.ensureCatalog());
const { t } = useI18n();
const cart = useCartStore();
const localePath = useLocalePath();
const wishlist = useWishlistStore();

const crumbs = computed(() => [
  { label: t("catalog_ui.index"), to: "/" },
  { label: t("catalog_ui.products"), to: "/products" },
  { label: t("cart_ui.cart") },
]);

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
  (unselected.value = on
    ? unselected.value.filter((k) => k !== key)
    : [...unselected.value, key]);
const selectedEntries = computed(() =>
  entries.value.filter((e) => isSelected(e.line.key)),
);
const allSelected = computed(
  () =>
    entries.value.length > 0 &&
    selectedEntries.value.length === entries.value.length,
);
const selectAll = (on: boolean) =>
  (unselected.value = on ? [] : entries.value.map((e) => e.line.key));

// ---- money ----
const code = computed(() => cart.voucher);
const totals = useCartTotals(selectedEntries, code);

// ---- actions ----
const announcement = ref("");
const say = (m: string) => (announcement.value = m);

const removeOne = (e: CartEntry) => {
  cart.remove([e.line.key]);
  say(t("cart_ui.removed_from_cart", { name: e.product.name }));
};
const laterOne = (e: CartEntry) => {
  cart.saveForLater([e.line.key]);
  say(t("cart_ui.saved_for_later", { name: e.product.name }));
};
const batchClear = () => {
  const n = selectedEntries.value.length;
  cart.remove(selectedEntries.value.map((e) => e.line.key));
  say(
    n === 1
      ? t("cart_ui.items_removed_one", { n })
      : t("cart_ui.items_removed_other", { n }),
  );
};
const batchLater = () => {
  const n = selectedEntries.value.length;
  cart.saveForLater(selectedEntries.value.map((e) => e.line.key));
  say(
    n === 1
      ? t("cart_ui.items_saved_one", { n })
      : t("cart_ui.items_saved_other", { n }),
  );
};

const savedProducts = computed(() =>
  cart.saved
    .map((id) => findProduct(id))
    .filter((p): p is DetailedProduct => !!p),
);
const restore = (p: DetailedProduct) => {
  cart.add(p.id, p.price);
  say(t("cart_ui.moved_back", { name: p.name }));
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
  title: t("cart_ui.cart"),
  description: t("cart_ui.seo_description"),
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
