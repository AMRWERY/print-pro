<template>
  <LazyVStepper :n="1" title="Contact & delivery address" :summary="summary">

    <form class="space-y-5" novalidate @submit.prevent="state.next()">
      <fieldset class="grid gap-4 sm:grid-cols-2">
        <legend class="eyebrow mb-3 sm:col-span-2">Contact</legend>
        <LazyVInput
          label="Email"
          :error="state.errors.email"
          hint="Your order confirmation is sent here."
          v-slot="{ id, aria }"
        >
          <input
            :id="id"
            v-bind="aria"
            v-model="f.email"
            type="email"
            autocomplete="email"
            inputmode="email"
            class="field"
            :class="state.errors.email && '!border-accent'"
            @blur="state.validate('email')"
          />
        </LazyVInput>
        <LazyVInput
          label="Phone"
          :error="state.errors.phone"
          hint="Used by the carrier for delivery."
          v-slot="{ id, aria }"
        >
          <input
            :id="id"
            v-bind="aria"
            v-model="f.phone"
            type="tel"
            autocomplete="tel"
            inputmode="tel"
            class="field"
            :class="state.errors.phone && '!border-accent'"
            @blur="state.validate('phone')"
          />
        </LazyVInput>
      </fieldset>

      <fieldset class="grid gap-4 sm:grid-cols-2">
        <legend class="eyebrow mb-3 sm:col-span-2">Delivery address</legend>
        <LazyVInput
          label="Full name"
          :error="state.errors.fullName"
          v-slot="{ id, aria }"
        >
          <input
            :id="id"
            v-bind="aria"
            v-model="f.fullName"
            type="text"
            autocomplete="name"
            class="field"
            :class="state.errors.fullName && '!border-accent'"
            @blur="state.validate('fullName')"
          />
        </LazyVInput>
        <LazyVInput label="Company or studio" :required="false" v-slot="{ id }">
          <input
            :id="id"
            v-model="f.company"
            type="text"
            autocomplete="organization"
            class="field"
          />
        </LazyVInput>
        <LazyVInput
          class="sm:col-span-2"
          label="Street address"
          :error="state.errors.line1"
          v-slot="{ id, aria }"
        >
          <input
            :id="id"
            v-bind="aria"
            v-model="f.line1"
            type="text"
            autocomplete="address-line1"
            class="field"
            :class="state.errors.line1 && '!border-accent'"
            @blur="state.validate('line1')"
          />
        </LazyVInput>
        <LazyVInput
          class="sm:col-span-2"
          label="Apartment, suite, loading dock"
          :required="false"
          v-slot="{ id }"
        >
          <input
            :id="id"
            v-model="f.line2"
            type="text"
            autocomplete="address-line2"
            class="field"
          />
        </LazyVInput>
        <LazyVInput label="City" :error="state.errors.city" v-slot="{ id, aria }">
          <input
            :id="id"
            v-bind="aria"
            v-model="f.city"
            type="text"
            autocomplete="address-level2"
            class="field"
            :class="state.errors.city && '!border-accent'"
            @blur="state.validate('city')"
          />
        </LazyVInput>
        <LazyVInput
          label="State / region"
          :error="state.errors.region"
          v-slot="{ id, aria }"
        >
          <input
            :id="id"
            v-bind="aria"
            v-model="f.region"
            type="text"
            autocomplete="address-level1"
            class="field"
            :class="state.errors.region && '!border-accent'"
            @blur="state.validate('region')"
          />
        </LazyVInput>
        <LazyVInput
          label="Postal / ZIP code"
          :error="state.errors.postal"
          v-slot="{ id, aria }"
        >
          <input
            :id="id"
            v-bind="aria"
            v-model="f.postal"
            type="text"
            autocomplete="postal-code"
            class="field"
            :class="state.errors.postal && '!border-accent'"
            @blur="state.validate('postal')"
          />
        </LazyVInput>
        <LazyVInput
          label="Country"
          :error="state.errors.country"
          v-slot="{ id, aria }"
        >
          <select
            :id="id"
            v-bind="aria"
            v-model="f.country"
            autocomplete="country"
            class="field"
            @blur="state.validate('country')"
          >
            <option v-for="c in countries" :key="c.code" :value="c.code">
              {{ c.name }}
            </option>
          </select>
        </LazyVInput>
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

const summary = computed(() => {
  const country =
    countries.find((c) => c.code === f.country)?.name ?? f.country;
  return `${f.fullName} · ${f.line1}, ${f.city}, ${country}`;
});
</script>