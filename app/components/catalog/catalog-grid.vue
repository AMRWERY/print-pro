<template>
  <div>
    <p class="sr-only" role="status">
      {{
        catalog.total === 1
          ? t("catalog_ui.item_found", { n: catalog.total })
          : t("catalog_ui.items_found", { n: catalog.total })
      }}
    </p>

    <LazyVEmptyState
      v-if="!catalog.total"
      :eyebrow="t('catalog_ui.empty_eyebrow')"
      :tag="t('catalog_ui.empty_tag')"
      tag-tone="accent"
      :caption="t('catalog_ui.empty_caption')"
      :meta="[t('catalog_ui.empty_meta_facet'), t('catalog_ui.empty_meta_tray')]"
    >
      <LazyVButton variant="primary" @click="catalog.reset()">{{
        t("btn.reset_all_filters")
      }}</LazyVButton>
    </LazyVEmptyState>

    <TransitionGroup
      v-else
      tag="ul"
      name="grid"
      class="relative grid gap-4 md:grid-cols-2 xl:grid-cols-3"
    >
      <li v-for="p in catalog.paged" :key="p.id" class="flex">
        <LazyVProductCard :product="p" class="w-full" />
      </li>
    </TransitionGroup>
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n();

const catalog = useCatalog();
</script>

<style scoped>
.grid-enter-active,
.grid-leave-active {
  transition:
    opacity 0.25s ease-out,
    transform 0.25s ease-out;
}

.grid-enter-from,
.grid-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

.grid-leave-active {
  position: absolute;
}

.grid-move {
  transition: transform 0.3s ease-out;
}
</style>