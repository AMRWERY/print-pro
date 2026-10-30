<template>
  <search-page v-if="products" :products="products" />
  <catalog-load-error v-else-if="error" @retry="refresh" />
  <catalog-skeleton-loader v-else />
</template>

<script lang="ts" setup>
const { products, error, refresh } = useCatalogProducts();
</script>
