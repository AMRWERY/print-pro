<template>
  <div class="container-page space-y-6 py-6 lg:py-8">
    <nav aria-label="Breadcrumb">
      <ol
        class="flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-wider text-mute"
      >
        <li>
          <nuxt-link-locale to="/" class="hover:text-paper"
            >Index</nuxt-link-locale
          >
        </li>
        <li aria-hidden="true">/</li>
        <li>
          <nuxt-link-locale to="/products" class="hover:text-paper"
            >Optical &amp; print apparatus</nuxt-link-locale
          >
        </li>
        <li aria-hidden="true">/</li>
        <li aria-current="page" class="text-accent">{{ crumb }}</li>
      </ol>
    </nav>

    <catalog-header :title="title" :description="description" />

    <div class="gap-8 lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]">
      <aside class="hidden lg:block" aria-label="Filters">
        <div
          class="card sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto p-4"
        >
          <catalog-filters />
        </div>
      </aside>

      <section
        id="catalog-results"
        class="scroll-mt-28 space-y-4"
        aria-label="Product results"
      >
        <catalog-toolbar @open-filters="filtersOpen = true" />

        <active-filters />

        <catalog-grid />

        <v-pagination
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

const props = withDefaults(
  defineProps<{
    products: CatalogProduct[];
    crumb?: string;
    title?: string;
    description?: string;
  }>(),
  {
    crumb: "Precision catalog (all)",
    title: undefined,
    description: undefined,
  },
);

const catalog = provideCatalog(props.products);

const filtersOpen = ref(false);
</script>