<template>
  <catalog-page v-if="products" :products="products" />
  <catalog-skeleton-loader v-else />
</template>

<script lang="ts" setup>
const { products } = useCatalogProducts();

useSeoMeta({
  title: "All Instruments & Archival Substrates",
  description:
    "Browse bench-verified medium-format cameras, cinema lenses, pigment printers and archival papers.",
});
</script>
