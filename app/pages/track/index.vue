<template>
  <div class="container-page space-y-6 py-6 lg:py-10">
    <LazyVBreadcrumb :items="crumbs" />

    <track-lookup
      :recent="orders.orders"
      :error="error"
      :loading="loading"
      @lookup="lookup"
      @open="show"
    />

    <!-- Orders are kept in this browser, so wait until they are loaded. -->
    <div
      v-if="!ready && route.query.order"
      class="space-y-4"
      aria-busy="true"
      aria-label="Loading your order"
    >
      <div class="h-40 animate-pulse rounded-card bg-raised" />
      <div class="h-40 animate-pulse rounded-card bg-raised" />
    </div>

    <template v-if="active">
      <track-summary :order="active" :status="status" />
      <track-pipeline :stages="stages" />

      <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <div class="space-y-6">
          <track-telemetry :order="active" />
          <track-events :events="events" />
        </div>
        <div class="space-y-6">
          <order-items :items="active.items" />
          <order-ledger :amounts="active.amounts" :payment="active.payment" />
          <order-consignee :order="active" />
          <order-support :order-id="active.id" />
        </div>
      </div>
    </template>

    <LazyVEmptyState
      v-else-if="ready && !route.query.order"
      icon="lucide:package-search"
      title="Enter an order number to start"
      description="Your order number is in the confirmation email and on the confirmation page. Orders placed on this device also appear above."
    >
      <LazyVButton variant="primary" to="/products"
        >Browse the catalog</LazyVButton
      >
    </LazyVEmptyState>
  </div>
</template>

<script lang="ts" setup>
import {
  matchesVerification,
  trackingEvents,
  trackingStages,
  trackingState,
} from "~/data/tracking";
import type { Order } from "~/types/order";

const route = useRoute();
const router = useRouter();
const orders = useOrderStore();

const crumbs = [
  { label: "Studio procurement", to: "/" },
  { label: "Dispatch & tracking", to: "/products" },
  { label: "Track order" },
];

const ready = ref(false);
const active = ref<Order | null>(null);
const error = ref("");
const loading = ref(false);

// "Now" ticks so a visitor who leaves the page open sees stages advance.
const now = ref(new Date());
useIntervalFn(() => (now.value = new Date()), 60_000);

const stages = computed(() =>
  active.value ? trackingStages(active.value, now.value) : [],
);
const status = computed(() => trackingState(active.value!, stages.value));
const events = computed(() => trackingEvents(stages.value));

const show = (o: Order) => {
  active.value = o;
  error.value = "";
  router.replace({ query: { order: o.id } });
};

const lookup = async ({ id, verify }: { id: string; verify: string }) => {
  loading.value = true;
  error.value = "";
  await new Promise((r) => setTimeout(r, 500)); // there is no server to ask; keep the feedback honest but brief

  const order = orders.get(id.trim().toUpperCase());
  if (!order) {
    error.value =
      "We couldn't find that order on this device. Check the number, or open the link from your confirmation on the device you ordered from.";
  } else if (!matchesVerification(order, verify)) {
    error.value =
      "That postal code or email doesn't match this order. Use the same one you entered at checkout.";
  } else {
    show(order);
  }
  loading.value = false;
};

onMounted(async () => {
  await nextTick(); // let the store read this browser's saved orders
  ready.value = true;

  // /track?order=LP-… opens straight away for orders saved on this device.
  const q = route.query.order;
  if (q) {
    const o = orders.get(String(Array.isArray(q) ? q[0] : q).toUpperCase());
    if (o) active.value = o;
    else
      error.value =
        "We couldn't find that order on this device. Enter the order number and postal code or email below.";
  }
});

useSeoMeta({
  title: "Track Your Order",
  description: "Check where your order is and what happens next.",
  robots: "noindex",
});
</script>