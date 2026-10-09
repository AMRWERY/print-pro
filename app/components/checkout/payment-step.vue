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
        <LazyVInput
          v-for="m in paymentMethods"
          :key="m.id"
          v-model="state.form.payment"
          type="radio"
          name="payment"
          :value="m.id"
          :label-class="[
            'items-center rounded-card border p-4 transition duration-200',
            state.form.payment === m.id
              ? 'border-accent bg-accent-soft'
              : 'border-line hover:border-mute',
          ]"
        >
          <span class="flex items-center gap-3">
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
          </span>
        </LazyVInput>
      </fieldset>

      <fieldset
        v-if="state.form.payment === 'card'"
        class="grid gap-4 sm:grid-cols-2"
      >
        <legend class="sr-only">Card details</legend>
        <LazyVInput
          v-model="f.cardName"
          class="sm:col-span-2"
          name="cardName"
          label="Name on card"
          required
          :rules="requiredText('Enter the name exactly as printed on the card.')"
          autocomplete="cc-name"
        />
        <LazyVInput
          v-model="f.cardNumber"
          class="sm:col-span-2"
          name="cardNumber"
          label="Card number"
          required
          :rules="cardNumberRule"
          :format="formatCardNumber"
          inputmode="numeric"
          autocomplete="cc-number"
          placeholder="1234 5678 9012 3456"
          input-class="font-mono"
        />
        <LazyVInput
          v-model="f.cardExpiry"
          name="cardExpiry"
          label="Expiry"
          required
          :rules="cardExpiryRule"
          :format="formatExpiry"
          inputmode="numeric"
          autocomplete="cc-exp"
          placeholder="MM/YY"
          maxlength="5"
          input-class="font-mono"
        />
        <LazyVInput
          v-model="f.cardCvc"
          name="cardCvc"
          type="password"
          label="Security code"
          required
          :rules="cardCvcRule"
          inputmode="numeric"
          autocomplete="cc-csc"
          maxlength="4"
          placeholder="•••"
          input-class="font-mono"
        />
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

      <LazyVButton variant="primary" size="lg" block
        type="submit"
        class="sm:w-auto sm:min-w-56"
      >
        Review order
        <Icon
          name="lucide:arrow-right"
          size="16"
          class="icon-nudge rtl:-scale-x-100"
          aria-hidden="true"
        />
      </LazyVButton>
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
