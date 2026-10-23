<template>
  <header v-reveal class="space-y-4 border-b border-line pb-6">
    <p class="eyebrow-accent">
      <span class="pip" aria-hidden="true" />
      Printers, photocopiers &amp; supplies
    </p>
    <h1 class="text-3xl sm:text-5xl">{{ title }}</h1>
    <p class="max-w-3xl text-sm text-mute sm:text-base">{{ description }}</p>
    <p
      class="flex flex-wrap items-center gap-x-5 gap-y-1 meta"
      aria-live="polite"
    >
      <span>
        Showing
        <span class="text-paper"
          >{{ catalog.rangeStart }}–{{ catalog.rangeEnd }}</span
        >
        of <span class="text-paper">{{ catalog.total }}</span> products
      </span>
      <span class="inline-flex items-center gap-1.5 text-success">
        <Icon name="lucide:circle-check" size="12" aria-hidden="true" />{{
          shipsToday
        }}
        ships today
      </span>
      <span v-if="consigned" class="inline-flex items-center gap-1.5 text-cyan">
        <Icon name="lucide:badge-check" size="12" aria-hidden="true" />{{
          consigned
        }}
        certified refurbished
      </span>
    </p>
  </header>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{ title?: string; description?: string }>(), {
  title: "All products",
  description:
    "Printers, photocopiers and genuine ink and toner. Every machine is tested before dispatch.",
});

const catalog = useCatalog();

const shipsToday = computed(
  () => catalog.results.filter((p) => p.dispatch === "in-stock").length,
);

const consigned = computed(
  () => catalog.results.filter((p) => p.dispatch === "consignment").length,
);
</script>