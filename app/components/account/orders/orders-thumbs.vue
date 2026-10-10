<template>
  <ul class="flex items-center -space-x-2 rtl:space-x-reverse" :aria-label="`${items.length} item${items.length === 1 ? '' : 's'}`">
    <li v-for="(item, i) in shown" :key="i" class="relative h-9 w-9 overflow-hidden rounded-control border-2 border-surface bg-raised" :title="item.name">
      <img v-if="item.thumb" :src="item.thumb" :alt="item.name" class="h-full w-full object-contain p-0.5" loading="lazy" />
      <span v-else class="grid h-full w-full place-items-center text-mute"><Icon :name="item.icon || 'lucide:box'" size="14" aria-hidden="true" /></span>
    </li>
    <li v-if="items.length > max" class="grid h-9 w-9 place-items-center rounded-control border-2 border-surface bg-raised font-mono text-2xs font-bold text-mute">+{{ items.length - max }}</li>
  </ul>
</template>

<script lang="ts" setup>
import type { RequisitionOrder } from "~/types/account";

const props = withDefaults(defineProps<{ items: RequisitionOrder["items"]; max?: number }>(), { max: 3 });
const shown = computed(() => props.items.slice(0, props.max));
</script>
