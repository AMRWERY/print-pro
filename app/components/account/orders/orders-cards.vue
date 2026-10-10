<template>
  <ul class="space-y-3 md:hidden">
    <li v-for="o in orders" :key="o.id">
      <NuxtLinkLocale :to="`/account/orders/${orderSlug(o.id)}`" class="block space-y-3 rounded-card border border-line bg-surface p-4 transition-colors duration-150 hover:border-accent/50 focus-visible:outline-2 focus-visible:outline-accent">
        <div class="flex items-start justify-between gap-2">
          <div>
            <p class="font-mono text-xs font-bold text-accent">{{ o.id }}</p>
            <p class="font-mono text-[10px] text-mute">{{ orderDateLabel(o) }}</p>
          </div>
          <account-status-chip :status="o.status" />
        </div>
        <p class="line-clamp-2 text-sm text-paper">{{ o.title }}</p>
        <div class="flex items-center justify-between border-t border-line pt-3">
          <orders-thumbs :items="o.items" />
          <span class="font-display text-lg font-bold text-paper">{{ money.format(o.amount) }}</span>
        </div>
      </NuxtLinkLocale>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import type { RequisitionOrder } from "~/types/account";

defineProps<{ orders: RequisitionOrder[] }>();
const money = useMoney();
</script>
