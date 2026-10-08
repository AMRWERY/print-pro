<template>
  <section class="card" aria-labelledby="saved-title">
    <h2 id="saved-title">
      <button type="button" class="flex w-full items-center justify-between gap-3 p-4 text-start" :aria-expanded="open" :aria-controls="`${uid}-list`" @click="open = !open">
        <span class="eyebrow !text-paper">Saved for later &amp; studio registry ({{ items.length }} {{ items.length === 1 ? "apparatus" : "apparatus" }})</span>
        <Icon name="lucide:chevron-down" size="16" class="shrink-0 text-mute transition-transform duration-200" :class="open && 'rotate-180'" aria-hidden="true" />
      </button>
    </h2>
    <div :id="`${uid}-list`" class="grid transition-[grid-template-rows] duration-300 ease-out" :class="open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'" :inert="!open">
      <div class="overflow-hidden">
        <ul class="space-y-3 p-4 pt-0">
          <li v-for="p in items" :key="p.id" class="flex flex-wrap items-center gap-3 rounded-card border border-line bg-raised p-3">
            <div class="h-14 w-16 shrink-0 overflow-hidden rounded-control border border-line">
              <img v-if="p.image" :src="p.image" :alt="p.imageAlt ?? p.name" class="h-full w-full bg-white object-contain p-1" loading="lazy" />
              <media-placeholder v-else :icon="p.icon" :label="`${p.name} image`" size="28" class="h-full w-full" />
            </div>
            <div class="min-w-0 flex-1">
              <p class="eyebrow">{{ p.brand }}</p>
              <p class="truncate text-sm font-medium">{{ p.name }}</p>
              <p class="font-mono text-xs text-accent">{{ money.format(p.price) }}</p>
            </div>
            <button type="button" class="btn-ghost !px-3 !py-1.5 text-xs" @click="emit('restore', p)">
              <Icon name="lucide:corner-up-left" size="14" aria-hidden="true" />Move to manifest
            </button>
            <button type="button" class="btn-icon h-9 w-9" :aria-label="`Remove ${p.name} from saved items`" @click="emit('remove', p.id)">
              <Icon name="lucide:x" size="14" aria-hidden="true" />
            </button>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import type { DetailedProduct } from "~/types/product";

defineProps<{ items: DetailedProduct[] }>();
const emit = defineEmits<{ restore: [product: DetailedProduct]; remove: [id: string] }>();

const money = useMoney();
const uid = useId();
const open = ref(true);
</script>
