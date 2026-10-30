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

    <!-- Wait for this tab's saved orders and the API before showing an empty state. -->
    <div
      v-if="!ready && route.query.order"
      class="space-y-4"
      aria-busy="true"
      aria-label="Loading your order"
    >
      <LazyVSkeletonLoader class="h-40" />

      <LazyVSkeletonLoader class="h-40" />
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
      eyebrow="QUERY :: TRACKING_IDLE"
      tag="AWAITING ID"
      title="Enter an order number to start"
      :description="t('orders.track_idle_description', 'Your order number and PIN are on the confirmation page. Orders placed in this tab also appear above.')"
    >
      <LazyVButton variant="primary" to="/products">{{
        t("btn.browse_the_catalog")
      }}</LazyVButton>
    </LazyVEmptyState>
  </div>
</template>

<script lang="ts" setup>
import {
  trackingEvents,
  trackingStages,
  trackingState,
} from "~/data/tracking";
import type { Order } from "~/types/order";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const orders = useOrderStore();
const auth = useAuthStore();

const crumbs = [
  { label: "Index", to: "/" },
  { label: "Orders", to: "/account/orders" },
  { label: "Track order" },
];

/** Why a lookup came back empty: the API being unreachable is not "no such order". */
const notFoundMessage = () =>
  orders.loadFailed
    ? t("orders.track_failed", "We couldn't reach the order system. Try again in a moment.")
    : t("orders.track_not_found", "We couldn't find that order. Check the order number and PIN.");

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
  // The API finds the order for its owner (signed in) or for anyone with the PIN; a wrong PIN looks like a missing order.
  const order = await orders.load(id.trim().toUpperCase(), verify.trim() || undefined);
  if (order) show(order);
  else error.value = notFoundMessage();
  loading.value = false;
};

onMounted(async () => {
  await nextTick(); // let the store read this tab's saved orders
  ready.value = true;

  // /track?order=LP-… opens straight away for an order cached in this tab, or looked up with ?pin= / the owner's session.
  const q = route.query.order;
  if (q) {
    const id = String(Array.isArray(q) ? q[0] : q).toUpperCase();
    const pinQ = route.query.pin;
    const pin = String(Array.isArray(pinQ) ? pinQ[0] : (pinQ ?? ""));
    const o = orders.get(id) ?? (pin || auth.isSignedIn ? await orders.load(id, pin || undefined) : null);
    if (o) active.value = o;
    else error.value = pin || auth.isSignedIn ? notFoundMessage() : t("orders.track_need_pin", "Enter the order number and PIN to look up this order.");
  }
});

useSeoMeta({
  title: "Track Your Order",
  description: "Check where your order is and what happens next.",
  robots: "noindex",
});
</script>