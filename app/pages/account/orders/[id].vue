<template>
  <div class="space-y-6">
    <LazyVBreadcrumb :items="crumbs" />

    <template v-if="order">
      <header class="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p class="meta">
            Placed {{ orderDateLabel(order) }}
          </p>
          <h1
            class="title-lg"
          >
            Order {{ order.id }}
          </h1>
          <p class="mt-1 max-w-2xl text-sm text-mute">{{ order.title }}</p>
        </div>

        <account-status-chip
          :status="order.status"
          :label="order.statusLabel"
        />
      </header>

      <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div class="min-w-0 space-y-6">
          <account-order-progress :order="order" />

          <account-order-ledger :order="order" />
        </div>
        <account-order-summary :order="order" @reorder="reorder" />
      </div>
    </template>

    <LazyVEmptyState
      v-else
      icon="lucide:file-question"
      title="We couldn't find that order"
      description="It may belong to a different account, or the number may be mistyped."
    >
      <LazyVButton variant="primary" to="/account/orders"
        >Back to orders</LazyVButton
      >
    </LazyVEmptyState>

    <Transition name="toast">
      <p
        v-if="toast"
        role="status"
        class="fixed bottom-20 end-4 z-50 rounded-card border border-accent/40 bg-surface px-4 py-3 font-mono text-xs shadow-2xl lg:bottom-6"
      >
        {{ toast }}
      </p>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import { allProducts } from "~/data/product-details";

const route = useRoute();
const cart = useCartStore();
const { findOrder } = useAccount();

const order = computed(() => findOrder(String(route.params.id)));

const crumbs = computed(() => [
  { label: "Atelier workspace", to: "/account" },
  { label: "Orders & calibrations", to: "/account/orders" },
  { label: order.value?.id ?? "Order" },
]);

const toast = ref("");
const { start: hideToast } = useTimeoutFn(() => (toast.value = ""), 3500, {
  immediate: false,
});

const reorder = () => {
  const o = order.value;
  if (!o) return;
  let added = 0;
  for (const item of o.items) {
    const product = allProducts.find(
      (p) => p.id === item.sku || p.sku === item.sku || p.name === item.name,
    );
    if (!product) continue;
    cart.add(product.id, product.price, { qty: item.quantity ?? 1 });
    added++;
  }
  toast.value = added
    ? `Added ${added} item${added === 1 ? "" : "s"} to your cart`
    : "These items are no longer in the catalog";
  hideToast();
};

definePageMeta({
  layout: "account",
});

useSeoMeta({
  title: () => `Order ${order.value?.id ?? ""} — Lumen & Press`,
});
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition:
    transform 0.25s ease-out,
    opacity 0.25s ease-out;
}

.toast-enter-from,
.toast-leave-to {
  transform: translateY(12px);
  opacity: 0;
}
</style>