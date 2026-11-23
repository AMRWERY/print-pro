<template>
  <catalog-page
    v-if="products && category"
    :key="slug"
    :products="products"
    :crumb="category.name"
    :title="category.name"
    :description="category.abstract || `Browse ${category.name.toLowerCase()}.`"
  />
  <catalog-load-error v-else-if="error" @retry="refresh" />
  <catalog-skeleton-loader v-else />
</template>

<script lang="ts" setup>
// The :key on <catalog-page> rebuilds the catalogue state when the category changes.
const route = useRoute();
const slug = computed(() => String(route.params.category));

// Only categories the shop shows have a page: an unknown or hidden one is a 404.
const categories = useCategoriesStore();
await categories.ensure();
const category = computed(() => categories.byKey.get(slug.value));
if (!category.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Category not found",
    fatal: true,
  });
}

const { products: all, error, refresh } = useCatalogProducts();
const products = computed(() => all.value?.filter((p) => p.category === slug.value));

useSeoMeta({
  title: () => category.value?.name ?? "Category",
  description: () => category.value?.abstract ?? "",
});
</script>
