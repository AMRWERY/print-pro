<template>
  <section class="section" aria-labelledby="disciplines-title">
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

      <ul class="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 lg:grid-cols-3">
        <li
          v-for="(c, i) in categories"
          :key="c.label"
          v-reveal="{ delay: (i % 4) * 70 }"
        >
          <nuxt-link-locale
            :to="c.to"
            class="group card flex h-full flex-col gap-3 p-5 transition duration-200 hover:-translate-y-0.5 hover:border-accent"
          >
            <span class="flex items-center justify-between meta">
              0{{ i + 1 }} /
              {{ c.label.split(" ")[0]!.toUpperCase() }}
              <Icon
                :name="c.icon"
                size="20"
                class="icon-lift text-mute transition-colors duration-200 group-hover:text-accent"
                aria-hidden="true"
              />
            </span>
            <span class="font-display text-xl">{{ c.label }}</span>
            <span class="text-sm text-mute">{{ c.blurb }}</span>
            <span
              class="mt-auto flex items-center gap-1 font-mono text-xs tracking-wider text-accent"
            >
              {{ meta(c) }}
              <Icon
                name="lucide:arrow-right"
                size="12"
                class="icon-nudge rtl:-scale-x-100"
                aria-hidden="true"
              />
            </span>
          </nuxt-link-locale>
        </li>
      </ul>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { categories } from "~/data/home";

const { t } = useI18n();

// "12 models" counts what the live catalog lists (before it loads, the built-in catalog).
useCatalogProducts();
const catalog = useCatalogStore();
const meta = (c: (typeof categories)[number]) =>
  `${catalog.all.filter((p) => (p as { category?: string }).category === c.category).length} ${c.noun}`;
</script>