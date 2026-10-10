<template>
  <catalog-page
    v-if="products"
    :key="slug"
    :products="products"
    :crumb="page.label"
    :title="page.label"
    :description="page.description"
  />
  <catalog-skeleton-loader v-else />
</template>

<script lang="ts" setup>
import { categoryPages } from "~/data/catalog";

// The :key on <catalog-page> rebuilds the catalogue state when the category changes.
const route = useRoute();
const slug = computed(() => String(route.params.category));

const page = computed(() => categoryPages[slug.value]!);
if (!categoryPages[slug.value]) {
  throw createError({
    statusCode: 404,
    statusMessage: "Category not found",
    fatal: true,
  });
}

const { products: all } = useCatalogProducts();
const products = computed(() =>
  all.value?.filter((p) => page.value.scope.includes(p.category)),
);

useSeoMeta({
  title: () => `${page.value.label}`,
  description: () => page.value.description,
});
</script>