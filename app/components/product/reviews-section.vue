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
        title="Customer ratings & reviews"
      />

      <div class="grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <div class="space-y-6">
          <div v-reveal class="card space-y-4 p-5">
            <p class="flex items-end gap-2">
              <span class="font-display text-5xl font-semibold">{{
                count ? score.toFixed(2) : "–"
              }}</span>
              <span class="pb-1 meta">out of 5</span>
            </p>
            <p
              class="flex"
              :aria-label="`${count ? score.toFixed(2) : 0} out of 5 stars`"
            >
              <Icon
                v-for="n in 5"
                :key="n"
                :name="n <= Math.round(score) ? 'material-symbols-light:kid-star-sharp' : 'material-symbols-light:kid-star-outline-sharp'"
                size="16"
                :class="
                  n <= Math.round(score)
                    ? 'text-yellow'
                    : 'text-mute'
                "
                aria-hidden="true"
              />
            </p>
            <p class="meta">
              {{ count }} {{ count === 1 ? "review" : "reviews" }}
            </p>
            <ul v-if="count" class="space-y-1.5" aria-label="Rating breakdown">
              <li
                v-for="(n, i) in distribution"
                :key="i"
                class="flex items-center gap-2 font-mono text-xs"
              >
                <span class="w-6 text-mute">{{ 5 - i }}★</span>
                <span
                  class="h-1.5 flex-1 overflow-hidden rounded-full bg-raised"
                >
                  <span
                    class="block h-full rounded-full bg-accent transition-[width] duration-300 motion-reduce:transition-none"
                    :style="{ width: `${(n / count) * 100}%` }"
                  />
                </span>
                <span class="w-5 text-end text-mute">{{ n }}</span>
              </li>
            </ul>
          </div>

          <review-form :product-id="productId" />
        </div>

        <ul
          v-if="count"
          class="grid content-start gap-4 md:grid-cols-2 md:[&>li:last-child:nth-child(odd)]:col-span-2"
        >
          <li v-for="(r, i) in items" :key="r.key" v-reveal="{ delay: i * 90 }">
            <article class="card flex h-full flex-col gap-3 p-5">
              <header class="flex items-start justify-between gap-3">
                <div>
                  <p class="text-sm font-medium">{{ r.author }}</p>
                  <p class="meta">
                    {{ r.location ? `${r.location} · ` : "" }}{{ r.date }}
                  </p>
                </div>
                <span
                  v-if="r.badge"
                  class="inline-flex shrink-0 items-center gap-1 font-mono text-xs text-success"
                  ><Icon
                    name="lucide:badge-check"
                    size="12"
                    aria-hidden="true"
                  />{{ r.badge }}</span
                >
              </header>
              <p
                v-if="r.rating"
                class="flex"
                :aria-label="`${r.rating} out of 5 stars`"
              >
                <Icon
                  v-for="n in 5"
                  :key="n"
                  :name="n <= r.rating ? 'material-symbols-light:kid-star-sharp' : 'material-symbols-light:kid-star-outline-sharp'"
                  size="14"
                  :class="n <= r.rating ? 'text-yellow' : 'text-mute'"
                  aria-hidden="true"
                />
              </p>
              <h3 v-if="r.title" class="text-lg leading-snug">{{ r.title }}</h3>
              <p class="whitespace-pre-line text-sm text-mute">{{ r.body }}</p>
            </article>
          </li>
        </ul>

        <LazyVEmptyState
          v-else
          title="No reviews yet"
          description="Be the first to rate this product and help other customers decide."
        />
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import type { ReviewSummary } from "~/types/product";

const props = defineProps<{ productId: string; reviews?: ReviewSummary }>();

const store = useReviewStore();
const mine = computed(() => store.forProduct(props.productId));

const seed = computed(() => props.reviews);
const seedCount = computed(() => seed.value?.count ?? 0);

const count = computed(() => seedCount.value + mine.value.length);

// Distribution is indexed 5 stars to 1 star.
const distribution = computed(() => {
  const d = [...(seed.value?.distribution ?? [0, 0, 0, 0, 0])];
  for (const r of mine.value) d[5 - r.rating] = (d[5 - r.rating] ?? 0) + 1;
  return d;
});

const score = computed(() => {
  if (!count.value) return 0;
  const seedTotal = (seed.value?.score ?? 0) * seedCount.value;
  const mineTotal = mine.value.reduce((sum, r) => sum + r.rating, 0);
  return (seedTotal + mineTotal) / count.value;
});

const dateFmt = new Intl.DateTimeFormat("en", {
  month: "short",
  year: "numeric",
});

// Newest customer reviews first, then the editorial ones.
const items = computed(() => [
  ...mine.value.map((r) => ({
    key: r.id,
    author: r.author,
    location: "",
    badge: "",
    rating: r.rating,
    title: r.title,
    body: r.body,
    date: dateFmt.format(new Date(r.createdAt)),
  })),
  ...(seed.value?.items ?? []).map((r) => ({
    key: `seed-${r.author}`,
    rating: 0,
    ...r,
  })),
]);
</script>
