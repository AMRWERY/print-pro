<template>
  <div class="hidden overflow-hidden card md:block">
    <table class="w-full text-start text-sm">
      <caption class="sr-only">
        {{ t("acct_orders.your_orders") }}
      </caption>
      <thead
        class="border-b border-line bg-raised/50 font-mono text-2xs tracking-wider text-mute"
      >
        <tr>
          <th scope="col" class="px-4 py-3 text-start font-semibold">{{ t("acct_orders.col_order") }}</th>
          <th scope="col" class="px-4 py-3 text-start font-semibold">{{ t("acct_orders.col_items") }}</th>
          <th scope="col" class="px-4 py-3 text-start font-semibold">{{ t("acct_orders.col_placed") }}</th>
          <th scope="col" class="px-4 py-3 text-start font-semibold">{{ t("acct_orders.col_status") }}</th>
          <th scope="col" class="px-4 py-3 text-end font-semibold">{{ t("acct_orders.col_total") }}</th>
          <th scope="col" class="px-4 py-3">
            <span class="sr-only">{{ t("acct_orders.col_actions") }}</span>
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-line">
        <tr
          v-for="o in orders"
          :key="o.id"
          class="transition-colors duration-150 hover:bg-raised/40"
        >
          <td class="px-4 py-3 align-middle">
            <nuxt-link-locale
              :to="`/account/orders/${orderSlug(o.id)}`"
              class="font-mono text-xs font-bold text-accent hover:underline"
              >{{ o.id }}</nuxt-link-locale
            >
            <p v-if="o.waybill" class="font-mono text-2xs text-mute">
              {{ o.waybill }}
            </p>
          </td>
          <td class="px-4 py-3 align-middle">
            <div class="flex items-center gap-3">
              <orders-thumbs :items="o.items" />
              <p class="line-clamp-2 max-w-64 text-xs text-paper">
                {{ o.title }}
              </p>
            </div>
          </td>
          <td class="whitespace-nowrap px-4 py-3 align-middle meta">
            {{ orderDateLabel(o) }}
          </td>
          <td class="px-4 py-3 align-middle">
            <account-status-chip :status="o.status" />
          </td>
          <td
            class="whitespace-nowrap px-4 py-3 text-end align-middle font-display font-bold text-paper"
          >
            {{ money.format(o.amount) }}
          </td>
          <td class="px-4 py-3 text-end align-middle">
            <LazyVButton
              variant="secondary"
              size="sm"
              :to="`/account/orders/${orderSlug(o.id)}`"
              icon-end="lucide:arrow-right"
              >{{ t("btn.view") }}</LazyVButton
            >
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import type { RequisitionOrder } from "~/types/account";

const { t } = useI18n();

defineProps<{ orders: RequisitionOrder[] }>();

const money = useMoney();
</script>