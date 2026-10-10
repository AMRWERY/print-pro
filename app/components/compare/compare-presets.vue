<template>
  <section
    class="border-t border-line bg-surface py-12 md:py-16"
    aria-labelledby="presets-title"
  >
    <div class="container-page space-y-8">
      <section-heading
        id="presets-title"
        eyebrow="Lab direct presets"
        title="Compare another optical discipline"
        body="Instant-load calibrated bench test configurations across printers, medium-format bodies and archival papers."
      />
      <ul class="grid gap-4 md:grid-cols-3">
        <li v-for="(p, i) in presets" :key="p.key" v-reveal="{ delay: i * 80 }">
          <LazyVButton
            variant="plain"
            block
            class="group card flex h-full flex-col gap-3 p-5 text-start transition duration-200 hover:-translate-y-0.5 hover:border-accent"
            @click="emit('load', p.ids)"
          >
            <span class="eyebrow flex items-center justify-between">
              {{ p.label }}
              <span class="text-accent">{{ p.ids.length }} systems</span>
            </span>
            <span class="font-display text-xl leading-snug">{{ p.title }}</span>
            <span class="text-sm text-mute">{{ p.body }}</span>
            <span
              class="mt-auto flex items-center gap-1 font-mono text-xs tracking-wider text-accent"
            >
              Load comparison
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
import { comparePresets as presets } from "~/data/compare";

const emit = defineEmits<{ load: [ids: string[]] }>();
</script>