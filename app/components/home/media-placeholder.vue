<template>
  <!-- Real photo on white (reads the same in both themes) -->
  <div v-if="src" class="overflow-hidden bg-white">
    <img
      :src="src"
      :alt="alt ?? label"
      loading="lazy"
      decoding="async"
      class="h-full w-full object-contain p-2 transition duration-500 group-hover:scale-105"
    />
  </div>
  <div
    v-else
    class="relative isolate overflow-hidden bg-gradient-to-br from-raised via-surface to-ink"
    role="img"
    :aria-label="label"
  >
    <div
      class="absolute inset-0 -z-10 opacity-60 [background:radial-gradient(circle_at_30%_20%,rgb(var(--c-accent)/0.18),transparent_55%)]"
    />
    <div
      class="grid h-full w-full place-items-center transition duration-500 group-hover:scale-105"
    >
      <Icon :name="icon" :size="size" class="text-mute/50" aria-hidden="true" />
    </div>
  </div>
</template>

<script lang="ts" setup>
// Shows `src` when provided, otherwise an icon stand-in (design.md §32).
withDefaults(
  defineProps<{
    icon: string;
    label: string;
    src?: string;
    alt?: string;
    size?: string;
  }>(),
  {
    size: "72",
  },
);
</script>