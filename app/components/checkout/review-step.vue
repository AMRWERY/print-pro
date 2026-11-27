<template>
  <LazyVStepper :n="4" :title="t('checkout_ui.review_title')">
    <form class="space-y-5" novalidate @submit.prevent="emit('place')">
      <dl
        class="grid gap-px overflow-hidden rounded-card border border-line bg-line text-sm sm:grid-cols-3"
      >
        <div class="space-y-1 bg-surface p-4">
          <dt class="eyebrow flex items-center justify-between">
            {{ t("checkout_ui.ship_to") }}
            <LazyVButton
              variant="tertiary"
              class="normal-case tracking-normal"
              @click="state.edit(1)"
            >
              {{ t("btn.edit") }}
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
            {{ t("checkout_ui.delivery") }}
            <LazyVButton
              variant="tertiary"
              class="normal-case tracking-normal"
              @click="state.edit(2)"
            >
              {{ t("btn.edit") }}
            </LazyVButton>
          </dt>
          <dd>
            {{ delivery.label }}<br /><span class="text-mute">{{
              shipping === 0 ? t("checkout_ui.free") : money.format(shipping)
            }}</span>
          </dd>
        </div>
        <div class="space-y-1 bg-surface p-4">
          <dt class="eyebrow flex items-center justify-between">
            {{ t("checkout_ui.payment") }}
            <LazyVButton
              variant="tertiary"
              class="normal-case tracking-normal"
              @click="state.edit(3)"
            >
              {{ t("btn.edit") }}
            </LazyVButton>
          </dt>
          <dd>
            {{
              f.payment === "card"
                ? t("checkout_ui.card_ending", {
                    digits: f.cardNumber.replace(/\D/g, "").slice(-4),
                  })
                : paymentMethods.find((m) => m.id === f.payment)?.label
            }}
          </dd>
        </div>
      </dl>

      <LazyVCheckboxInput
        v-model="f.terms"
        name="terms"
        :rules="mustAccept(t('checkout_ui.terms_error'))"
      >
        <i18n-t keypath="checkout_ui.terms_agreement" tag="span">
          <template #terms>
            <nuxt-link-locale
              to="/"
              class="text-accent underline-offset-4 hover:underline"
              >{{ t("btn.terms_of_sale") }}</nuxt-link-locale
            >
          </template>
        </i18n-t>
      </LazyVCheckboxInput>

      <LazyVButton
        variant="primary"
        size="xl"
        block
        type="submit"
        :loading="placing"
      >
        <Icon v-if="!placing" name="lucide:lock" size="18" aria-hidden="true" />
        {{
          placing
            ? t("btn.placing_your_order")
            : `${t("btn.place_order")} · ${money.format(total)}`
        }}
      </LazyVButton>
      <p class="text-center text-xs text-mute">
        {{ t("checkout_ui.no_extra_charge", { email: f.email }) }}
      </p>
    </form>
  </LazyVStepper>
</template>

<script lang="ts" setup>
import { countries, deliveryOptions, paymentMethods } from "~/data/checkout";

const { t } = useI18n();

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