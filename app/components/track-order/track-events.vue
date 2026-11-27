<template>
  <section class="card-roomy" aria-labelledby="events-title">
    <header class="mb-5 flex flex-wrap items-center justify-between gap-2">
      <h2 id="events-title" class="font-display text-xl">
        {{ t("track_ui.event_history") }}
      </h2>
      <p class="meta">
        {{
          t(
            events.length === 1
              ? "track_ui.entry_recorded"
              : "track_ui.entries_recorded",
            { n: events.length },
          )
        }}
      </p>
    </header>

    <ol class="space-y-5">
      <li v-for="(e, i) in events" :key="e.title" class="relative ps-6">
        <span
          class="absolute start-0 top-1.5 h-2.5 w-2.5 rounded-full"
          :class="i === 0 ? 'bg-accent' : 'bg-success'"
          aria-hidden="true"
        />
        <span
          v-if="i < events.length - 1"
          class="absolute start-[4px] top-5 -bottom-5 w-px bg-line"
          aria-hidden="true"
        />
        <p class="meta">{{ formatWhen(e.at) }}</p>
        <h3 class="font-medium">{{ e.title }}</h3>
        <p class="text-sm text-mute">{{ e.body }}</p>
      </li>
    </ol>
  </section>
</template>

<script lang="ts" setup>
import { formatWhen } from "~/data/order";
import type { TrackEvent } from "~/data/tracking";

const { t } = useI18n();

defineProps<{ events: TrackEvent[] }>();
</script>