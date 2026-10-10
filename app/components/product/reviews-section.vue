<template>
  <section
    id="reviews"
    class="section scroll-mt-28 section-compact"
    aria-labelledby="reviews-title"
  >
    <div class="container-page space-y-8">
      <section-heading
        id="reviews-title"
        eyebrow="Customer evidence"
        title="Verified print atelier audits"
      />

      <div class="grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <div v-reveal class="card space-y-4 p-5">
          <p class="flex items-end gap-2">
            <span class="font-display text-5xl font-semibold">{{
              reviews.score.toFixed(2)
            }}</span>
            <span class="pb-1 meta">out of 5</span>
          </p>
          <p class="flex" :aria-label="`${reviews.score} out of 5 stars`">
            <Icon
              v-for="n in 5"
              :key="n"
              name="lucide:star"
              size="16"
              class="fill-yellow text-yellow"
              aria-hidden="true"
            />
          </p>
          <p class="meta">
            {{ reviews.count }} certified reviews
          </p>
          <ul class="space-y-1.5" aria-label="Rating breakdown">
            <li
              v-for="(n, i) in reviews.distribution"
              :key="i"
              class="flex items-center gap-2 font-mono text-xs"
            >
              <span class="w-6 text-mute">{{ 5 - i }}★</span>
              <span class="h-1.5 flex-1 overflow-hidden rounded-full bg-raised">
                <span
                  class="block h-full rounded-full bg-accent"
                  :style="{ width: `${(n / reviews.count) * 100}%` }"
                />
              </span>
              <span class="w-5 text-end text-mute">{{ n }}</span>
            </li>
          </ul>
        </div>

        <ul class="grid gap-4 md:grid-cols-2">
          <li
            v-for="(r, i) in reviews.items"
            :key="r.author"
            v-reveal="{ delay: i * 90 }"
          >
            <article class="card flex h-full flex-col gap-3 p-5">
              <header class="flex items-start justify-between gap-3">
                <div>
                  <p class="text-sm font-medium">{{ r.author }}</p>
                  <p class="meta">
                    {{ r.location }} · {{ r.date }}
                  </p>
                </div>
                <span
                  class="inline-flex shrink-0 items-center gap-1 font-mono text-xs text-success"
                  ><Icon
                    name="lucide:badge-check"
                    size="12"
                    aria-hidden="true"
                  />{{ r.badge }}</span
                >
              </header>
              <h3 class="text-lg leading-snug">{{ r.title }}</h3>
              <p class="text-sm text-mute">{{ r.body }}</p>
            </article>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import type { ReviewSummary } from "~/types/product";

defineProps<{ reviews: ReviewSummary }>();
</script>