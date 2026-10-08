<template>
  <section class="border-y border-line bg-surface" :aria-label="label">
    <div
      v-reveal:fade
      class="container-page flex flex-col gap-3 py-5 lg:flex-row lg:items-center lg:gap-10"
    >
      <p class="eyebrow shrink-0">{{ label }}</p>
      <ul
        class="flex flex-1 flex-wrap items-center gap-x-8 gap-y-2 font-display text-base font-semibold uppercase tracking-wider text-mute"
      >
        <li v-for="b in brands" :key="b">{{ b }}</li>
      </ul>
    </div>
  </section>
</template>

<script lang="ts" setup>
defineProps<{
  label: string;
  brands: string[];
}>();
</script>