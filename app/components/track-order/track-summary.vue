<template>
  <header v-reveal class="card overflow-hidden">
    <div
      class="h-1 bg-gradient-to-r from-success via-yellow to-accent"
      aria-hidden="true"
    />
    <div class="space-y-5 p-5 sm:p-6">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div class="space-y-2">
          <p
            class="inline-flex items-center gap-1.5 rounded-control border px-2.5 py-1 font-mono text-xs uppercase tracking-wider"
            :class="toneClass"
          >
            <Icon
              :name="status.icon"
              size="14"
              :class="status.state === 'processing' && 'animate-spin'"
              aria-hidden="true"
            />{{ status.label }}
          </p>
          <h2 class="font-display text-3xl sm:text-4xl">
            Order #{{ order.id }}
          </h2>
          <p class="text-sm text-mute">
            Destination: <span class="text-paper">{{ destination }}</span>
          </p>
        </div>
        <div class="flex flex-wrap gap-2">
          <LazyVButton
            variant="secondary"
            size="sm"
            icon="lucide:file-text"
            @click="print"
            >Print waybill</LazyVButton
          >

          <LazyVButton
            variant="secondary"
            size="sm"
            :icon="copied ? 'lucide:check' : 'lucide:link'"
            @click="copyLink"
            >{{ copied ? "Link copied" : "Copy tracking link" }}</LazyVButton
          >
        </div>
      </div>

      <dl
        class="grid gap-px overflow-hidden rounded-card border border-line bg-line text-sm sm:grid-cols-2 lg:grid-cols-4"
      >
        <div class="bg-surface p-3">
          <dt class="eyebrow">Delivery method</dt>
          <dd class="mt-1 font-medium">{{ order.delivery.label }}</dd>
        </div>
        <div class="bg-surface p-3">
          <dt class="eyebrow">
            {{
              order.delivery.id === "pickup"
                ? "Ready for pickup"
                : "Estimated handover"
            }}
          </dt>
          <dd class="mt-1 font-mono text-accent">{{ formatWhen(handover) }}</dd>
        </div>
        <div class="bg-surface p-3">
          <dt class="eyebrow">Items</dt>
          <dd class="mt-1 font-medium">
            {{ order.amounts.units }}
            {{ order.amounts.units === 1 ? "unit" : "units" }} ·
            {{ money.format(order.amounts.total) }}
          </dd>
        </div>
        <div class="bg-surface p-3">
          <dt class="eyebrow">Tracking PIN</dt>
          <dd class="mt-1 font-mono">{{ order.pin }}</dd>
        </div>
      </dl>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { countryName, estimatedHandover, formatWhen } from "~/data/order";
import type { TrackState } from "~/data/tracking";
import type { Order } from "~/types/order";

const props = defineProps<{
  order: Order;
  status: { state: TrackState; label: string; icon: string };
}>();

const money = useMoney();

const handover = computed(() => estimatedHandover(props.order));

const destination = computed(() => {
  const a = props.order.address;
  return `${props.order.company ?? props.order.name}, ${a.city}, ${countryName(a.country)}`;
});

const toneClass = computed(
  () =>
    ({
      delivered: "border-success/40 bg-success-soft text-success",
      "in-transit": "border-accent/40 bg-accent-soft text-accent",
      ready: "border-cyan/40 bg-cyan-soft text-cyan",
      processing: "border-yellow/40 bg-yellow-soft text-yellow",
    })[props.status.state],
);

const print = () => window.print();

const { copy, copied } = useClipboard({ copiedDuring: 2000 });

const copyLink = () => copy(window.location.href);
</script>