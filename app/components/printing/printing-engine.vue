<template>
  <printing-section
    id="engine"
    step="03"
    :title="t('printing_ui.engine_title')"
    :stage="t('printing_ui.stage_of', { n: 3, total: 5 })"
  >
    <p class="eyebrow mb-3 text-mute">{{ t("printing_ui.colour_or_bw") }}</p>
    <printing-choice
      v-model="config.ink"
      :label="t('printing_ui.ink_set')"
      :options="inks"
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

    <p class="eyebrow mb-3 mt-6 text-mute">
      {{ t("printing_ui.printing_sides") }}
    </p>
    <printing-choice
      v-model="config.duplex"
      :label="t('printing_ui.printing_sides')"
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

const { t } = useI18n();

const { config, paper } = usePrintConfig();

// Double-sided needs a paper coated on both sides, so say why it is unavailable.
const duplexOptions = computed(() => [
  {
    value: "single",
    name: t("printing_ui.single_sided"),
    description: t("printing_ui.single_sided_desc"),
    note: t("printing_ui.baseline_config"),
  },
  {
    value: "double",
    name: t("printing_ui.double_sided"),
    description: t("printing_ui.double_sided_desc"),
    note: t("printing_ui.size_supplement", {
      n: Math.round(DUPLEX_SUPPLEMENT * 100),
    }),
    disabled: !paper.value.duplex,
    reason: t("printing_ui.duplex_unavailable", { paper: paper.value.name }),
  },
]);
</script>