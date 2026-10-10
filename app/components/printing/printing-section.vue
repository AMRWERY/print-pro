<template>
  <section
    :id="id"
    :aria-labelledby="`${id}-title`"
    class="scroll-mt-40 card-roomy"
  >
    <header
      class="mb-5 flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-4"
    >
      <h2
        :id="`${id}-title`"
        class="flex items-baseline gap-3 title-md sm:text-2xl"
      >
        <span class="font-mono text-sm font-semibold text-accent">{{
          step
        }}</span>
        {{ title }}
      </h2>
      <p class="font-mono text-1xs tracking-wider text-mute">
        {{ stage }}
      </p>
    </header>
    <slot />
  </section>
</template>

<script lang="ts" setup>
defineProps<{
  id: string;
  step: string;
  title: string;
  stage: string;
}>();
</script>