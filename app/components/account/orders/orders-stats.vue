<template>
  <dl class="grid grid-cols-2 gap-3 lg:grid-cols-4">
    <div
      v-for="s in stats"
      :key="s.label"
      class="card-compact"
    >
      <dt
        class="flex items-center justify-between font-mono text-2xs tracking-wider text-mute"
      >
        {{ s.label }}
        <Icon :name="s.icon" size="14" :class="s.tone" aria-hidden="true" />
      </dt>
      <dd class="mt-2 font-display text-2xl font-bold text-paper">
        {{ s.value }}
      </dd>
      <p class="mt-0.5 font-mono text-2xs text-mute">{{ s.note }}</p>
    </div>
  </dl>
</template>

<script lang="ts" setup>
import type { RequisitionOrder } from "~/types/account";

const { t } = useI18n();
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
      label: t("acct_orders.stat_total_orders"),
      value: String(o.length),
      note: t("acct_orders.stat_all_time"),
      icon: "lucide:receipt-text",
      tone: "text-accent",
    },
    {
      label: t("acct_orders.stat_settled_value"),
      value: money.format(settled),
      note: t("acct_orders.stat_excludes_refunds"),
      icon: "lucide:wallet",
      tone: "text-success",
    },
    {
      label: t("account.in_transit"),
      value: String(transit),
      note: transit ? t("acct_orders.stat_live_tracking") : t("acct_orders.stat_nothing_moving"),
      icon: "lucide:plane",
      tone: "text-cyan",
    },
    {
      label: t("account.processing"),
      value: String(processing),
      note: t("acct_orders.stat_awaiting_dispatch"),
      icon: "lucide:loader",
      tone: "text-yellow",
    },
  ];
});
</script>