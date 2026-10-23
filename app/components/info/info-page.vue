<template>
  <article class="container-page page-stack">
    <LazyVBreadcrumb :items="crumbs" />

    <header v-reveal class="max-w-3xl space-y-4">
      <p class="eyebrow flex items-center gap-2">
        <Icon :name="page.icon" size="16" aria-hidden="true" />{{
          page.eyebrow
        }}
      </p>
      <h1 class="font-display text-4xl font-semibold md:text-5xl">
        {{ page.title }}
      </h1>
      <p class="text-lg text-mute">{{ page.summary }}</p>
      <p v-if="page.updated" class="meta">Last updated {{ page.updated }}</p>
    </header>

    <dl v-if="page.facts?.length" v-reveal class="grid gap-3 sm:grid-cols-3">
      <div v-for="f in page.facts" :key="f.label" class="card p-4">
        <dt class="meta">{{ f.label }}</dt>
        <dd class="mt-1 font-medium">{{ f.value }}</dd>
      </div>
    </dl>

    <div class="grid gap-10 lg:grid-cols-[14rem_minmax(0,1fr)]">
      <nav
        v-if="page.sections.length > 2"
        class="hidden self-start lg:sticky lg:top-40 lg:block"
        aria-label="On this page"
      >
        <ul class="space-y-2 border-s border-line ps-4 text-sm">
          <li v-for="(s, i) in page.sections" :key="s.heading">
            <!-- A button, not an anchor: no #hash in the URL, so server and client render the same links. -->
            <button
              type="button"
              class="w-full text-start transition duration-200 hover:text-paper"
              :class="active === i ? 'font-medium text-accent' : 'text-mute'"
              :aria-current="active === i ? 'true' : undefined"
              @click="select(i)"
            >
              {{ s.heading }}
            </button>
          </li>
        </ul>
      </nav>

      <div
        class="max-w-3xl space-y-10"
        :class="page.sections.length <= 2 && 'lg:col-span-2'"
      >
        <section
          v-for="(s, i) in page.sections"
          :id="`section-${i + 1}`"
          :key="s.heading"
          v-reveal
          class="scroll-mt-40 space-y-3"
        >
          <h2 class="text-2xl">{{ s.heading }}</h2>
          <p v-for="p in s.body" :key="p" class="text-mute">{{ p }}</p>
          <ul v-if="s.list" class="space-y-2">
            <li
              v-for="item in s.list"
              :key="item"
              class="flex gap-2.5 text-mute"
            >
              <Icon
                name="lucide:check"
                size="16"
                class="mt-1 shrink-0 text-accent"
                aria-hidden="true"
              />{{ item }}
            </li>
          </ul>
        </section>

        <aside
          v-if="page.cta"
          v-reveal
          class="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <p class="text-mute">{{ page.cta.text }}</p>

          <LazyVButton variant="primary" :to="page.cta.to" class="shrink-0">{{
            page.cta.label
          }}</LazyVButton>
        </aside>
      </div>
    </div>

    <nav v-if="related.length" aria-label="Related pages" class="space-y-3">
      <h2 class="eyebrow">More in {{ groupLabel }}</h2>
      <ul class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <li v-for="r in related" :key="r.slug">
          <nuxt-link-locale
            :to="`/${r.group}/${r.slug}`"
            class="card flex h-full items-center gap-3 p-4 transition duration-200 hover:border-mute"
          >
            <Icon :name="r.icon" size="18" aria-hidden="true" />
            <span class="text-sm font-medium">{{ r.title }}</span>
          </nuxt-link-locale>
        </li>
      </ul>
    </nav>
  </article>
</template>

<script lang="ts" setup>
import { infoPages } from "~/data/info-pages";
import type { InfoPage } from "~/types/info";

const props = defineProps<{ page: InfoPage }>();

/** Highlighted item in the sidebar. */
const active = ref(0);

const reduceMotion = usePreferredReducedMotion();

/** Highlights the item and scrolls its section into view; the sidebar itself stays sticky. */
const select = (i: number) => {
  active.value = i;
  document.getElementById(`section-${i + 1}`)?.scrollIntoView({
    behavior: reduceMotion.value === "reduce" ? "auto" : "smooth",
    block: "start",
  });
};

const groupLabels = {
  services: "Services",
  guides: "Guides",
  legal: "Legal",
} as const;

const groupLabel = computed(() => groupLabels[props.page.group]);

const crumbs = computed(() => [
  { label: "Index", to: "/" },
  { label: groupLabel.value },
  { label: props.page.title },
]);

const related = computed(() =>
  infoPages.filter(
    (p) => p.group === props.page.group && p.slug !== props.page.slug,
  ),
);

useSeoMeta({
  title: () => props.page.title,
  description: () => props.page.summary,
});
</script>