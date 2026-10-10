<template>
  <printing-section
    id="finishing"
    step="04"
    title="Edge Finishing, Coating & Folio Enclosure"
    stage="Stage 4/5"
  >
    <p class="eyebrow mb-3 text-mute">Binding &amp; enclosure architecture</p>
    <printing-choice
      v-model="config.binding"
      label="Binding"
      columns="grid-cols-2 lg:grid-cols-4"
      :options="bindings"
    >
      <template #default="{ option }">
        <span class="pe-6 text-sm font-semibold text-paper">{{
          option.name
        }}</span>
        <span class="text-xs text-mute">{{ option.description }}</span>
        <span class="mt-auto pt-1 font-mono text-xs font-semibold text-paper">{{
          option.price ? `+${money.format(option.price)}` : "Included"
        }}</span>
      </template>
    </printing-choice>

    <p class="eyebrow mb-3 mt-6 text-mute">
      Edge treatment &amp; surface shielding
      <span class="normal-case">(choose any)</span>
    </p>
    <printing-choice
      v-model="config.edges"
      label="Edge treatments"
      multiple
      :options="edges"
    >
      <template #default="{ option }">
        <span class="flex items-start justify-between gap-2 pe-6">
          <span class="text-sm font-semibold text-paper">{{
            option.name
          }}</span>
        </span>
        <span class="text-xs leading-relaxed text-mute">{{
          option.description
        }}</span>
        <span class="mt-auto pt-1 font-mono text-xs font-semibold text-paper">{{
          option.price ? `+${money.format(option.price)} / print` : "Included"
        }}</span>
      </template>
    </printing-choice>
  </printing-section>
</template>

<script lang="ts" setup>
import { bindings, edges } from "~/data/printing";

const { config } = usePrintConfig();

const money = useMoney();
</script>