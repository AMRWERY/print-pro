<template>
  <nuxt-link-locale
    to="/"
    class="flex items-center gap-2.5"
    :aria-label="t('common_ui.brand_home')"
  >
    <span
      class="grid h-9 w-9 place-items-center rounded-control bg-accent text-onaccent"
      aria-hidden="true"
    >
      <Icon name="lucide:aperture" size="22" />
    </span>
    <span class="leading-tight">
      <span class="block font-display text-base font-bold tracking-wide"
        >Print<span class="text-accent">Pro</span></span
      >
      <span class="block meta tracking-widest"
        >{{ t("common_ui.brand_tagline") }}</span
      >
    </span>
  </nuxt-link-locale>
</template>

<script lang="ts" setup>
const { t } = useI18n();
</script>