<template>
  <printing-section
    id="fulfilment"
    step="05"
    :title="t('printing_ui.fulfilment_title')"
    :stage="t('printing_ui.stage_of', { n: 5, total: 5 })"
  >
    <printing-choice
      v-model="config.dispatch"
      :label="t('printing_ui.fulfilment')"
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
          class="mt-auto flex items-center justify-between pt-2 font-mono text-1xs"
        >
          <span class="text-mute">{{ option.note }}</span>
          <span class="font-semibold text-paper">{{
            option.price ? money.format(option.price) : t("printing_ui.free")
          }}</span>
        </span>
      </template>
    </printing-choice>
  </printing-section>
</template>

<script lang="ts" setup>
import { dispatches } from "~/data/printing";

const { t } = useI18n();

const { config } = usePrintConfig();

const money = useMoney();
</script>