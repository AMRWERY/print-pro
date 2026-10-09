<template>
  <header v-reveal class="card relative overflow-hidden p-6 sm:p-8">
    <div
      class="pointer-events-none absolute inset-0 [background:radial-gradient(50%_90%_at_95%_10%,rgb(var(--c-accent)/0.12),transparent_70%)]"
    />
    <div
      class="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-center"
    >
      <div class="flex flex-col gap-5 sm:flex-row sm:items-start">
        <span
          class="grid h-20 w-20 shrink-0 place-items-center rounded-card border border-success/50 bg-success-soft text-success"
          aria-hidden="true"
        >
          <Icon name="lucide:check" size="40" class="animate-icon-pop" />
        </span>
        <div class="space-y-3">
          <p class="eyebrow flex items-center gap-2 text-success">
            <span
              class="h-2 w-2 rounded-full bg-success"
              aria-hidden="true"
            />Order confirmed
          </p>
          <h1
            ref="heading"
            tabindex="-1"
            class="text-3xl uppercase focus:outline-none sm:text-5xl"
          >
            Order confirmed &amp; sealed
          </h1>
          <p class="max-w-2xl text-sm text-mute sm:text-base">
            Order <span class="font-mono text-paper">#{{ order.id }}</span> has
            been placed and queued for bench inspection. A confirmation is on
            its way to <span class="text-paper">{{ order.email }}</span
            >.
          </p>
        </div>
      </div>

      <dl
        class="grid gap-px overflow-hidden rounded-card border border-line bg-line text-sm"
      >
        <div class="bg-surface p-3">
          <dt class="eyebrow">Payment</dt>
          <dd class="mt-0.5 flex items-center gap-1.5">
            <Icon
              :name="paid ? 'lucide:circle-check' : 'lucide:clock'"
              size="14"
              :class="paid ? 'text-success' : 'text-yellow'"
              aria-hidden="true"
            />
            {{
              paid
                ? `Paid · card ending ${order.payment.last4}`
                : "Awaiting wire transfer"
            }}
          </dd>
        </div>
        <div class="bg-surface p-3">
          <dt class="eyebrow">
            {{
              order.delivery.id === "pickup"
                ? "Ready for pickup"
                : "Est. handover"
            }}
          </dt>
          <dd class="mt-0.5 font-mono text-accent">
            {{ formatWhen(handover) }}
          </dd>
        </div>
        <div class="bg-surface p-3">
          <dt class="eyebrow">Tracking PIN</dt>
          <dd class="mt-0.5 font-mono">{{ order.pin }}</dd>
        </div>
      </dl>
    </div>

    <div class="relative mt-6 flex flex-wrap items-center gap-3">
      <LazyVButton
        variant="primary"
        :to="{ path: '/track', query: { order: order.id } }"
        icon="lucide:map-pin"
        icon-class="icon-bob"
        >Track order</LazyVButton
      >
      <LazyVButton variant="secondary" icon="lucide:file-down" @click="print"
        >Download invoice (PDF)</LazyVButton
      >
      <LazyVButton variant="secondary" to="/products" icon="lucide:layout-grid"
        >Continue exploring catalog</LazyVButton
      >
      <LazyVButton
        variant="tertiary"
        :href="orderSupport.phoneHref"
        icon="lucide:phone"
        icon-class="icon-wiggle"
        >Concierge {{ orderSupport.phone }}</LazyVButton
      >
    </div>
  </header>
</template>

<script lang="ts" setup>
import { estimatedHandover, formatWhen, orderSupport } from "~/data/order";
import type { Order } from "~/types/order";

const props = defineProps<{ order: Order }>();

const heading = ref<HTMLElement>();
const paid = computed(() => props.order.payment.id === "card");
const handover = computed(() => estimatedHandover(props.order));
const print = () => window.print();

// Move focus to the confirmation so screen readers announce it.
onMounted(() => heading.value?.focus());
</script>