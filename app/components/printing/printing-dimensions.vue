<template>
  <printing-section
    id="dimensions"
    step="02"
    title="Dimensions, Quantity & Substrate Selection"
    stage="Stage 2/5"
  >
    <div class="grid gap-6 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-end">
      <div>
        <p class="eyebrow mb-2 text-mute">Print edition quantity</p>
        <LazyVQuantityStepper
          v-model="config.copies"
          :max="99"
          label="Print edition quantity"
        />
      </div>
      <p
        class="flex items-start gap-2 rounded-control border border-line bg-ink/40 p-3 text-xs text-mute"
      >
        <Icon
          name="lucide:badge-percent"
          size="16"
          class="mt-0.5 shrink-0 text-accent"
          aria-hidden="true"
        />
        <span>
          <strong class="text-paper">Volume tiers:</strong> 5–9 copies get 10%
          off, 10+ copies get 18% off.
          <span v-if="rate" class="text-success"
            >Your {{ Math.round(rate * 100) }}% discount is applied.</span
          >
        </span>
      </p>
    </div>

    <div class="mt-6">
      <p class="eyebrow mb-3 text-mute">
        Physical sheet dimension (native scale)
      </p>
      <printing-choice
        v-model="config.size"
        label="Print size"
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
          label="Width (inches)"
          required
          :rules="widthRule"
          :hint="`Up to ${CUSTOM_MAX_WIDTH} inches (roll width).`"
        />
        <LazyVInput
          v-model="config.customL"
          name="custom-length"
          type="number"
          label="Length (inches)"
          required
          :rules="lengthRule"
          hint="Up to 200 inches."
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

const { config } = usePrintConfig();
const money = useMoney();

const rate = computed(() => volumeRate(config.copies));

const options = sizes.map((s) => ({
  value: s.value,
  label: s.label,
  note: s.note,
  priceLabel:
    s.value === "custom"
      ? `${money.format(CUSTOM_PER_SQFT)} / sq ft`
      : money.format(s.price),
}));

const widthRule = (v: unknown) => {
  const n = Number(v);
  return n >= 4 && n <= CUSTOM_MAX_WIDTH
    ? true
    : `Enter a width between 4 and ${CUSTOM_MAX_WIDTH} inches.`;
};

const lengthRule = (v: unknown) => {
  const n = Number(v);
  return n >= 4 && n <= 200 ? true : "Enter a length between 4 and 200 inches.";
};
</script>