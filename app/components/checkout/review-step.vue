<template>
  <LazyVStepper :n="4" title="Review & place order">
    <form class="space-y-5" novalidate @submit.prevent="emit('place')">
      <dl
        class="grid gap-px overflow-hidden rounded-card border border-line bg-line text-sm sm:grid-cols-3"
      >
        <div class="space-y-1 bg-surface p-4">
          <dt class="eyebrow flex items-center justify-between">
            Ship to
            <LazyVButton variant="tertiary"
              class="normal-case tracking-normal"
              @click="state.edit(1)"
            >
              Edit
            </LazyVButton>
          </dt>
          <dd>
            {{ f.fullName }}<span v-if="f.company"><br />{{ f.company }}</span
            ><br />
            {{ f.line1 }}<span v-if="f.line2">, {{ f.line2 }}</span
            ><br />
            {{ f.city }}, {{ f.region }} {{ f.postal }}<br />{{ countryName }}
          </dd>
        </div>
        <div class="space-y-1 bg-surface p-4">
          <dt class="eyebrow flex items-center justify-between">
            Delivery
            <LazyVButton variant="tertiary"
              class="normal-case tracking-normal"
              @click="state.edit(2)"
            >
              Edit
            </LazyVButton>
          </dt>
          <dd>
            {{ delivery.label }}<br /><span class="text-mute">{{
              money.format(shipping) === "$0.00"
                ? "Free"
                : money.format(shipping)
            }}</span>
          </dd>
        </div>
        <div class="space-y-1 bg-surface p-4">
          <dt class="eyebrow flex items-center justify-between">
            Payment
            <LazyVButton variant="tertiary"
              class="normal-case tracking-normal"
              @click="state.edit(3)"
            >
              Edit
            </LazyVButton>
          </dt>
          <dd>
            {{
              f.payment === "card"
                ? `Card ending ${f.cardNumber.replace(/\D/g, "").slice(-4)}`
                : "Wire transfer / escrow"
            }}
          </dd>
        </div>
      </dl>

      <LazyVCheckboxImput
        v-model="f.terms"
        name="terms"
        :rules="mustAccept('Accept the terms to place your order.')"
      >
        I agree to the
        <nuxt-link-locale
          to="/"
          class="text-accent underline-offset-4 hover:underline"
          >terms of sale</nuxt-link-locale
        >
        and understand large-format equipment ships by appointment.
      </LazyVCheckboxImput>

      <LazyVButton variant="primary" size="xl" block
        type="submit"
       
        :disabled="placing"
      >
        <Icon
          v-if="placing"
          name="lucide:loader-circle"
          size="18"
          class="animate-spin"
          aria-hidden="true"
        />
        <Icon v-else name="lucide:lock" size="18" aria-hidden="true" />
        {{
          placing
            ? "Placing your order…"
            : `Place order · ${money.format(total)}`
        }}
      </LazyVButton>
      <p class="text-center text-xs text-mute">
        You won't be charged again after this step. A confirmation is sent to
        {{ f.email }}.
      </p>
    </form>
  </LazyVStepper>
</template>

<script lang="ts" setup>
import { countries, deliveryOptions } from "~/data/checkout";

const props = defineProps<{
  shipping: number;
  total: number;
  placing: boolean;
}>();

const emit = defineEmits<{ place: [] }>();

const state = useCheckoutState();
const money = useMoney();
const f = state.form;

const countryName = computed(
  () => countries.find((c) => c.code === f.country)?.name ?? f.country,
);
const delivery = computed(
  () => deliveryOptions.find((o) => o.id === f.delivery)!,
);
void props;
</script>