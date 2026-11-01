<template>
  <LazyVStepper :n="1" title="Contact & delivery address" :summary="summary">
    <form class="space-y-5" novalidate @submit.prevent="state.next()">
      <fieldset class="grid gap-4 sm:grid-cols-2">
        <legend class="eyebrow mb-3 sm:col-span-2">Contact</legend>
        <LazyVInput
          v-model="f.email"
          name="email"
          :label="t('inputs.email')"
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
          :label="t('inputs.phone')"
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
          :label="t('inputs.full_name')"
          required
          rules="required"
          autocomplete="name"
        />

        <LazyVInput
          v-model="f.company"
          name="company"
          :label="t('inputs.company')"
          optional
          autocomplete="organization"
        />

        <LazyVInput
          v-model="f.line1"
          class="sm:col-span-2"
          name="line1"
          :label="t('inputs.street_address')"
          required
          rules="required"
          autocomplete="address-line1"
        />

        <LazyVInput
          v-model="f.line2"
          class="sm:col-span-2"
          name="line2"
          :label="t('inputs.apartment_suite_loading_dock')"
          optional
          autocomplete="address-line2"
        />

        <LazyVInput
          v-model="f.city"
          name="city"
          :label="t('inputs.city')"
          required
          rules="required"
          autocomplete="address-level2"
        />

        <LazyVInput
          v-model="f.region"
          name="region"
          :label="t('inputs.state_region')"
          required
          rules="required"
          autocomplete="address-level1"
        />

        <LazyVInput
          v-model="f.postal"
          name="postal"
          :label="t('inputs.postal_zip_code')"
          required
          :rules="minLengthText(3, 'Enter the postal or ZIP code.')"
          autocomplete="postal-code"
        />

        <LazyVSelectInput
          v-model="f.country"
          name="country"
          :label="t('inputs.country')"
          required
          rules="required"
          :options="countryOptions"
          autocomplete="country"
        />
      </fieldset>

      <LazyVButton
        variant="primary"
        size="lg"
        block
        type="submit"
        class="sm:w-auto sm:min-w-56"
      >
        {{ t("btn.continue_to_delivery") }}
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
import { countries } from "~/data/checkout";

const { t } = useI18n();

const state = useCheckoutState();

const f = state.form;

const countryOptions = countries.map((c) => ({ value: c.code, label: c.name }));

const summary = computed(() => {
  const country =
    countries.find((c) => c.code === f.country)?.name ?? f.country;
  return `${f.fullName} · ${f.line1}, ${f.city}, ${country}`;
});
</script>