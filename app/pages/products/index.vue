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
        <li><span>Optical &amp; print apparatus</span></li>
        <li aria-hidden="true">/</li>
        <li aria-current="page" class="text-accent">Precision catalog (all)</li>
      </ol>
    </nav>

    <catalog-header />

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
import { catalogProducts } from "~/data/catalog";

const catalog = provideCatalog(catalogProducts);
const filtersOpen = ref(false);

useSeoMeta({
  title: "All Instruments & Archival Substrates — Lumen & Press",
  description:
    "Browse bench-verified medium-format cameras, cinema lenses, pigment printers and archival papers.",
});
</script>