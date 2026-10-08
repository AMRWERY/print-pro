<template>
  <!-- Real photo on white (reads the same in both themes) -->
  <div v-if="src" class="overflow-hidden" :class="fit === 'cover' ? 'bg-raised' : 'bg-white'">
    <img
      :src="src"
      :alt="alt ?? label"
      loading="lazy"
      decoding="async"
      class="h-full w-full transition duration-500 group-hover:scale-105"
      :class="fit === 'cover' ? 'object-cover' : 'object-contain p-2'"
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
    /** Stand-in icon shown when there is no `src`. */
    icon?: string;
    label: string;
    src?: string;
    alt?: string;
    size?: string;
    /** contain: product shot on white (default). cover: full-bleed photo. */
    fit?: "contain" | "cover";
  }>(),
  {
    icon: "lucide:image",
    size: "72",
    fit: "contain",
  },
);
</script>