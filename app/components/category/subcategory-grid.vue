<template>
  <section class="section section-compact" aria-labelledby="sub-title">
    <div class="container-page space-y-8">
      <section-heading
        id="sub-title"
        eyebrow="Optical taxonomy"
        title="Subcategory architecture"
        body="Pick a discipline to filter the verified inventory below."
      />
      <ul class="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <li
          v-for="(s, i) in items"
          :key="s.key"
          v-reveal="{ delay: (i % 6) * 60 }"
        >
          <LazyVButton
            variant="plain"
            block
            class="group card-compact flex h-full flex-col gap-3 text-start transition duration-200 hover:-translate-y-0.5 hover:border-accent"
            @click="emit('select', s.key)"
          >
            <span class="flex items-center justify-between text-mute">
              <span class="font-mono text-xs">0{{ i + 1 }}</span>
              <Icon
                :name="s.icon"
                size="20"
                class="icon-lift transition-colors duration-200 group-hover:text-accent"
                aria-hidden="true"
              />
            </span>
            <span class="font-display text-lg leading-tight">{{
              s.label
            }}</span>
            <span class="text-xs text-mute">{{ s.blurb }}</span>
            <span
              class="mt-auto flex items-center gap-1 font-mono text-xs tracking-wider text-accent"
            >
              Open spec
              <Icon
                name="lucide:arrow-right"
                size="12"
                class="icon-nudge rtl:-scale-x-100"
                aria-hidden="true"
              />
            </span>
          </LazyVButton>
        </li>
      </ul>
    </div>
  </section>
</template>

<script lang="ts" setup>
import type { CameraSub } from "~/types/cameras";

defineProps<{
  items: { key: CameraSub; label: string; blurb: string; icon: string }[];
}>();

const emit = defineEmits<{ select: [key: CameraSub] }>();
</script>