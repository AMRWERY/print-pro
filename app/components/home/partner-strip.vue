<template>
  <section class="border-b border-line bg-surface" aria-label="Direct manufacturer partners">
    <div class="container-page flex flex-col gap-4 py-6 lg:flex-row lg:items-center lg:gap-10">
      <p class="eyebrow shrink-0">Direct manufacturer partners</p>
      <ul class="flex flex-1 flex-wrap items-center gap-x-8 gap-y-3 font-display text-base font-semibold uppercase tracking-wider text-mute">
        <li v-for="p in partners" :key="p">{{ p }}</li>
      </ul>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { partners } from '~/data/home'
</script>
