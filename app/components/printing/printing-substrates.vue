<template>
  <div class="mt-6">
    <p class="eyebrow mb-3 text-mute">{{ t("printing_ui.paper_and_media") }}</p>
    <printing-choice
      v-model="config.substrate"
      :label="t('printing_ui.paper')"
      :options="options"
    >
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

const { t } = useI18n();

const { config } = usePrintConfig();
const money = useMoney();

const options = computed(() =>
  substrates.map((s) => ({
    ...s,
    priceLabel: s.delta
      ? t("printing_ui.per_print", { price: money.format(s.delta) })
      : t("printing_ui.standard_base"),
  })),
);
</script>
