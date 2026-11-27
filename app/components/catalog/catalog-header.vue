<template>
  <header v-reveal class="space-y-4 border-b border-line pb-6">
    <p class="eyebrow-accent">
      <span class="pip" aria-hidden="true" />
      {{ t("catalog_ui.eyebrow") }}
    </p>
    <h1 class="text-3xl sm:text-5xl">{{ heading }}</h1>
    <p class="max-w-3xl text-sm text-mute sm:text-base">{{ lead }}</p>
    <p
      class="flex flex-wrap items-center gap-x-5 gap-y-1 meta"
      aria-live="polite"
    >
      <i18n-t keypath="catalog_ui.showing_range" tag="span">
        <template #range>
          <span class="text-paper"
            >{{ catalog.rangeStart }}–{{ catalog.rangeEnd }}</span
          >
        </template>
        <template #total>
          <span class="text-paper">{{ catalog.total }}</span>
        </template>
      </i18n-t>
      <span class="inline-flex items-center gap-1.5 text-success">
        <Icon name="lucide:circle-check" size="12" aria-hidden="true" />{{
          t("catalog_ui.ships_today", { n: shipsToday })
        }}
      </span>
      <span v-if="consigned" class="inline-flex items-center gap-1.5 text-cyan">
        <Icon name="lucide:badge-check" size="12" aria-hidden="true" />{{
          t("catalog_ui.certified_refurbished", { n: consigned })
        }}
      </span>
    </p>
  </header>
</template>

<script lang="ts" setup>
const { t } = useI18n();

const props = defineProps<{ title?: string; description?: string }>();

const heading = computed(() => props.title ?? t("catalog_ui.all_products"));
const lead = computed(
  () => props.description ?? t("catalog_ui.default_description"),
);

const catalog = useCatalog();

const shipsToday = computed(
  () => catalog.results.filter((p) => p.dispatch === "in-stock").length,
);

const consigned = computed(
  () => catalog.results.filter((p) => p.dispatch === "consignment").length,
);
</script>
