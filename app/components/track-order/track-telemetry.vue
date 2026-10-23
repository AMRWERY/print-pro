<template>
  <section class="card-roomy" aria-labelledby="telemetry-title">
    <header class="mb-4 flex flex-wrap items-center justify-between gap-2">
      <h2
        id="telemetry-title"
        class="flex items-center gap-2 font-display text-xl"
      >
        <Icon
          name="lucide:package"
          size="20"
          class="text-accent"
          aria-hidden="true"
        />Shipment details
      </h2>
      <span
        class="rounded-control border border-yellow/40 bg-yellow-soft px-2 py-0.5 font-mono text-xs text-yellow"
        >Demo data</span
      >
    </header>

    <dl
      class="grid grid-cols-2 gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-4"
    >
      <div v-for="r in readings" :key="r.label" class="bg-surface p-3">
        <dt class="eyebrow">{{ r.label }}</dt>
        <dd class="mt-1 font-display text-2xl">
          {{ r.value
          }}<span class="meta"> {{ r.unit }}</span>
        </dd>
        <dd class="font-mono text-xs text-success">
          <Icon name="lucide:check" size="10" aria-hidden="true" /> {{ r.note }}
        </dd>
      </div>
    </dl>

    <p class="mt-3 text-xs text-mute">
      These details are simulated for the demo. Once a courier feed is
      connected, live parcel scans will appear here.
    </p>
  </section>
</template>

<script lang="ts" setup>
import { demoTelemetry } from "~/data/tracking";
import type { Order } from "~/types/order";

const props = defineProps<{ order: Order }>();

const readings = computed(() => {
  const t = demoTelemetry(props.order);
  return [
    {
      label: "Parcels",
      value: String(t.parcels),
      unit: t.parcels === 1 ? "parcel" : "parcels",
      note: "All accounted for",
    },
    {
      label: "Weight",
      value: String(t.weightKg),
      unit: "kg",
      note: "Matches your order",
    },
    {
      label: "Signature",
      value: t.signature ? "Required" : "Not needed",
      unit: "",
      note: "On delivery",
    },
    {
      label: "Insurance",
      value: String(t.insuredPct),
      unit: "%",
      note: "Covered in transit",
    },
  ];
});
</script>
