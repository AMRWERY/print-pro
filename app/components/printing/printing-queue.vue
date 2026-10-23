<template>
  <section class="card-compact" aria-labelledby="queue-title">
    <h2 id="queue-title" class="eyebrow mb-3 text-mute">Print room status</h2>
    <dl class="space-y-2 font-mono text-xs">
      <div class="flex justify-between gap-3"><dt class="text-mute">Production slot</dt><dd class="font-semibold text-success">Open this week</dd></div>
      <div class="flex justify-between gap-3"><dt class="text-mute">Drying &amp; finishing</dt><dd class="font-semibold text-paper">24–36 h</dd></div>
      <div class="flex justify-between gap-3">
        <dt class="text-mute">Ready for collection</dt>
        <dd class="font-semibold text-paper">{{ handover ? formatWhen(handover, false) : "—" }}</dd>
      </div>
      <div class="flex justify-between gap-3">
        <dt class="text-mute">{{ config.dispatch === "courier" ? "Estimated arrival" : "Pickup from" }}</dt>
        <dd class="font-semibold text-paper">{{ arrival ? formatWhen(arrival, false) : "—" }}</dd>
      </div>
    </dl>
    <p class="mt-3 text-1xs text-mute">Estimates start today and skip weekends. We email you if the schedule changes.</p>
  </section>
</template>

<script lang="ts" setup>
import { formatWhen } from "~/data/order";

const { config, handover, arrival } = usePrintConfig();
</script>
