<template>
  <LazyVStepper :n="3" title="Payment" :summary="summary">
    <form class="space-y-5" novalidate @submit.prevent="state.next()">
      <p
        class="flex items-start gap-2 rounded-card border border-line bg-raised p-3 text-xs text-mute"
        role="note"
      >
        <Icon
          name="lucide:info"
          size="14"
          class="mt-0.5 shrink-0"
          aria-hidden="true"
        />
        Demo checkout: no payment is processed and card details are never stored
        or sent anywhere.
      </p>

      <fieldset class="grid gap-2 sm:grid-cols-2">
        <legend class="sr-only">Payment method</legend>
        <label
          v-for="m in paymentMethods"
          :key="m.id"
          class="flex cursor-pointer items-center gap-3 rounded-card border p-4 transition duration-200"
          :class="
            state.form.payment === m.id
              ? 'border-accent bg-accent-soft'
              : 'border-line hover:border-mute'
          "
        >
          <input
            v-model="state.form.payment"
            type="radio"
            name="payment"
            :value="m.id"
            class="check !rounded-full"
          />
          <Icon
            :name="m.icon"
            size="20"
            class="text-accent"
            aria-hidden="true"
          />
          <span>
            <span class="block text-sm font-medium">{{ m.label }}</span>
            <span class="block text-xs text-mute">{{ m.note }}</span>
          </span>
        </label>
      </fieldset>

      <fieldset
        v-if="state.form.payment === 'card'"
        class="grid gap-4 sm:grid-cols-2"
      >
        <legend class="sr-only">Card details</legend>
        <LazyVInput
          class="sm:col-span-2"
          label="Name on card"
          :error="state.errors.cardName"
          v-slot="{ id, aria }"
        >
          <input
            :id="id"
            v-bind="aria"
            v-model="f.cardName"
            type="text"
            autocomplete="cc-name"
            class="field"
            :class="state.errors.cardName && '!border-accent'"
            @blur="state.validate('cardName')"
          />
        </LazyVInput>
        <LazyVInput
          class="sm:col-span-2"
          label="Card number"
          :error="state.errors.cardNumber"
          v-slot="{ id, aria }"
        >
          <input
            :id="id"
            v-bind="aria"
            :value="f.cardNumber"
            type="text"
            inputmode="numeric"
            autocomplete="cc-number"
            placeholder="1234 5678 9012 3456"
            class="field font-mono"
            :class="state.errors.cardNumber && '!border-accent'"
            @input="
              f.cardNumber = formatCardNumber(
                ($event.target as HTMLInputElement).value,
              )
            "
            @blur="state.validate('cardNumber')"
          />
        </LazyVInput>
        <LazyVInput
          label="Expiry"
          :error="state.errors.cardExpiry"
          v-slot="{ id, aria }"
        >
          <input
            :id="id"
            v-bind="aria"
            :value="f.cardExpiry"
            type="text"
            inputmode="numeric"
            autocomplete="cc-exp"
            placeholder="MM/YY"
            maxlength="5"
            class="field font-mono"
            :class="state.errors.cardExpiry && '!border-accent'"
            @input="
              f.cardExpiry = formatExpiry(
                ($event.target as HTMLInputElement).value,
              )
            "
            @blur="state.validate('cardExpiry')"
          />
        </LazyVInput>
        <LazyVInput
          label="Security code"
          :error="state.errors.cardCvc"
          v-slot="{ id, aria }"
        >
          <input
            :id="id"
            v-bind="aria"
            v-model="f.cardCvc"
            type="password"
            inputmode="numeric"
            autocomplete="cc-csc"
            maxlength="4"
            placeholder="•••"
            class="field font-mono"
            :class="state.errors.cardCvc && '!border-accent'"
            @blur="state.validate('cardCvc')"
          />
        </LazyVInput>
      </fieldset>

      <div
        v-else
        class="space-y-2 rounded-card border border-line bg-raised p-4 text-sm text-mute"
      >
        <p class="font-medium text-paper">Wire transfer or escrow</p>
        <p>
          Place the order to receive wire instructions by email. Your 2% saving
          is applied to the order total, and equipment is reserved for 5
          business days while we wait for funds.
        </p>
      </div>

      <button
        type="submit"
        class="btn-accent h-12 w-full sm:w-auto sm:min-w-56"
      >
        Review order
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
import { paymentMethods } from "~/data/checkout";

const state = useCheckoutState();
const f = state.form;

const summary = computed(() =>
  f.payment === "card"
    ? `Card ending ${f.cardNumber.replace(/\D/g, "").slice(-4) || "••••"}`
    : "Wire transfer / escrow",
);
</script>