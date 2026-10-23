<template>
  <printing-section
    id="engine"
    step="03"
    title="Colour and Printing Sides"
    stage="Stage 3/5"
  >
    <p class="eyebrow mb-3 text-mute">Colour or black &amp; white</p>
    <printing-choice v-model="config.ink" label="Ink set" :options="inks">
      <template #default="{ option }">
        <span class="pe-6 text-base font-semibold text-paper">{{
          option.name
        }}</span>
        <span class="text-xs leading-relaxed text-mute">{{
          option.description
        }}</span>
        <span
          class="mt-auto pt-2 font-mono text-1xs font-semibold text-paper"
          >{{ option.note }}</span
        >
      </template>
    </printing-choice>

    <p class="eyebrow mb-3 mt-6 text-mute">
      Printing sides
    </p>
    <printing-choice
      v-model="config.duplex"
      label="Printing sides"
      :options="duplexOptions"
    >
      <template #default="{ option }">
        <span class="pe-6 text-base font-semibold text-paper">{{
          option.name
        }}</span>
        <span class="text-xs leading-relaxed text-mute">{{
          option.description
        }}</span>
        <span
          class="mt-auto pt-2 font-mono text-1xs font-semibold text-paper"
          >{{ option.note }}</span
        >
      </template>
    </printing-choice>
  </printing-section>
</template>

<script lang="ts" setup>
import { DUPLEX_SUPPLEMENT, inks } from "~/data/printing";

const { config, paper } = usePrintConfig();

// Double-sided needs a paper coated on both sides, so say why it is unavailable.
const duplexOptions = computed(() => [
  {
    value: "single",
    name: "Single-sided",
    description:
      "Prints on one side only. Best for posters, plans and anything that will be displayed.",
    note: "Baseline configuration",
  },
  {
    value: "double",
    name: "Double-sided",
    description:
      "Prints on both sides with front and back aligned. Good for booklets and reports. Available only on papers coated on both sides.",
    note: `+${Math.round(DUPLEX_SUPPLEMENT * 100)}% size supplement`,
    disabled: !paper.value.duplex,
    reason: `Not available on ${paper.value.name}. Choose Plain Paper, Coated Paper or Silk Card.`,
  },
]);
</script>