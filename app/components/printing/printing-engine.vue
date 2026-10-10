<template>
  <printing-section
    id="engine"
    step="03"
    title="Colour Engine & Duplex Geometry"
    stage="Stage 3/5"
  >
    <p class="eyebrow mb-3 text-mute">Optical ink &amp; gamut engine</p>
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
      Print orientation &amp; duplex mode
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
    name: "Single-Sided (Exhibition Wall)",
    description:
      "Engineered for direct custom archival glazing, back-framing and wall installations. Backside carries a lab serial watermark.",
    note: "Baseline configuration",
  },
  {
    value: "double",
    name: "Double-Sided Duplex (Folios)",
    description:
      "Front and rear register alignment for bound portfolios and boxed edition folios. Available only on selected dual-coated papers.",
    note: `+${Math.round(DUPLEX_SUPPLEMENT * 100)}% size supplement`,
    disabled: !paper.value.duplex,
    reason: `Not available on ${paper.value.name}. Choose Hahnemühle Photo Rag or Canson Platine.`,
  },
]);
</script>