<template>
  <section class="rounded-card border border-line bg-surface p-5" aria-labelledby="progress-title">
    <h2 id="progress-title" class="eyebrow mb-4 flex items-center gap-2 text-mute"><Icon name="lucide:route" size="14" aria-hidden="true" />Progress</h2>
    <ol class="space-y-4">
      <li v-for="(s, i) in steps" :key="s.key" class="relative flex gap-3">
        <span v-if="i < steps.length - 1" class="absolute start-3 top-7 h-[calc(100%-1rem)] w-px" :class="s.status === 'done' ? 'bg-accent' : 'bg-line'" aria-hidden="true" />
        <span class="relative z-10 grid h-6 w-6 shrink-0 place-items-center rounded-full border-2" :class="dot(s.status)">
          <Icon v-if="s.status === 'done'" name="lucide:check" size="12" aria-hidden="true" />
          <span v-else-if="s.status === 'current'" class="h-2 w-2 animate-pulse rounded-full bg-accent motion-reduce:animate-none" />
        </span>
        <div class="min-w-0 flex-1">
          <p class="text-sm font-semibold" :class="s.status === 'queued' ? 'text-mute' : 'text-paper'">
            {{ s.title }}
            <span class="sr-only">— {{ s.status === 'done' ? 'completed' : s.status === 'current' ? 'in progress' : 'upcoming' }}</span>
          </p>
          <p class="text-xs text-mute">{{ s.body }}</p>
          <p v-if="s.at" class="mt-0.5 font-mono text-[10px] text-mute">{{ s.status === 'done' ? '' : 'Est. ' }}{{ formatWhen(s.at, false) }}</p>
        </div>
      </li>
    </ol>
  </section>
</template>

<script lang="ts" setup>
import { formatWhen } from "~/data/order";
import type { StepStatus } from "~/data/order";
import { trackingStages } from "~/data/tracking";
import type { RequisitionOrder } from "~/types/account";

interface Step {
  key: string;
  title: string;
  body: string;
  status: StepStatus;
  at?: Date | null;
}

const props = defineProps<{ order: RequisitionOrder }>();
const { sourceOrder, now } = useAccount();

// Checkout orders use their real schedule; demo history gets stages that match its status.
const steps = computed<Step[]>(() => {
  const source = sourceOrder(props.order);
  if (source) return trackingStages(source, now.value);

  const reached = { processing: 1, "in-transit": 2, delivered: 3, archived: 3, recalled: 1 }[props.order.status];
  const placed = orderDate(props.order);
  const defs = [
    ["auth", "Order authorized", "Payment cleared and the requisition registered."],
    ["qa", "Bench QA & calibration", "Items checked against spec and calibrated."],
    ["transit", "In transit", props.order.dispatchedFrom ? `Dispatched from ${props.order.dispatchedFrom}.` : "Handed to the carrier."],
    ["done", props.order.status === "recalled" ? "Refunded" : "Delivered", props.order.status === "recalled" ? "Recalled and refunded to the original method." : "Received and signed for."],
  ] as const;
  return defs.map(([key, title, body], i) => ({
    key,
    title,
    body,
    status: i < reached || (props.order.status === "recalled" && i === 3) ? "done" : i === reached ? "current" : "queued",
    at: i === 0 ? placed : null,
  }));
});

const dot = (s: StepStatus) =>
  s === "done" ? "border-accent bg-accent text-onaccent" : s === "current" ? "border-accent bg-surface" : "border-line bg-surface";
</script>
