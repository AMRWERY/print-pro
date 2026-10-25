<template>
  <section class="section" aria-labelledby="arrivals-title">
    <div class="container-page space-y-8">
      <section-heading
        id="arrivals-title"
        eyebrow="New and back in stock"
        title="Latest arrivals"
      >
        <LazyVButton
          variant="tertiary"
          to="/products"
          class="inline-flex items-center gap-1.5 font-mono text-xs tracking-wider"
        >
          {{ t("btn.view_all_products") }}
          <Icon
            name="lucide:arrow-right"
            size="14"
            class="icon-nudge rtl:-scale-x-100"
            aria-hidden="true"
          />
        </LazyVButton>
      </section-heading>

      <ul class="grid gap-4 md:grid-cols-3">
        <li v-for="(a, i) in arrivals" :key="a.id" v-reveal="{ delay: i * 90 }">
          <article
            class="group card flex h-full flex-col overflow-hidden transition duration-200 hover:-translate-y-0.5 hover:border-mute/50"
          >
            <media-placeholder
              :icon="a.icon"
              :src="a.image"
              :alt="a.imageAlt"
              :label="`${a.name} image`"
              size="56"
              class="aspect-[16/9]"
            />

            <div class="flex flex-1 flex-col gap-2 p-4">
              <p class="eyebrow text-accent">{{ a.tag }}</p>
              <h3 class="text-xl">{{ a.name }}</h3>
              <p class="text-sm text-mute">{{ a.note }}</p>
              <div class="mt-auto flex items-center justify-between gap-3 pt-3">
                <p class="font-display text-2xl font-semibold">
                  {{ money.format(a.price) }}
                </p>
                <LazyVButton variant="secondary">{{ t(a.action) }}</LazyVButton>
              </div>
            </div>
          </article>
        </li>
      </ul>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { arrivals } from "~/data/home";

const { t } = useI18n();

const money = useMoney();
</script>