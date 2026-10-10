<template>
  <section class="rounded-card border border-line bg-surface p-4" aria-labelledby="queue-title">
    <h2 id="queue-title" class="eyebrow mb-3 text-mute">Cleanroom queue status</h2>
    <dl class="space-y-2 font-mono text-xs">
      <div class="flex justify-between gap-3"><dt class="text-mute">Production slot</dt><dd class="font-semibold text-success">Open this week</dd></div>
      <div class="flex justify-between gap-3"><dt class="text-mute">Curing &amp; degassing</dt><dd class="font-semibold text-paper">24–36 h</dd></div>
      <div class="flex justify-between gap-3">
        <dt class="text-mute">Ready at the bench</dt>
        <dd class="font-semibold text-paper">{{ handover ? formatWhen(handover, false) : "—" }}</dd>
      </div>
      <div class="flex justify-between gap-3">
        <dt class="text-mute">{{ config.dispatch === "courier" ? "Estimated arrival" : "Pickup from" }}</dt>
        <dd class="font-semibold text-paper">{{ arrival ? formatWhen(arrival, false) : "—" }}</dd>
      </div>
    </dl>
    <p class="mt-3 text-[11px] text-mute">Estimates start today and skip weekends. We email you if the bench schedule changes.</p>
  </section>
</template>

<script lang="ts" setup>
import { formatWhen } from "~/data/order";

const { config, handover, arrival } = usePrintConfig();
</script>
