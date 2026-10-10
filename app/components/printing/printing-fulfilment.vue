<template>
  <printing-section
    id="fulfilment"
    step="05"
    title="Cleanroom Packaging & Chain-of-Custody Logistics"
    stage="Stage 5/5"
  >
    <printing-choice
      v-model="config.dispatch"
      label="Fulfilment"
      :options="dispatches"
    >
      <template #default="{ option }">
        <span class="flex items-start justify-between gap-2 pe-6">
          <span class="text-base font-semibold text-paper">{{
            option.name
          }}</span>
        </span>
        <span class="text-xs leading-relaxed text-mute">{{
          option.description
        }}</span>
        <span
          class="mt-auto flex items-center justify-between pt-2 font-mono text-[11px]"
        >
          <span class="text-mute">{{ option.note }}</span>
          <span class="font-semibold text-paper">{{
            option.price ? money.format(option.price) : "Free"
          }}</span>
        </span>
      </template>
    </printing-choice>
  </printing-section>
</template>

<script lang="ts" setup>
import { dispatches } from "~/data/printing";

const { config } = usePrintConfig();

const money = useMoney();
</script>