<template>
  <div class="container-page space-y-6 py-6 lg:py-10">
    <LazyVBreadcrumb :items="crumbs" />

    <printing-hero />
    <printing-steps />

    <div
      class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start xl:grid-cols-[minmax(0,1fr)_24rem]"
    >
      <div class="min-w-0 space-y-6">
        <printing-upload />

        <printing-dimensions />

        <printing-engine />

        <printing-finishing />

        <printing-fulfilment />
      </div>

      <!-- Preview, queue and price stay in view while you configure -->
      <aside
        class="space-y-4 lg:sticky lg:top-28"
        :aria-label="t('printing_ui.aside_label')"
      >
        <printing-preview />

        <printing-queue />

        <printing-summary />
      </aside>
    </div>
  </div>
</template>

<script lang="ts" setup>
providePrintConfig();

const { t } = useI18n();

const crumbs = computed(() => [
  { label: t("track_ui.crumb_index"), to: "/" },
  { label: t("printing_ui.crumb_print_lab") },
  { label: t("printing_ui.crumb_configurator") },
]);

useSeoMeta({
  title: () => t("printing_ui.seo_title"),
  description: () => t("printing_ui.seo_description"),
});
</script>