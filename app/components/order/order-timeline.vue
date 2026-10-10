<template>
  <section
    id="tracking"
    class="card-roomy scroll-mt-6"
    aria-labelledby="timeline-title"
  >
    <header class="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <p class="eyebrow flex items-center gap-2">
          <span class="pip" aria-hidden="true" />Mission routing
        </p>
        <h2 id="timeline-title" class="font-display text-2xl">
          Order progress
        </h2>
      </div>
      <p
        class="rounded-control border border-line px-3 py-1.5 font-mono text-xs"
      >
        <span class="text-mute">{{
          order.delivery.id === "pickup"
            ? "Ready for pickup:"
            : "Guaranteed handover:"
        }}</span>
        <span class="text-accent">{{ formatWhen(handover, false) }}</span>
      </p>
    </header>

    <ol class="grid gap-3 md:grid-cols-4">
      <li
        v-for="(s, i) in steps"
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
          <span>0{{ i + 1 }} · {{ label[s.status] }}</span>
          <Icon
            :name="icon[s.status]"
            size="14"
            :class="[
              s.status === 'done' && 'text-success',
              s.status === 'current' && 'animate-spin text-accent',
            ]"
            aria-hidden="true"
          />
        </p>
        <h3 class="font-display text-lg leading-snug">{{ s.title }}</h3>
        <p class="text-xs text-mute">{{ s.body }}</p>
        <p
          class="mt-auto pt-2 font-mono text-xs"
          :class="s.status === 'current' && 'text-accent'"
        >
          <template v-if="s.when"
            >{{ s.status === "done" ? "Completed" : "Est." }}
            {{ formatWhen(s.when) }}</template
          >

          <template v-else>In progress</template>
        </p>
      </li>
    </ol>
  </section>
</template>

<script lang="ts" setup>
import { estimatedHandover, formatWhen, orderTimeline } from "~/data/order";
import type { StepStatus } from "~/data/order";
import type { Order } from "~/types/order";

const props = defineProps<{ order: Order }>();

const steps = computed(() => orderTimeline(props.order));

const handover = computed(() => estimatedHandover(props.order));

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