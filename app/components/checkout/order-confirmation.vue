<template>
  <div class="mx-auto max-w-2xl space-y-6 text-center">
    <span
      class="mx-auto grid h-16 w-16 place-items-center rounded-full border border-success bg-success-soft text-success"
      aria-hidden="true"
    >
      <Icon name="lucide:check" size="30" class="animate-icon-pop" />
    </span>
    <div class="space-y-2">
      <p class="eyebrow text-success">Order placed</p>
      <h1 ref="heading" tabindex="-1" class="text-3xl sm:text-4xl">
        Thank you, {{ order.name }}.
      </h1>
      <p class="text-mute">
        Your order <span class="font-mono text-paper">{{ order.id }}</span> is
        confirmed. We've sent the details to
        <span class="text-paper">{{ order.email }}</span
        >.
      </p>
    </div>

    <dl
      class="grid gap-px overflow-hidden rounded-card border border-line bg-line text-start text-sm sm:grid-cols-3"
    >
      <div class="bg-surface p-4">
        <dt class="eyebrow">Total</dt>
        <dd class="mt-1 font-display text-xl">
          {{ money.format(order.total) }}
        </dd>
      </div>
      <div class="bg-surface p-4">
        <dt class="eyebrow">Delivery</dt>
        <dd class="mt-1">{{ order.delivery }}</dd>
      </div>
      <div class="bg-surface p-4">
        <dt class="eyebrow">Payment</dt>
        <dd class="mt-1">{{ order.payment }}</dd>
      </div>
    </dl>

    <ul
      class="divide-y divide-line overflow-hidden rounded-card border border-line text-start"
      aria-label="Items in this order"
    >
      <li
        v-for="i in order.items"
        :key="i.key"
        class="flex items-center justify-between gap-4 bg-surface p-3 text-sm"
      >
        <span class="min-w-0 truncate">{{ i.qty }} × {{ i.name }}</span>
        <span class="shrink-0 font-mono">{{
          money.format(i.qty * i.price)
        }}</span>
      </li>
    </ul>

    <div class="flex flex-wrap justify-center gap-3">
      <nuxt-link-locale to="/products" class="btn-accent"
        >Continue shopping</nuxt-link-locale
      >
      <button type="button" class="btn-ghost" @click="print">
        <Icon name="lucide:printer" size="16" aria-hidden="true" />Print receipt
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PlacedOrder } from "~/types/checkout";

defineProps<{ order: PlacedOrder }>();

const money = useMoney();
const heading = ref<HTMLElement>();
const print = () => window.print();

// Move focus to the confirmation so screen readers announce it.
onMounted(() => heading.value?.focus());
</script>