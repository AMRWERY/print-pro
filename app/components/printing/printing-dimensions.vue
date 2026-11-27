<template>
  <printing-section
    id="dimensions"
    step="02"
    :title="t('printing_ui.dimensions_title')"
    :stage="t('printing_ui.stage_of', { n: 2, total: 5 })"
  >
    <div class="grid gap-6 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-end">
      <div>
        <p class="eyebrow mb-2 text-mute">{{ t("inputs.number_of_copies") }}</p>
        <LazyVQuantityStepper
          v-model="config.copies"
          :max="99"
          :label="t('inputs.number_of_copies')"
        />
      </div>
      <p
        class="flex items-start gap-2 rounded-control border border-line bg-ink/40 p-3 text-xs text-mute"
      >
        <Icon
          name="lucide:badge-percent"
          size="16"
          class="bullet-icon"
          aria-hidden="true"
        />
        <span>
          <strong class="text-paper">{{ t("printing_ui.volume_tiers") }}</strong>
          {{ t("printing_ui.volume_tiers_body") }}
          <span v-if="rate" class="text-success">{{
            t("printing_ui.discount_applied", { n: Math.round(rate * 100) })
          }}</span>
        </span>
      </p>
    </div>

    <div class="mt-6">
      <p class="eyebrow mb-3 text-mute">{{ t("printing_ui.print_size") }}</p>
      <printing-choice
        v-model="config.size"
        :label="t('printing_ui.print_size')"
        columns="sm:grid-cols-2 xl:grid-cols-3"
        :options="options"
      >
        <template #default="{ option }">
          <span class="pe-6 text-sm font-semibold text-paper">{{
            option.label
          }}</span>
          <span class="text-xs text-mute">{{ option.note }}</span>
          <span
            class="mt-auto pt-1 font-mono text-xs font-semibold text-paper"
            >{{ option.priceLabel }}</span
          >
        </template>
      </printing-choice>

      <div
        v-if="config.size === 'custom'"
        class="mt-4 grid gap-3 sm:grid-cols-2"
      >
        <LazyVInput
          v-model="config.customW"
          name="custom-width"
          type="number"
          :label="t('inputs.width_inches')"
          required
          :rules="widthRule"
          :hint="t('printing_ui.width_hint', { max: CUSTOM_MAX_WIDTH })"
        />

        <LazyVInput
          v-model="config.customL"
          name="custom-length"
          type="number"
          :label="t('inputs.length_inches')"
          required
          :rules="lengthRule"
          :hint="t('printing_ui.length_hint')"
        />
      </div>
    </div>

    <printing-substrates />
  </printing-section>
</template>

<script lang="ts" setup>
import {
  CUSTOM_MAX_WIDTH,
  CUSTOM_PER_SQFT,
  sizes,
  volumeRate,
} from "~/data/printing";

const { t } = useI18n();

const { config } = usePrintConfig();
const money = useMoney();

const rate = computed(() => volumeRate(config.copies));

const options = computed(() =>
  sizes.map((s) => ({
    value: s.value,
    label: s.label,
    note: s.note,
    priceLabel:
      s.value === "custom"
        ? t("printing_ui.per_sq_ft", { price: money.format(CUSTOM_PER_SQFT) })
        : money.format(s.price),
  })),
);

const widthRule = (v: unknown) => {
  const n = Number(v);
  return n >= 4 && n <= CUSTOM_MAX_WIDTH
    ? true
    : t("printing_ui.width_error", { max: CUSTOM_MAX_WIDTH });
};

const lengthRule = (v: unknown) => {
  const n = Number(v);
  return n >= 4 && n <= 200 ? true : t("printing_ui.length_error");
};
</script>
