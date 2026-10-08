<template>
  <section class="section" aria-labelledby="arrivals-title">
    <div class="container-page space-y-8">
      <section-heading id="arrivals-title" eyebrow="Verified consignment & fresh drops" title="Bench-certified arrivals">
        <nuxt-link-locale to="/" class="link-quiet inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider">
          View all consignments
          <Icon name="lucide:arrow-right" size="14" class="icon-nudge rtl:-scale-x-100" aria-hidden="true" />
        </nuxt-link-locale>
      </section-heading>

      <ul class="grid gap-4 md:grid-cols-3">
        <li v-for="a in arrivals" :key="a.id">
          <article class="group card flex h-full flex-col overflow-hidden transition duration-200 hover:-translate-y-0.5 hover:border-mute/50">
            <media-placeholder :icon="a.icon" :src="a.image" :alt="a.imageAlt" :label="`${a.name} image`" size="56" class="aspect-[16/9]" />
            <div class="flex flex-1 flex-col gap-2 p-4">
              <p class="eyebrow text-accent">{{ a.tag }}</p>
              <h3 class="text-xl">{{ a.name }}</h3>
              <p class="text-sm text-mute">{{ a.note }}</p>
              <div class="mt-auto flex items-center justify-between gap-3 pt-3">
                <p class="font-display text-2xl font-semibold">{{ money.format(a.price) }}</p>
                <button type="button" class="btn-ghost">{{ a.action }}</button>
              </div>
            </div>
          </article>
        </li>
      </ul>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { arrivals } from '~/data/home'
const money = useMoney()
</script>
