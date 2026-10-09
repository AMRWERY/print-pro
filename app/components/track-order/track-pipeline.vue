<template>
  <section class="card p-5 sm:p-6" aria-labelledby="pipeline-title">
    <header class="mb-5 flex flex-wrap items-end justify-between gap-2">
      <div>
        <p class="eyebrow">Order journey</p>
        <h2 id="pipeline-title" class="font-display text-2xl">
          5-stage progress
        </h2>
      </div>
      <p class="font-mono text-xs text-mute">
        Stage {{ currentN }} of {{ stages.length }}
        {{ allDone ? "complete" : "active" }}
      </p>
    </header>

    <ol class="grid gap-3 md:grid-cols-5">
      <li
        v-for="s in stages"
        :key="s.key"
        class="flex flex-col gap-2 rounded-card border p-4"
        :class="
          s.status === 'current'
            ? 'border-accent bg-accent-soft'
            : 'border-line bg-surface'
        "
        :aria-current="s.status === 'current' ? 'step' : undefined"
      >
        <p class="eyebrow flex items-center justify-between">
          <span>Stage 0{{ s.n }}</span>
          <Icon
            :name="icon[s.status]"
            size="14"
            :class="[
              s.status === 'done' && 'text-success',
              s.status === 'current' && 'text-accent',
            ]"
            aria-hidden="true"
          />
        </p>
        <h3 class="font-display text-lg leading-snug">{{ s.title }}</h3>
        <p class="text-xs text-mute">{{ s.body }}</p>
        <p class="mt-auto pt-2 font-mono text-xs">
          <span class="text-mute">{{ label[s.status] }}</span
          ><br />
          <span :class="s.status === 'current' && 'text-accent'"
            >{{ s.status === "done" ? "" : "Est. "
            }}{{ formatWhen(s.at) }}</span
          >
        </p>
      </li>
    </ol>
  </section>
</template>

<script lang="ts" setup>
import { formatWhen } from "~/data/order";
import type { StepStatus } from "~/data/order";
import type { TrackStage } from "~/data/tracking";

const props = defineProps<{ stages: TrackStage[] }>();

const allDone = computed(() => props.stages.every((s) => s.status === "done"));
const currentN = computed(
  () =>
    props.stages.find((s) => s.status === "current")?.n ?? props.stages.length,
);

// Status is always icon + words + colour, never colour alone.
const label: Record<StepStatus, string> = {
  done: "Completed",
  current: "In progress",
  queued: "Queued",
};

const icon: Record<StepStatus, string> = {
  done: "lucide:circle-check",
  current: "lucide:loader-circle",
  queued: "lucide:clock",
};
</script>