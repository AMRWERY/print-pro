<template>
  <section class="section" aria-labelledby="featured-title">
    <div class="container-page space-y-8">
      <section-heading
        id="featured-title"
        eyebrow="Curated bench allocations"
        title="Featured equipment"
      >
        <div
          role="group"
          aria-label="Filter featured equipment"
          class="flex flex-wrap gap-2"
        >
          <LazyVButton variant="plain"
            v-for="f in featuredFilters"
            :key="f.key"
            :aria-pressed="active === f.key"
            class="rounded-control border px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition duration-200"
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
        <li v-for="(p, i) in visible" :key="p.id" v-reveal="{ delay: (i % 3) * 80 }" class="flex">
          <LazyVProductCard :product="p" class="w-full" />
        </li>
      </TransitionGroup>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { featured, featuredFilters } from "~/data/home";

const active = ref<(typeof featuredFilters)[number]["key"]>("all");

const visible = computed(() =>
  active.value === "all"
    ? featured
    : featured.filter((p) => p.group === active.value),
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