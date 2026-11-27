<template>
  <section class="card-compact" aria-labelledby="queue-title">
    <h2 id="queue-title" class="eyebrow mb-3 text-mute">
      {{ t("printing_ui.queue_title") }}
    </h2>
    <dl class="space-y-2 font-mono text-xs">
      <div class="flex justify-between gap-3"><dt class="text-mute">{{ t("printing_ui.production_slot") }}</dt><dd class="font-semibold text-success">{{ t("printing_ui.open_this_week") }}</dd></div>
      <div class="flex justify-between gap-3"><dt class="text-mute">{{ t("printing_ui.drying_finishing") }}</dt><dd class="font-semibold text-paper">{{ t("printing_ui.drying_time") }}</dd></div>
      <div class="flex justify-between gap-3">
        <dt class="text-mute">{{ t("printing_ui.ready_for_collection") }}</dt>
        <dd class="font-semibold text-paper">{{ handover ? formatWhen(handover, false) : "—" }}</dd>
      </div>
      <div class="flex justify-between gap-3">
        <dt class="text-mute">{{ config.dispatch === "courier" ? t("printing_ui.estimated_arrival") : t("printing_ui.pickup_from") }}</dt>
        <dd class="font-semibold text-paper">{{ arrival ? formatWhen(arrival, false) : "—" }}</dd>
      </div>
    </dl>
    <p class="mt-3 text-1xs text-mute">{{ t("printing_ui.queue_note") }}</p>
  </section>
</template>

<script lang="ts" setup>
import { formatWhen } from "~/data/order";

const { t } = useI18n();

const { config, handover, arrival } = usePrintConfig();
</script>
