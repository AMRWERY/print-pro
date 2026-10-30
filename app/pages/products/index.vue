<template>
  <catalog-page v-if="products" :products="products" />
  <catalog-load-error v-else-if="error" @retry="refresh" />
  <catalog-skeleton-loader v-else />
</template>

<script lang="ts" setup>
const { products, error, refresh } = useCatalogProducts();

useSeoMeta({
  title: "All products",
  description:
    "Browse printers, photocopiers and genuine ink and toner.",
});
</script>
