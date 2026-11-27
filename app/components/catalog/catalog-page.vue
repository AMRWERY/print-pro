<template>
  <div class="container-page page-stack">
    <LazyVBreadcrumb :items="crumbs" />

    <catalog-header :title="title" :description="description" />

    <div class="gap-8 lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]">
      <aside class="hidden lg:block" :aria-label="t('btn.filters')">
        <div
          class="card-compact sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto"
        >
          <catalog-filters />
        </div>
      </aside>

      <section
        id="catalog-results"
        class="scroll-mt-28 space-y-4"
        :aria-label="t('catalog_ui.product_results')"
      >
        <catalog-toolbar @open-filters="filtersOpen = true" />

        <active-filters />

        <catalog-grid />

        <LazyVPagination
          v-model:page="catalog.page"
          v-model:per-page="catalog.perPage"
          :total="catalog.total"
          scroll-to="#catalog-results"
        />
      </section>
    </div>

    <filter-drawer :open="filtersOpen" @close="filtersOpen = false" />
  </div>
</template>

<script lang="ts" setup>
import type { CatalogProduct } from "~/types/catalog";

const { t } = useI18n();

const props = withDefaults(
  defineProps<{
    products: CatalogProduct[];
    crumb?: string;
    title?: string;
    description?: string;
  }>(),
  {
    crumb: undefined,
    title: undefined,
    description: undefined,
  },
);

const crumbs = computed(() => [
  { label: t("catalog_ui.index"), to: "/" },
  { label: t("catalog_ui.products"), to: "/products" },
  { label: props.crumb ?? t("catalog_ui.all_products") },
]);

const catalog = provideCatalog(props.products);

const filtersOpen = ref(false);
</script>