<template>
  <ul
    class="divide-y divide-line overflow-hidden rounded-card border border-line"
  >
    <li v-for="(f, i) in items" :key="f.q" v-reveal="{ delay: i * 60 }">
      <h3>
        <LazyVButton variant="plain" block
          class="flex items-center justify-between gap-4 p-4 text-start text-sm font-medium transition-colors duration-200 hover:bg-raised sm:text-base"
          :aria-expanded="openIndex === i"
          :aria-controls="`${uid}-${i}`"
          @click="openIndex = openIndex === i ? -1 : i"
        >
          {{ f.q }}
          <Icon
            name="lucide:chevron-down"
            size="18"
            class="shrink-0 text-mute transition-transform duration-200"
            :class="openIndex === i && 'rotate-180 text-accent'"
            aria-hidden="true"
          />
        </LazyVButton>
      </h3>
      <div
        :id="`${uid}-${i}`"
        class="grid transition-[grid-template-rows] duration-300 ease-out"
        :class="openIndex === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
        :inert="openIndex !== i"
      >
        <div class="overflow-hidden">
          <p class="px-4 pb-4 text-sm text-mute">{{ f.a }}</p>
        </div>
      </div>
    </li>
  </ul>
</template>

<script lang="ts" setup>
defineProps<{
  items: { q: string; a: string }[];
}>();

const uid = useId();
const openIndex = ref(0);
</script>