<template>
  <div class="mt-6">
    <p class="eyebrow mb-3 text-mute">Archival fine-art paper &amp; media rag</p>
    <printing-choice v-model="config.substrate" label="Paper" :options="options">
      <template #default="{ option }">
        <span class="flex items-start justify-between gap-2 pe-6">
          <span class="text-base font-semibold text-paper">{{ option.name }}</span>
        </span>
        <span class="font-mono text-2xs tracking-wider text-mute">{{ option.spec }}</span>
        <span class="text-xs leading-relaxed text-mute">{{ option.description }}</span>
        <span class="mt-auto flex items-center justify-between pt-2 font-mono text-1xs">
          <span class="text-mute">{{ option.detail }}</span>
          <span class="font-semibold text-paper">{{ option.priceLabel }}</span>
        </span>
      </template>
    </printing-choice>
  </div>
</template>

<script lang="ts" setup>
import { substrates } from "~/data/printing";

const { config } = usePrintConfig();
const money = useMoney();

const options = substrates.map((s) => ({
  ...s,
  priceLabel: s.delta ? `+${money.format(s.delta)} / print` : "Standard base",
}));
</script>
