<template>
  <section class="card-roomy" aria-labelledby="pipeline-title">
    <header class="mb-5 flex flex-wrap items-end justify-between gap-2">
      <div>
        <p class="eyebrow">{{ t("track_ui.order_journey") }}</p>
        <h2 id="pipeline-title" class="font-display text-2xl">
          {{ t("track_ui.five_stage_progress") }}
        </h2>
      </div>
      <p class="meta">
        {{
          t(allDone ? "track_ui.stage_of_complete" : "track_ui.stage_of_active", {
            n: currentN,
            total: stages.length,
          })
        }}
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
          <span>{{ t("track_ui.stage_n", { n: `0${s.n}` }) }}</span>
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
            >{{ s.status === "done" ? "" : `${t("order_ui.est")} `
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

const { t } = useI18n();

const props = defineProps<{ stages: TrackStage[] }>();

const allDone = computed(() => props.stages.every((s) => s.status === "done"));
const currentN = computed(
  () =>
    props.stages.find((s) => s.status === "current")?.n ?? props.stages.length,
);

// Status is always icon + words + colour, never colour alone.
const label = computed<Record<StepStatus, string>>(() => ({
  done: t("order_ui.completed"),
  current: t("order_ui.in_progress"),
  queued: t("order_ui.queued"),
}));

const icon: Record<StepStatus, string> = {
  done: "lucide:circle-check",
  current: "lucide:loader-circle",
  queued: "lucide:clock",
};
</script>