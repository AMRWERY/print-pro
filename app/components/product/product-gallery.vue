<template>
  <div class="space-y-3">
    <div class="relative overflow-hidden rounded-card border border-line">
      <Transition name="fade" mode="out-in">
        <div :key="active" class="aspect-[4/3] w-full">
          <img
            v-if="current.src"
            :src="current.src"
            :alt="current.alt ?? current.label"
            class="h-full w-full object-cover"
            decoding="async"
          />
          <media-placeholder
            v-else
            :icon="current.icon ?? 'lucide:image'"
            :label="`${current.label} view`"
            size="120"
            class="h-full w-full"
          />
        </div>
      </Transition>

      <span
        class="absolute start-3 top-3 rounded-control bg-ink/80 px-2.5 py-1 font-mono text-xs tracking-wider backdrop-blur"
        >{{ current.label }}</span
      >
      <span
        class="absolute bottom-3 end-3 meta"
        aria-hidden="true"
        >{{ active + 1 }} / {{ items.length }}</span
      >
    </div>

    <ul
      v-if="items.length > 1"
      class="grid grid-cols-3 gap-2 sm:grid-cols-6"
      role="tablist"
      aria-label="Product views"
    >
      <li v-for="(g, i) in items" :key="g.label" role="presentation">
        <LazyVButton
          variant="plain"
          block
          role="tab"
          :aria-selected="active === i"
          :aria-label="`Show ${g.label} view`"
          class="block aspect-[4/3] overflow-hidden rounded-control border transition duration-200"
          :class="
            active === i
              ? 'border-accent'
              : 'border-line opacity-70 hover:opacity-100'
          "
          @click="active = i"
        >
          <img
            v-if="g.src"
            :src="g.src"
            alt=""
            class="h-full w-full object-cover"
            loading="lazy"
          />
          <span
            v-else
            class="grid h-full w-full place-items-center bg-raised text-mute"
            ><Icon
              :name="g.icon ?? 'lucide:image'"
              size="22"
              aria-hidden="true"
          /></span>
        </LazyVButton>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import type { GalleryItem } from "~/types/product";

const props = defineProps<{ items: GalleryItem[] }>();

const active = ref(0);

const current = computed(() => props.items[active.value] ?? props.items[0]!);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>