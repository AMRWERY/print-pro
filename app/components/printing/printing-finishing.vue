<template>
  <printing-section
    id="finishing"
    step="04"
    :title="t('printing_ui.finishing_title')"
    :stage="t('printing_ui.stage_of', { n: 4, total: 5 })"
  >
    <p class="eyebrow mb-3 text-mute">{{ t("printing_ui.binding") }}</p>
    <printing-choice
      v-model="config.binding"
      :label="t('printing_ui.binding')"
      columns="grid-cols-2 lg:grid-cols-4"
      :options="bindings"
    >
      <template #default="{ option }">
        <span class="pe-6 text-sm font-semibold text-paper">{{
          option.name
        }}</span>
        <span class="text-xs text-mute">{{ option.description }}</span>
        <span class="mt-auto pt-1 font-mono text-xs font-semibold text-paper">{{
          option.price ? `+${money.format(option.price)}` : t("printing_ui.included")
        }}</span>
      </template>
    </printing-choice>

    <p class="eyebrow mb-3 mt-6 text-mute">
      {{ t("printing_ui.finishing") }}
      <span class="normal-case">({{ t("printing_ui.choose_any") }})</span>
    </p>
    <printing-choice
      v-model="config.edges"
      :label="t('printing_ui.finishing')"
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
          option.price
            ? t("printing_ui.per_print", { price: money.format(option.price) })
            : t("printing_ui.included")
        }}</span>
      </template>
    </printing-choice>
  </printing-section>
</template>

<script lang="ts" setup>
import { bindings, edges } from "~/data/printing";

const { t } = useI18n();

const { config } = usePrintConfig();

const money = useMoney();
</script>