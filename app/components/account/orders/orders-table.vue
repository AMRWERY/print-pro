<template>
  <div
    class="hidden overflow-hidden card md:block"
  >
    <table class="w-full text-start text-sm">
      <caption class="sr-only">
        Your orders
      </caption>
      <thead
        class="border-b border-line bg-raised/50 font-mono text-2xs tracking-wider text-mute"
      >
        <tr>
          <th scope="col" class="px-4 py-3 text-start font-semibold">Order</th>
          <th scope="col" class="px-4 py-3 text-start font-semibold">Items</th>
          <th scope="col" class="px-4 py-3 text-start font-semibold">Placed</th>
          <th scope="col" class="px-4 py-3 text-start font-semibold">Status</th>
          <th scope="col" class="px-4 py-3 text-end font-semibold">Total</th>
          <th scope="col" class="px-4 py-3">
            <span class="sr-only">Actions</span>
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
            <NuxtLinkLocale
              :to="`/account/orders/${orderSlug(o.id)}`"
              class="font-mono text-xs font-bold text-accent hover:underline"
              >{{ o.id }}</NuxtLinkLocale
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
          <td
            class="whitespace-nowrap px-4 py-3 align-middle meta"
          >
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
              >View</LazyVButton
            >
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import type { RequisitionOrder } from "~/types/account";

defineProps<{ orders: RequisitionOrder[] }>();

const money = useMoney();
</script>