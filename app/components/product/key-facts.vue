<template>
  <dl
    class="grid grid-cols-2 gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-3 lg:grid-cols-6"
  >
    <div v-for="f in items" :key="f.label" class="bg-surface p-4">
      <dt class="eyebrow">{{ f.label }}</dt>
      <dd class="mt-1 font-display text-lg" dir="ltr">{{ f.value }}</dd>
    </div>
  </dl>
</template>

<script lang="ts" setup>
defineProps<{ items: { label: string; value: string }[] }>();
</script>