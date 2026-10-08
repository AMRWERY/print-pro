<template>
  <div class="card flex flex-col items-center gap-4 px-6 py-16 text-center">
    <span
      class="grid h-14 w-14 place-items-center rounded-full border border-line text-mute"
      aria-hidden="true"
    >
      <Icon :name="icon" size="26" class="icon-lift" />
    </span>
    <div class="space-y-1">
      <h2 class="font-display text-xl">{{ title }}</h2>
      <p class="max-w-md text-sm text-mute">{{ description }}</p>
    </div>
    <div v-if="$slots.default" class="flex flex-wrap justify-center gap-3">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
// Generic empty state: icon, headline, short explanation and optional actions.
//
//   <LazyVEmptyState icon="lucide:bookmark-plus" title="…" description="…">
//     <button class="btn-accent">Primary action</button>
//   </LazyVEmptyState>
//
// With no props it shows the catalog "no results" message.
withDefaults(
  defineProps<{
    icon?: string;
    title?: string;
    description?: string;
  }>(),
  {
    icon: "lucide:search-x",
    title: "No instruments match these constraints",
    description:
      "Try removing a filter or widening the price range. Can’t find a specific model? Our bench team can source it.",
  },
);
</script>