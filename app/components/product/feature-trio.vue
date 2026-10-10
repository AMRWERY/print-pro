<template>
  <section class="section section-compact" aria-labelledby="feature-title">
    <div class="container-page space-y-8">
      <section-heading
        id="feature-title"
        :eyebrow="feature.eyebrow"
        :title="feature.title"
        :body="feature.body"
      />
      <ul class="grid gap-4 md:grid-cols-3">
        <li
          v-for="(c, i) in feature.cards"
          :key="c.title"
          v-reveal="{ delay: i * 90 }"
        >
          <article class="card flex h-full flex-col gap-2 p-5">
            <p class="eyebrow text-accent">{{ c.eyebrow }}</p>
            <h3 class="text-xl">{{ c.title }}</h3>
            <p class="text-sm text-mute">{{ c.body }}</p>
            <p
              class="mt-auto border-t border-line pt-3 meta"
            >
              {{ c.metric }}
            </p>
          </article>
        </li>
      </ul>
    </div>
  </section>
</template>

<script lang="ts" setup>
import type { ProductDetail } from "~/types/product";

defineProps<{ feature: NonNullable<ProductDetail["feature"]> }>();
</script>