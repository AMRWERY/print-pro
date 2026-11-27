<template>
  <nav
    :aria-label="t('layout_ui.product_categories')"
    class="hidden border-b border-line bg-ink lg:block"
  >
    <div class="container-page flex items-center justify-between gap-6">
      <ul class="flex items-center">
        <li v-for="c in categories" :key="c.label">
          <nuxt-link-locale
            :to="c.to"
            active-class="!text-accent"
            :class="matchesSearch(c) && '!text-accent'"
            class="inline-flex h-11 items-center px-3 meta tracking-wider transition duration-200 hover:text-paper"
          >
            {{ c.label }}
          </nuxt-link-locale>
        </li>
      </ul>
      <nuxt-link-locale
        to="/printing"
        active-class="!text-accent"
        class="inline-flex h-11 items-center gap-1.5 px-3 font-mono text-xs font-semibold tracking-wider text-accent transition duration-200 hover:text-paper"
      >
        <Icon name="lucide:printer" size="14" aria-hidden="true" />
        {{ t("layout_ui.print_lab") }}
      </nuxt-link-locale>
    </div>
  </nav>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const { categories } = useStorefrontCategories();
const matchesSearch = useCategorySearchMatch();
</script>