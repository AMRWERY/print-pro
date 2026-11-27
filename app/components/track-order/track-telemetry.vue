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
        />{{ t("track_ui.shipment_details") }}
      </h2>
      <span
        class="rounded-control border border-yellow/40 bg-yellow-soft px-2 py-0.5 font-mono text-xs text-yellow"
        >{{ t("track_ui.demo_data") }}</span
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
      {{ t("track_ui.demo_note") }}
    </p>
  </section>
</template>

<script lang="ts" setup>
import { demoTelemetry } from "~/data/tracking";
import type { Order } from "~/types/order";

const { t } = useI18n();

const props = defineProps<{ order: Order }>();

const readings = computed(() => {
  const tel = demoTelemetry(props.order);
  return [
    {
      label: t("track_ui.parcels"),
      value: String(tel.parcels),
      unit: tel.parcels === 1 ? t("track_ui.parcel") : t("track_ui.parcels_unit"),
      note: t("track_ui.all_accounted_for"),
    },
    {
      label: t("track_ui.weight"),
      value: String(tel.weightKg),
      unit: t("track_ui.kg"),
      note: t("track_ui.matches_your_order"),
    },
    {
      label: t("track_ui.signature"),
      value: tel.signature ? t("track_ui.required") : t("track_ui.not_needed"),
      unit: "",
      note: t("track_ui.on_delivery"),
    },
    {
      label: t("track_ui.insurance"),
      value: String(tel.insuredPct),
      unit: "%",
      note: t("track_ui.covered_in_transit"),
    },
  ];
});
</script>
