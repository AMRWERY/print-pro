<template>
  <div class="container-page space-y-6 py-6 lg:py-10">
    <!-- Wait for the order (from this tab's cache or the API) before deciding it is missing. -->
    <div
      v-if="!ready"
      class="space-y-4"
      aria-busy="true"
      aria-label="Loading your order"
    >
      <LazyVSkeletonLoader class="h-56" />
      <LazyVSkeletonLoader class="h-40" />
    </div>

    <LazyVEmptyState
      v-else-if="!order"
      icon="lucide:file-search"
      eyebrow="QUERY :: ORDER_LOOKUP"
      tag="404 NOT FOUND"
      tag-tone="warning"
      title="We can't find that order"
      :description="t('orders.order_not_found_description', 'We couldn’t find that order, or it needs its PIN. Open the link from your confirmation, or track it with the order number and PIN.')"
    >
      <LazyVButton variant="primary" to="/products">{{
        t("btn.browse_the_catalog")
      }}</LazyVButton>
      
      <LazyVButton variant="secondary" to="/track">{{
        t("btn.track_order")
      }}</LazyVButton>
    </LazyVEmptyState>

    <template v-else>
      <order-hero :order="order" />

      <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div class="space-y-6">
          <order-timeline :order="order" />

          <order-items :items="order.items" />
          
          <order-ledger :amounts="order.amounts" :payment="order.payment" />
        </div>

        <div class="space-y-6 lg:sticky lg:top-6 lg:self-start">
          <order-consignee :order="order" />

          <order-support :order-id="order.id" />
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const route = useRoute();
const orders = useOrderStore();

const id = computed(() => String(route.params.id));
const ready = ref(false);

const queryPin = () => {
  const q = route.query.pin;
  return String(Array.isArray(q) ? q[0] : (q ?? "")) || undefined;
};

// An order placed in this tab is cached with its PIN, so the page opens instantly and survives a refresh.
const order = computed(() => orders.get(id.value));

onMounted(async () => {
  await nextTick(); // let the store read this tab's saved orders
  const cached = orders.get(id.value);
  if (!cached) await orders.load(id.value, queryPin());
  ready.value = true;
  // Pick up anything the team changed since it was placed.
  if (cached) orders.load(id.value, cached.pin);
});

useSeoMeta({
  title: "Order Confirmed",
  description:
    "Your order is confirmed. Track its progress and review the details.",
  robots: "noindex",
});
</script>