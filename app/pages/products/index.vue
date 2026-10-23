<template>
  <catalog-page v-if="products" :products="products" />
  <catalog-skeleton-loader v-else />
</template>

<script lang="ts" setup>
const { products } = useCatalogProducts();

useSeoMeta({
  title: "All products",
  description:
    "Browse printers, photocopiers and genuine ink and toner.",
});
</script>
