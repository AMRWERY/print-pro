<template>
  <section class="card-roomy" aria-labelledby="telemetry-title">
    <header class="mb-4 flex flex-wrap items-center justify-between gap-2">
      <h2
        id="telemetry-title"
        class="flex items-center gap-2 font-display text-xl"
      >
        <Icon
          name="lucide:activity"
          size="20"
          class="text-accent"
          aria-hidden="true"
        />Package conditions
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
      These readings are simulated for the demo. Once a carrier feed is
      connected, live shock, humidity and temperature logs will appear here.
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
      label: "Shock / G-force",
      value: t.gForce,
      unit: "G",
      note: "Within limit",
    },
    {
      label: "Humidity",
      value: String(t.humidity),
      unit: "% RH",
      note: "Stable",
    },
    { label: "Crate temperature", value: t.temp, unit: "°C", note: "In range" },
    { label: "Nitrogen seal", value: t.nitrogen, unit: "atm", note: "Intact" },
  ];
});
</script>