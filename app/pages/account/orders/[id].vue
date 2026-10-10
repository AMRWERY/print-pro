<template>
  <div class="space-y-6">
    <LazyVBreadcrumb :items="crumbs" />

    <div v-if="!order && pending" class="space-y-4" aria-busy="true" aria-label="Loading your order">
      <LazyVSkeletonLoader class="h-24" />
      <LazyVSkeletonLoader class="h-56" />
    </div>

    <template v-else-if="order">
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
      eyebrow="QUERY :: ORDER_LOOKUP"
      tag="404 NOT FOUND"
      tag-tone="warning"
      title="We couldn't find that order"
      description="It may belong to a different account, or the number may be mistyped."
    >
      <LazyVButton variant="primary" to="/account/orders"
        >Back to orders</LazyVButton
      >
    </LazyVEmptyState>

  </div>
</template>

<script lang="ts" setup>
import { allProducts } from "~/data/product-details";

const route = useRoute();
const cart = useCartStore();
const { findOrder, pending } = useAccount();

const order = computed(() => findOrder(String(route.params.id)));

const crumbs = computed(() => [
  { label: "Atelier workspace", to: "/account" },
  { label: "Orders & calibrations", to: "/account/orders" },
  { label: order.value?.id ?? "Order" },
]);

const toast = useToast();

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
  if (added)
    toast.success(`Added ${added} item${added === 1 ? "" : "s"} to your cart`, {
      action: { label: "View cart", to: "/cart" },
    });
  else toast.warning("These items are no longer in the catalog");
};

definePageMeta({
  layout: "account",
});

useSeoMeta({
  title: () => `Order ${order.value?.id ?? ""} — Lumen & Press`,
});
</script>
