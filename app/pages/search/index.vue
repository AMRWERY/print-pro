<template>
  <search-page v-if="products" :products="products" />
  <catalog-skeleton-loader v-else />
</template>

<script lang="ts" setup>
const { products } = useCatalogProducts();
</script>
