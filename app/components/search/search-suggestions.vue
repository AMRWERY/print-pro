<template>
  <div
    :id="id"
    class="grid gap-6 border-t border-line p-4 md:grid-cols-3"
    role="presentation"
  >
    <section aria-labelledby="sg-predictive">
      <h3 id="sg-predictive" class="eyebrow mb-3 flex items-center gap-1.5">
        <Icon
          name="lucide:sparkles"
          size="12"
          class="text-accent"
          aria-hidden="true"
        />
        Predictive matches
      </h3>
      <ul
        v-if="matches.length"
        role="listbox"
        aria-label="Predictive matches"
        class="space-y-1"
      >
        <li
          v-for="(p, i) in matches"
          :id="`${id}-opt-${i}`"
          :key="p.id"
          role="option"
          :aria-selected="activeIndex === i"
        >
          <button
            type="button"
            class="flex w-full items-baseline justify-between gap-3 rounded-control px-2 py-1.5 text-start text-sm transition-colors duration-200 hover:bg-raised"
            :class="activeIndex === i ? 'bg-raised text-accent' : 'text-paper'"
            @mousedown.prevent
            @click="emit('pick', p.name)"
          >
            <span class="truncate">{{ p.brand }} {{ p.name }}</span>
            <span class="shrink-0 font-mono text-xs text-mute">{{
              money.format(p.price)
            }}</span>
          </button>
        </li>
      </ul>
      <p v-else class="px-2 text-sm text-mute">
        No predictive matches yet. Try a brand or model.
      </p>
    </section>

    <section aria-labelledby="sg-recent">
      <h3 id="sg-recent" class="eyebrow mb-3 flex items-center gap-1.5">
        <Icon name="lucide:history" size="12" aria-hidden="true" />
        Recent searches
      </h3>
      <ul v-if="recent.length" class="space-y-1">
        <li v-for="r in recent" :key="r">
          <button
            type="button"
            class="flex w-full items-center justify-between gap-3 rounded-control px-2 py-1.5 text-start text-sm text-mute transition-colors duration-200 hover:bg-raised hover:text-paper"
            @mousedown.prevent
            @click="emit('pick', r)"
          >
            <span class="truncate">{{ r }}</span>
            <Icon
              name="lucide:arrow-up-right"
              size="12"
              class="icon-nudge shrink-0 rtl:-scale-x-100"
              aria-hidden="true"
            />
          </button>
        </li>
      </ul>
      <p v-else class="px-2 text-sm text-mute">
        Your recent searches will appear here.
      </p>
    </section>

    <section aria-labelledby="sg-trending">
      <h3 id="sg-trending" class="eyebrow mb-3 flex items-center gap-1.5">
        <Icon name="lucide:trending-up" size="12" aria-hidden="true" />
        Trending in gallery
      </h3>
      <ul class="space-y-1">
        <li v-for="t in trending" :key="t.term">
          <button
            type="button"
            class="flex w-full items-center justify-between gap-3 rounded-control px-2 py-1.5 text-start text-sm text-mute transition-colors duration-200 hover:bg-raised hover:text-paper"
            @mousedown.prevent
            @click="emit('pick', t.term)"
          >
            <span class="truncate">{{ t.term }}</span>
            <span class="shrink-0 font-mono text-xs uppercase text-accent">{{
              t.tag
            }}</span>
          </button>
        </li>
      </ul>
    </section>

    <div
      class="flex items-center justify-between gap-3 border-t border-line pt-3 font-mono text-xs text-mute md:col-span-3"
    >
      <span
        >Press <kbd class="rounded border border-line px-1">Esc</kbd> to
        dismiss</span
      >
      <button
        v-if="recent.length"
        type="button"
        class="text-accent hover:underline"
        @mousedown.prevent
        @click="emit('clear-recent')"
      >
        Clear search history
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { CatalogProduct } from "~/types/catalog";

defineProps<{
  id: string;
  matches: CatalogProduct[];
  recent: string[];
  activeIndex: number;
}>();

const emit = defineEmits<{ pick: [term: string]; "clear-recent": [] }>();

const money = useMoney();

const trending = [
  { term: "Hahnemühle Photo Rag", tag: "Craft" },
  { term: "Spectrophotometer", tag: "Service" },
  { term: "Epson SureColor", tag: "New batch" },
  { term: "Canon PIXMA", tag: "Popular" },
];
</script>