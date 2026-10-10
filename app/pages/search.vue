<template>
  <div>
    <div class="container-page space-y-6 py-6 lg:py-8">
      <LazyVBreadcrumb :items="crumbs" />

      <search-bar />

      <div class="space-y-1" aria-live="polite">
        <h1 class="font-display text-2xl sm:text-3xl">
          <template v-if="catalog.filters.query">Results for “{{ catalog.filters.query }}”</template>
          <template v-else>Search the catalog</template>
        </h1>
        <p class="font-mono text-xs text-mute">
          {{ catalog.total }} {{ catalog.total === 1 ? "item" : "items" }} indexed
        </p>
      </div>

      <div class="gap-8 lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]">
        <aside class="hidden lg:block" aria-label="Filters">
          <div class="card sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto p-4">
            <catalog-filters hide-query />
          </div>
        </aside>

        <section id="catalog-results" class="scroll-mt-28 space-y-4" aria-label="Search results">
          <catalog-toolbar @open-filters="filtersOpen = true" />
        
          <active-filters />
         
          <catalog-grid />
        
          <LazyVPagination
            v-model:page="catalog.page"
            v-model:per-page="catalog.perPage"
            :total="catalog.total"
            item-label="indexed items"
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
import { catalogProducts } from "~/data/catalog";

const crumbs = [
  { label: "Catalog", to: "/" },
  { label: "Fine-art substrates", to: "/products" },
  { label: "Search archive (active)" },
];

const route = useRoute();
const router = useRouter();

const catalog = provideCatalog(catalogProducts);
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
  title: () => (catalog.filters.query ? `“${catalog.filters.query}” — Search — PrintPro` : "Search — PrintPro"),
  description: "Search bench-verified cameras, lenses, printers and archival substrates.",
  robots: "noindex",
});
</script>
