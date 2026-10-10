<template>
  <dl class="grid grid-cols-2 gap-3 lg:grid-cols-4">
    <div
      v-for="s in stats"
      :key="s.label"
      class="rounded-card border border-line bg-surface p-4"
    >
      <dt
        class="flex items-center justify-between font-mono text-[10px] tracking-wider text-mute"
      >
        {{ s.label }}
        <Icon :name="s.icon" size="14" :class="s.tone" aria-hidden="true" />
      </dt>
      <dd class="mt-2 font-display text-2xl font-bold text-paper">
        {{ s.value }}
      </dd>
      <p class="mt-0.5 font-mono text-[10px] text-mute">{{ s.note }}</p>
    </div>
  </dl>
</template>

<script lang="ts" setup>
import type { RequisitionOrder } from "~/types/account";

const props = defineProps<{ orders: RequisitionOrder[] }>();
const money = useMoney();

const stats = computed(() => {
  const o = props.orders;
  const settled = o
    .filter((x) => x.status !== "recalled")
    .reduce((sum, x) => sum + x.amount, 0);
  const transit = o.filter((x) => x.status === "in-transit").length;
  const processing = o.filter((x) => x.status === "processing").length;
  return [
    {
      label: "Total orders",
      value: String(o.length),
      note: "All time",
      icon: "lucide:receipt-text",
      tone: "text-accent",
    },
    {
      label: "Settled value",
      value: money.format(settled),
      note: "Excludes refunds",
      icon: "lucide:wallet",
      tone: "text-success",
    },
    {
      label: "In transit",
      value: String(transit),
      note: transit ? "Live tracking on" : "Nothing on the move",
      icon: "lucide:plane",
      tone: "text-cyan",
    },
    {
      label: "Processing",
      value: String(processing),
      note: "Awaiting dispatch",
      icon: "lucide:loader",
      tone: "text-yellow",
    },
  ];
});
</script>