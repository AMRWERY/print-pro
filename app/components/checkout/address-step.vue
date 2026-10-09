<template>
  <LazyVStepper :n="1" title="Contact & delivery address" :summary="summary">
    <form class="space-y-5" novalidate @submit.prevent="state.next()">
      <fieldset class="grid gap-4 sm:grid-cols-2">
        <legend class="eyebrow mb-3 sm:col-span-2">Contact</legend>
        <LazyVInput
          v-model="f.email"
          name="email"
          label="Email"
          type="email"
          required
          :rules="emailRule"
          hint="Your order confirmation is sent here."
          autocomplete="email"
          inputmode="email"
        />
        <LazyVInput
          v-model="f.phone"
          name="phone"
          label="Phone"
          type="tel"
          required
          :rules="phoneRule"
          hint="Used by the carrier for delivery."
          autocomplete="tel"
          inputmode="tel"
        />
      </fieldset>

      <fieldset class="grid gap-4 sm:grid-cols-2">
        <legend class="eyebrow mb-3 sm:col-span-2">Delivery address</legend>
        <LazyVInput
          v-model="f.fullName"
          name="fullName"
          label="Full name"
          required
          :rules="requiredText('Enter the recipient\'s full name.')"
          autocomplete="name"
        />
        <LazyVInput
          v-model="f.company"
          name="company"
          label="Company or studio"
          optional
          autocomplete="organization"
        />
        <LazyVInput
          v-model="f.line1"
          class="sm:col-span-2"
          name="line1"
          label="Street address"
          required
          :rules="requiredText('Enter the street address for delivery.')"
          autocomplete="address-line1"
        />
        <LazyVInput
          v-model="f.line2"
          class="sm:col-span-2"
          name="line2"
          label="Apartment, suite, loading dock"
          optional
          autocomplete="address-line2"
        />
        <LazyVInput
          v-model="f.city"
          name="city"
          label="City"
          required
          :rules="requiredText('Enter the city.')"
          autocomplete="address-level2"
        />
        <LazyVInput
          v-model="f.region"
          name="region"
          label="State / region"
          required
          :rules="requiredText('Enter the state, province or region.')"
          autocomplete="address-level1"
        />
        <LazyVInput
          v-model="f.postal"
          name="postal"
          label="Postal / ZIP code"
          required
          :rules="minLengthText(3, 'Enter the postal or ZIP code.')"
          autocomplete="postal-code"
        />
        <LazyVSelectInput
          v-model="f.country"
          name="country"
          label="Country"
          required
          :rules="requiredText('Choose the delivery country.')"
          :options="countryOptions"
          autocomplete="country"
        />
      </fieldset>

      <button
        type="submit"
        class="btn-accent h-12 w-full sm:w-auto sm:min-w-56"
      >
        Continue to delivery
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
import { countries } from "~/data/checkout";

const state = useCheckoutState();
const f = state.form;

const countryOptions = countries.map((c) => ({ value: c.code, label: c.name }));

const summary = computed(() => {
  const country =
    countries.find((c) => c.code === f.country)?.name ?? f.country;
  return `${f.fullName} · ${f.line1}, ${f.city}, ${country}`;
});
</script>
