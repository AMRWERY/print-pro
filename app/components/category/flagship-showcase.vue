<template>
  <section class="section !py-12 md:!py-16" aria-labelledby="flagship-title">
    <div class="container-page space-y-8">
      <section-heading
        id="flagship-title"
        eyebrow="Optical bench spotlight"
        title="Curated studio flagships"
      />
      <div class="grid gap-4 lg:grid-cols-2">
        <article
          v-for="(f, i) in items"
          :key="f.id"
          v-reveal="{ delay: i * 100 }"
          class="group card flex flex-col overflow-hidden"
        >
          <div class="relative">
            <media-placeholder
              :icon="f.icon"
              :src="f.image"
              :label="`${f.name} image`"
              size="110"
              class="h-56 sm:h-64"
            />
            <span
              class="absolute start-3 top-3 rounded-control px-2.5 py-1 font-mono text-xs uppercase tracking-wider backdrop-blur"
              :class="
                f.tone === 'accent'
                  ? 'bg-accent text-onaccent'
                  : 'bg-yellow text-onprimary'
              "
              >{{ f.tag }}</span
            >
            <span
              class="absolute end-3 top-3 font-mono text-xs text-mute"
              dir="ltr"
              >{{ f.sku }}</span
            >
          </div>

          <div class="flex flex-1 flex-col gap-4 p-5">
            <div class="flex flex-wrap items-baseline justify-between gap-2">
              <h3 class="text-2xl">{{ f.name }}</h3>
              <p class="font-display text-2xl font-semibold text-accent">
                {{ money.format(f.price) }}
              </p>
            </div>
            <p class="text-sm text-mute">{{ f.blurb }}</p>
            <dl
              class="grid grid-cols-2 gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-4"
            >
              <div v-for="s in f.specs" :key="s.label" class="bg-ink p-3">
                <dt class="eyebrow">{{ s.label }}</dt>
                <dd class="mt-1 font-mono text-sm" dir="ltr">{{ s.value }}</dd>
              </div>
            </dl>
            <div class="mt-auto flex flex-wrap gap-3 pt-1">
              <button type="button" class="btn-accent flex-1">
                <Icon
                  name="lucide:shopping-bag"
                  size="16"
                  class="icon-bob"
                  aria-hidden="true"
                />{{ f.action }}
              </button>
              <button v-if="f.secondary" type="button" class="btn-ghost">
                {{ f.secondary }}
              </button>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import type { Flagship } from "~/types/cameras";

defineProps<{ items: Flagship[] }>();

const money = useMoney();
</script>