<template>
  <LazyVStepper :n="2" title="Delivery method" :summary="summary">
    <form class="space-y-5" novalidate @submit.prevent="state.next()">
      <fieldset class="space-y-2">
        <legend class="sr-only">Choose a delivery method</legend>
        <label
          v-for="o in deliveryOptions"
          :key="o.id"
          class="flex cursor-pointer items-start gap-3 rounded-card border p-4 transition duration-200"
          :class="
            state.form.delivery === o.id
              ? 'border-accent bg-accent-soft'
              : 'border-line hover:border-mute'
          "
        >
          <input
            v-model="state.form.delivery"
            type="radio"
            name="delivery"
            :value="o.id"
            class="check mt-1 !rounded-full"
          />
          <Icon
            :name="o.icon"
            size="20"
            class="mt-0.5 shrink-0 text-accent"
            aria-hidden="true"
          />
          <span class="min-w-0 flex-1">
            <span class="block text-sm font-medium">{{ o.label }}</span>
            <span class="block text-xs text-mute">{{ o.note }}</span>
            <span class="mt-1 block font-mono text-xs text-mute">{{
              eta(o.days)
            }}</span>
          </span>
          <span
            class="shrink-0 font-mono text-sm"
            :class="prices[o.id] === 0 && 'text-success'"
            >{{
              prices[o.id] === 0 ? "Free" : money.format(prices[o.id])
            }}</span
          >
        </label>
      </fieldset>

      <LazyVInput
        label="Delivery notes"
        :required="false"
        hint="Dock hours, access codes or handling instructions."
        v-slot="{ id }"
      >
        <textarea
          :id="id"
          v-model="state.form.notes"
          rows="2"
          maxlength="300"
          class="field resize-y"
        />
      </LazyVInput>

      <button
        type="submit"
        class="btn-accent h-12 w-full sm:w-auto sm:min-w-56"
      >
        Continue to payment
        <Icon
          name="lucide:arrow-right"
          size="16"
          class="icon-nudge rtl:-scale-x-100"
          aria-hidden="true"
        />
      </button>
    </form>
  </LazyVStepper>
</template>

<script lang="ts" setup>
import { deliveryOptions } from "~/data/checkout";

const props = defineProps<{
  prices: Record<"crated" | "express" | "pickup", number>;
}>();

const state = useCheckoutState();
const money = useMoney();

const eta = (days: number) => {
  const d = new Date();
  let left = days;
  while (left > 0) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0 && d.getDay() !== 6) left--; // working days only
  }
  return `Estimated ${d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}`;
};

const summary = computed(() => {
  const o = deliveryOptions.find((x) => x.id === state.form.delivery)!;
  const p = props.prices[o.id];
  return `${o.label} · ${p === 0 ? "Free" : money.format(p)}`;
});
</script>