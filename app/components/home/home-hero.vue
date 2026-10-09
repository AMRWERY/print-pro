<template>
  <section class="relative overflow-hidden border-b border-line" aria-labelledby="hero-title">
    <div class="pointer-events-none absolute inset-0 [background:radial-gradient(60%_80%_at_85%_30%,rgb(var(--c-accent)/0.12),transparent_70%)]" />
    <div class="container-page relative grid items-center gap-10 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
      <div class="animate-rise space-y-6">
        <p class="eyebrow inline-flex items-center gap-2"><span class="h-px w-6 bg-accent" />Calibration standard 2026 · bench certified</p>
        <h1 id="hero-title" class="text-4xl font-bold leading-[1.1] sm:text-5xl lg:text-6xl">
          Optical Precision Meets <span class="text-accent">Archival Mastery.</span>
        </h1>
        <p class="max-w-xl text-base text-mute">Equipping world-class studios, master printmakers and visionaries with medium-format cameras, cinema glass and 64-inch pigment print labs engineered for zero-defect output.</p>
        <div class="flex flex-wrap gap-3">
          <LazyVButton variant="primary" to="/products">
            Explore studio catalog
            <Icon name="lucide:arrow-right" size="16" class="icon-nudge rtl:-scale-x-100" aria-hidden="true" />
          </LazyVButton>
          <LazyVButton variant="secondary" to="/">Book 1-on-1 tech concierge</LazyVButton>
        </div>
        <dl class="grid max-w-lg grid-cols-3 gap-4 border-t border-line pt-6">
          <div v-for="s in heroStats" :key="s.label">
            <dt class="sr-only">{{ s.label }}</dt>
            <dd class="font-display text-2xl font-semibold" dir="ltr">{{ s.value }}</dd>
            <dd class="text-xs text-mute">{{ s.label }}</dd>
          </div>
        </dl>
      </div>

      <div class="relative animate-rise [animation-delay:.1s]">
        <media-placeholder src="/img/hero-img.png" fit="cover" label="Hasselblad medium-format camera on a calibration bench" size="140" class="aspect-[1697/927] w-full rounded-panel border border-line" />
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { heroStats } from '~/data/home'
</script>