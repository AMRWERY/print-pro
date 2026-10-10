<template>
  <section
    class="relative overflow-hidden border-b border-line"
    aria-labelledby="category-title"
  >
    <div
      class="pointer-events-none absolute inset-0 [background:radial-gradient(60%_90%_at_85%_20%,rgb(var(--c-accent)/0.14),transparent_70%)]"
    />
    <div class="container-page relative space-y-8 py-12 lg:py-16">
      <div class="animate-rise max-w-3xl space-y-5">
        <p class="eyebrow-accent">
          <span class="pip" aria-hidden="true" />{{ eyebrow }}
        </p>
        <h1
          id="category-title"
          class="text-4xl font-bold sm:text-5xl lg:text-6xl"
        >
          {{ title }}
        </h1>
        <p class="text-base text-mute">{{ description }}</p>
        <div class="flex flex-wrap items-center gap-3">
          <slot name="actions" />
        </div>
      </div>

      <dl
        class="grid grid-cols-2 gap-px overflow-hidden rounded-card border border-line bg-line lg:grid-cols-4"
      >
        <div v-for="s in stats" :key="s.label" class="bg-surface p-4">
          <dt class="eyebrow">{{ s.label }}</dt>
          <dd class="mt-1 font-display text-xl sm:text-2xl" dir="ltr">
            {{ s.value }}
          </dd>
          <dd class="mt-0.5 text-xs text-mute">{{ s.note }}</dd>
        </div>
      </dl>
    </div>
  </section>
</template>

<script lang="ts" setup>
defineProps<{
  eyebrow: string;
  title: string;
  description: string;
  stats: { label: string; value: string; note: string }[];
}>();
</script>