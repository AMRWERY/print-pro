<template>
  <div class="container-page space-y-6 py-6 lg:py-10">
    <!-- Orders are kept in this browser, so wait until they are loaded before deciding. -->
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
      description="Orders are saved in the browser they were placed in. Open this link on that device, or start a new order."
    >
      <LazyVButton variant="primary" to="/products"
        >Browse the catalog</LazyVButton
      >
      <LazyVButton variant="secondary" to="/cart">Go to cart</LazyVButton>
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
const route = useRoute();
const orders = useOrderStore();

const ready = ref(false);
onMounted(async () => {
  await nextTick(); // let the store read this browser's saved orders
  ready.value = true;
});

const order = computed(() => orders.get(String(route.params.id)));

useSeoMeta({
  title: "Order Confirmed",
  description:
    "Your order is confirmed. Track its progress and review the details.",
  robots: "noindex",
});
</script>