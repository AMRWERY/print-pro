<template>
  <section v-if="shown.length" class="section" aria-labelledby="disciplines-title">
    <div class="container-page space-y-8">
      <section-heading
        id="disciplines-title"
        :eyebrow="t('home.shop_by_category')"
        :title="t('home.everything_for_printing_and_copying')"
        :body="
          t(
            'home.printers_photocopiers_and_the_genuine_supplies_that_keep_them_running',
          )
        "
      />

      <ul class="grid grid-cols-1 gap-x-6 gap-y-10 xl:grid-cols-2">
        <li
          v-for="(c, i) in shown"
          :key="c.category"
          v-reveal="{ delay: (i % 2) * 80 }"
          class="space-y-4"
        >

          <ul
            class="grid grid-cols-1 gap-4 min-[520px]:grid-cols-2"
          >
            <li v-for="p in productsOf(c.category)" :key="p.id" class="flex">
              <LazyVProductCard :product="p" class="w-full" />
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </section>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const { categories } = useStorefrontCategories();

useCatalogProducts();
const catalog = useCatalogStore();
// Two products from each category (the first two the catalog lists).
const productsOf = (category: string) =>
  catalog.all.filter((p) => (p as { category?: string }).category === category).slice(0, 2);

// Categories with no products yet stay out of the section.
const shown = computed(() => categories.value.filter((c) => productsOf(c.category).length));
</script>