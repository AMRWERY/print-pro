<template>
  <div>
    <div class="container-page page-stack">
      <LazyVBreadcrumb :items="crumbs" />

      <search-bar />

      <div class="space-y-1" aria-live="polite">
        <h1 class="font-display text-2xl sm:text-3xl">
          <template v-if="catalog.filters.query">{{ t("search_ui.results_for", { query: catalog.filters.query }) }}</template>
          <template v-else>{{ t("inputs.search_the_catalog") }}</template>
        </h1>
        <p class="meta">
          {{
            t(
              catalog.total === 1
                ? "search_ui.item_indexed"
                : "search_ui.items_indexed",
              { n: catalog.total },
            )
          }}
        </p>
      </div>

      <div class="gap-8 lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]">
        <aside class="hidden lg:block" :aria-label="t('search_ui.filters')">
          <div class="card-compact sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto">
            <catalog-filters hide-query />
          </div>
        </aside>

        <section id="catalog-results" class="scroll-mt-28 space-y-4" :aria-label="t('search_ui.search_results')">
          <catalog-toolbar @open-filters="filtersOpen = true" />
        
          <active-filters />
         
          <catalog-grid />
        
          <LazyVPagination
            v-model:page="catalog.page"
            v-model:per-page="catalog.perPage"
            :total="catalog.total"
            :item-label="t('search_ui.indexed_items')"
            scroll-to="#catalog-results"
          />
        </section>
      </div>

      <filter-drawer :open="filtersOpen" @close="filtersOpen = false" />
    </div>

    <search-alerts :query="catalog.filters.query" />
   
    <trust-row />
  </div>
</template>

<script lang="ts" setup>
import type { CatalogProduct } from "~/types/catalog";

const props = defineProps<{ products: CatalogProduct[] }>();

const { t } = useI18n();

const crumbs = computed(() => [
  { label: t("info_ui.index"), to: "/" },
  { label: t("search_ui.products"), to: "/products" },
  { label: t("btn.search") },
]);

const route = useRoute();
const router = useRouter();

const catalog = provideCatalog(props.products);
const filtersOpen = ref(false);

const fromRoute = () => {
  const q = route.query.q;
  return (Array.isArray(q) ? q[0] : q) ?? "";
};

// /search?q=canon  <->  catalog.filters.query
catalog.filters.query = fromRoute();

watch(
  () => route.query.q,
  () => {
    if (catalog.filters.query !== fromRoute()) catalog.filters.query = fromRoute();
  },
);

watch(
  () => catalog.filters.query,
  (q) => {
    const term = q.trim();
    if (term === fromRoute()) return;
    router.replace({ query: { ...route.query, q: term || undefined } });
  },
);

useSeoMeta({
  title: () =>
    catalog.filters.query
      ? t("search_ui.seo_title_query", { query: catalog.filters.query })
      : t("btn.search"),
  description: () => t("search_ui.seo_description"),
  robots: "noindex",
});
</script>
