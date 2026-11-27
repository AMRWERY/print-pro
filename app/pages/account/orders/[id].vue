<template>
  <div class="space-y-6">
    <LazyVBreadcrumb :items="crumbs" />

    <div
      v-if="!order && pending"
      class="space-y-4"
      aria-busy="true"
      :aria-label="t('acct_orders.loading_order')"
    >
      <LazyVSkeletonLoader class="h-24" />
      
      <LazyVSkeletonLoader class="h-56" />
    </div>

    <template v-else-if="order">
      <header class="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p class="meta">{{ t("acct_orders.placed_on", { date: orderDateLabel(order) }) }}</p>
          <h1 class="title-lg">{{ t("acct_orders.order_number", { id: order.id }) }}</h1>
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
      :eyebrow="t('acct_orders.nf_eyebrow')"
      :tag="t('acct_orders.nf_tag')"
      tag-tone="warning"
      :title="t('acct_orders.nf_title')"
      :description="t('acct_orders.nf_desc')"
    >
      <LazyVButton variant="primary" to="/account/orders">{{
        t("btn.back_to_orders")
      }}</LazyVButton>
    </LazyVEmptyState>
  </div>
</template>

<script lang="ts" setup>

const catalog = useCatalogStore();
onMounted(() => catalog.ensureCatalog());
const { t } = useI18n();
const route = useRoute();

const cart = useCartStore();
const { findOrder, pending, sourceOrder, loadSource } = useAccount();

const order = computed(() => findOrder(String(route.params.id)));

// The list rows only carry totals; fetch the full order (lines, amounts, delivery) for the detail panels.
watch(
  order,
  (o) => {
    if (o && !sourceOrder(o)) loadSource(o);
  },
  { immediate: true },
);

const crumbs = computed(() => [
  { label: t("acct_ui.crumb_workspace"), to: "/account" },
  { label: t("acct_ui.crumb_orders"), to: "/account/orders" },
  { label: order.value?.id ?? t("acct_orders.order") },
]);

const toast = useToast();

const reorder = async () => {
  await simulateRequest(500);
  const o = order.value;
  if (!o) return;
  let added = 0;
  for (const item of o.items) {
    const product = catalog.all.find(
      (p) => p.id === item.sku || p.sku === item.sku || p.name === item.name,
    );
    if (!product) continue;
    cart.add(product.id, product.price, { qty: item.quantity ?? 1 });
    added++;
  }
  if (added)
    toast.success(t("acct_orders.added_to_cart", { n: added }, added), {
      action: { label: t("acct_orders.view_cart"), to: "/cart" },
    });
  else toast.warning(t("acct_orders.items_unavailable"));
};

definePageMeta({
  layout: "account",
});

useSeoMeta({
  title: () => `${t("acct_orders.order_number", { id: order.value?.id ?? "" })} — PrintPro`,
});
</script>