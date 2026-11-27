<template>
  <LazyVStepper :n="3" :title="t('checkout_ui.payment')" :summary="summary">
    <form class="space-y-5" novalidate @submit.prevent="state.next()">
      <p class="callout" role="note">
        <Icon
          name="lucide:info"
          size="14"
          class="mt-0.5 shrink-0"
          aria-hidden="true"
        />
        {{ t("checkout_ui.demo_notice") }}
      </p>

      <fieldset class="grid gap-2 sm:grid-cols-3">
        <legend class="sr-only">{{ t("checkout_ui.payment_method") }}</legend>
        <LazyVRadioInput
          v-for="m in paymentMethods"
          :key="m.id"
          v-model="state.form.payment"
          name="payment"
          :value="m.id"
          boxed
          label-class="items-center"
        >
          <span class="flex items-center gap-3">
            <span>
              <span class="label">{{ m.label }}</span>
              <span class="block text-xs text-mute">{{ m.note }}</span>
            </span>
          </span>
        </LazyVRadioInput>
      </fieldset>

      <fieldset
        v-if="state.form.payment === 'card'"
        class="grid gap-4 sm:grid-cols-2"
      >
        <legend class="sr-only">{{ t("checkout_ui.card_details") }}</legend>
        <LazyVInput
          v-model="f.cardName"
          class="sm:col-span-2"
          name="cardName"
          :label="t('inputs.name_on_card')"
          required
          rules="required"
          autocomplete="cc-name"
        />

        <LazyVInput
          v-model="f.cardNumber"
          class="sm:col-span-2"
          name="cardNumber"
          :label="t('inputs.card_number')"
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
          :label="t('inputs.expiry')"
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
          :label="t('inputs.security_code')"
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
        class="space-y-4 rounded-card border border-line bg-raised p-4 text-sm text-mute"
      >
        <p class="font-medium text-paper">{{ method.label }}</p>

        <div
          v-if="f.payment === 'vodafone'"
          class="flex flex-wrap items-center justify-between gap-3 rounded-control border border-line bg-surface p-3"
        >
          <div>
            <p class="eyebrow">{{ t("checkout_ui.send_to_vodafone") }}</p>
            <a
              :href="`tel:${VODAFONE_CASH_NUMBER}`"
              dir="ltr"
              class="mt-1 block font-mono text-xl font-semibold tracking-wide text-paper"
              >{{ VODAFONE_CASH_NUMBER }}</a
            >
          </div>
          <LazyVButton
            type="button"
            variant="secondary"
            :icon="copied ? 'lucide:check' : 'lucide:copy'"
            @click="copy(VODAFONE_CASH_NUMBER)"
          >
            <span aria-live="polite">{{
              copied ? t("btn.copied") : t("btn.copy_number")
            }}</span>
          </LazyVButton>
        </div>

        <div
          v-else-if="f.payment === 'instapay'"
          class="flex flex-col items-center gap-4 rounded-control border border-line bg-surface p-4 sm:flex-row sm:items-start"
        >
          <img
            v-if="instapayQr"
            :src="instapayQr"
            width="176"
            height="176"
            :alt="t('checkout_ui.instapay_qr_alt')"
            class="h-44 w-44 shrink-0 rounded-control bg-white p-2"
          />
          <div
            v-else
            class="h-44 w-44 shrink-0 animate-pulse rounded-control bg-line"
            aria-hidden="true"
          />
          <div class="space-y-2">
            <p class="eyebrow">{{ t("checkout_ui.scan_with_instapay") }}</p>
            <ol class="list-decimal space-y-1 ps-4">
              <li>{{ t("checkout_ui.instapay_step_1") }}</li>
              <li>{{ t("checkout_ui.instapay_step_2") }}</li>
              <li>{{ t("checkout_ui.instapay_step_3") }}</li>
            </ol>
            <p class="text-xs">
              <i18n-t keypath="checkout_ui.or_send_to" tag="span">
                <template #address>
                  <span dir="ltr" class="font-mono text-paper">{{
                    INSTAPAY_ADDRESS
                  }}</span>
                </template>
              </i18n-t>
            </p>
          </div>
        </div>

        <p>
          {{ t("checkout_ui.transfer_notice") }}
        </p>
      </div>

      <LazyVButton
        variant="primary"
        size="lg"
        block
        type="submit"
        class="sm:w-auto sm:min-w-56"
      >
        {{ t("btn.review_order") }}
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
import { useQRCode } from "@vueuse/integrations/useQRCode";
import { paymentMethods } from "~/data/checkout";

const { t } = useI18n();

const instapayQr = useQRCode(INSTAPAY_QR_PAYLOAD, {
  width: 352,
  margin: 0,
  errorCorrectionLevel: "M",
});

const { copy, copied } = useClipboard({ copiedDuring: 2000 });

const state = useCheckoutState();
const f = state.form;

const method = computed(
  () => paymentMethods.find((m) => m.id === f.payment) ?? paymentMethods[0]!,
);

const summary = computed(() =>
  f.payment === "card"
    ? t("checkout_ui.card_ending", {
        digits: f.cardNumber.replace(/\D/g, "").slice(-4) || "••••",
      })
    : method.value.label,
);
</script>