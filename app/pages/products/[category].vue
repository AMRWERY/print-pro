<template>
  <catalog-page
    :key="slug"
    :products="products"
    :crumb="page.label"
    :title="page.label"
    :description="page.description"
  />
</template>

<script lang="ts" setup>
import { catalogProducts, categoryPages } from "~/data/catalog";

// The :key on <catalog-page> rebuilds the catalogue state when the category changes.
const route = useRoute();
const slug = computed(() => String(route.params.category));

const page = computed(() => categoryPages[slug.value]!);
if (!categoryPages[slug.value]) {
  throw createError({ statusCode: 404, statusMessage: "Category not found", fatal: true });
}

const products = computed(() =>
  catalogProducts.filter((p) => page.value.scope.includes(p.category)),
);

useSeoMeta({
  title: () => `${page.value.label} — PrintPro`,
  description: () => page.value.description,
});
</script>