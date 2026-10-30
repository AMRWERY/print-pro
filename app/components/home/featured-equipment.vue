<template>
  <section class="section" aria-labelledby="featured-title">
    <div class="container-page space-y-8">
      <section-heading
        id="featured-title"
        :eyebrow="t('home.popular_right_now')"
        :title="t('home.featured_products')"
      >
        <div
          role="group"
          aria-label="Filter featured products"
          class="flex flex-wrap gap-2"
        >
          <LazyVButton
            variant="plain"
            v-for="f in featuredFilters"
            :key="f.key"
            :aria-pressed="active === f.key"
            class="rounded-control border px-3 py-1.5 font-mono text-xs tracking-wider transition duration-200"
            :class="
              active === f.key
                ? 'border-accent bg-accent text-onaccent'
                : 'border-line text-mute hover:border-mute hover:text-paper'
            "
            @click="active = f.key"
          >
            {{ f.label }}
          </LazyVButton>
        </div>
      </section-heading>

      <TransitionGroup
        tag="ul"
        name="list"
        class="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
      >
        <li
          v-for="(p, i) in visible"
          :key="p.id"
          v-reveal="{ delay: (i % 3) * 80 }"
          class="flex"
        >
          <LazyVProductCard :product="p" class="w-full" />
        </li>
      </TransitionGroup>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { featuredFilters, featuredIds } from "~/data/home";
import type { DetailedProduct } from "~/types/product";

const { t } = useI18n();

// Live catalog: admin price/name edits show here, and a product hidden in admin drops out.
useCatalogProducts();
const { findProduct } = useCatalogStore();
const featured = computed(() =>
  featuredIds
    .map((id) => findProduct(id))
    .filter((p): p is DetailedProduct => !!p),
);

const active = ref<(typeof featuredFilters)[number]["key"]>("all");

const visible = computed(() =>
  active.value === "all"
    ? featured.value
    : featured.value.filter((p) => p.group === active.value),
);
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition:
    opacity 0.25s ease-out,
    transform 0.25s ease-out;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

.list-leave-active {
  position: absolute;
}

.list-move {
  transition: transform 0.3s ease-out;
}
</style>