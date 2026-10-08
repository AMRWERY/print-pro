<template>
  <section class="section" aria-labelledby="disciplines-title">
    <div class="container-page space-y-8">
      <section-heading id="disciplines-title" eyebrow="Architecture of creation" title="Instrument disciplines" body="Precision-bench tested categories for large-format and fine-art output, from camera body to finished print." />
      <ul class="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 lg:grid-cols-4">
        <li v-for="(c, i) in categories" :key="c.label" v-reveal="{ delay: (i % 4) * 70 }">
          <nuxt-link-locale :to="c.to" class="group card flex h-full flex-col gap-3 p-5 transition duration-200 hover:-translate-y-0.5 hover:border-accent">
            <span class="flex items-center justify-between font-mono text-xs text-mute">
              0{{ i + 1 }} / {{ c.label.split(' ')[0]!.toUpperCase().slice(0, 7) }}
              <Icon :name="c.icon" size="20" class="icon-lift text-mute transition-colors duration-200 group-hover:text-accent" aria-hidden="true" />
            </span>
            <span class="font-display text-xl">{{ c.label }}</span>
            <span class="text-sm text-mute">{{ c.blurb }}</span>
            <span class="mt-auto flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-accent">
              {{ c.meta }}
              <Icon name="lucide:arrow-right" size="12" class="icon-nudge rtl:-scale-x-100" aria-hidden="true" />
            </span>
          </nuxt-link-locale>
        </li>
      </ul>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { categories } from '~/data/home'
</script>
