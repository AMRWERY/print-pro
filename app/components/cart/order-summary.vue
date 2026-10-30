<template>
  <aside class="card space-y-4 p-5" aria-labelledby="summary-title">
    <div class="flex items-center justify-between gap-2">
      <h2 id="summary-title" class="font-display text-2xl">Order summary</h2>
      <span
        class="inline-flex items-center gap-1 rounded-control border border-line px-2 py-0.5 meta"
        ><Icon
          name="lucide:badge-check"
          size="12"
          class="text-success"
          aria-hidden="true"
        />Business account verified</span
      >
    </div>

    <dl class="space-y-2 text-sm">
      <div class="flex justify-between gap-4">
        <dt class="text-mute">
          Cart subtotal ({{ selectedCount }}
          {{ selectedCount === 1 ? "item" : "items" }}, {{ totals.units }}
          {{ totals.units === 1 ? "unit" : "units" }})
        </dt>
        <dd class="font-mono">{{ money.format(totals.subtotal) }}</dd>
      </div>
      <div
        v-if="totals.volumeDiscount"
        class="flex justify-between gap-4 text-accent"
      >
        <dt>Volume discount (ink & toner)</dt>
        <dd class="font-mono">−{{ money.format(totals.volumeDiscount) }}</dd>
      </div>
      <div
        v-if="totals.voucherDiscount"
        class="flex justify-between gap-4 text-accent"
      >
        <dt>{{ totals.voucher?.label }}</dt>
        <dd class="font-mono">−{{ money.format(totals.voucherDiscount) }}</dd>
      </div>
      <div class="flex justify-between gap-4">
        <dt class="text-mute">Delivery (insured)</dt>
        <dd
          class="font-mono"
          :class="!totals.freight && totals.units && 'text-success'"
        >
          {{
            totals.units
              ? totals.freight
                ? money.format(totals.freight)
                : "FREE"
              : "—"
          }}
        </dd>
      </div>
      <div class="flex justify-between gap-4">
        <dt class="text-mute">
          Estimated sales tax ({{ (pricing.taxRate * 100).toFixed(1) }}%)
        </dt>
        <dd class="font-mono">{{ money.format(totals.tax) }}</dd>
      </div>
    </dl>

    <div class="rounded-card border border-line bg-raised p-4">
      <p class="flex items-end justify-between gap-3">
        <span class="eyebrow !text-paper">Total payable</span>
        <span class="font-display text-3xl font-semibold" aria-live="polite"
          >{{ money.format(totals.payable) }}
          <span class="meta">EGP</span></span
        >
      </p>
      <p
        v-if="totals.leaseMonthly"
        class="mt-2 flex justify-between gap-3 meta"
      >
        <span>Commercial lease equivalent</span
        ><span>{{ money.format(totals.leaseMonthly) }} / mo</span>
      </p>
    </div>

    <!-- Voucher -->
    <div class="space-y-2">
      <p class="eyebrow">Voucher or offer code</p>
      <form
        v-if="!applied"
        class="flex items-start gap-2"
        novalidate
        @submit.prevent="apply"
      >
        <LazyVInput
          v-model="draft"
          class="flex-1"
          name="voucher"
          label="Voucher code"
          hide-label
          autocomplete="off"
          autocapitalize="characters"
          placeholder="OFFICE-2026"
          input-class="font-mono"
        />
        <LazyVButton
          variant="secondary"
          type="submit"
          class="shrink-0"
          :loading="applying"
          :disabled="!draft.trim()"
          >{{ t("btn.apply") }}</LazyVButton
        >
      </form>

      <p v-if="voucherError && !applied" class="callout-accent" role="alert">
        <Icon
          name="lucide:circle-alert"
          size="16"
          class="bullet-icon"
          aria-hidden="true"
        />{{ t("orders.voucher_not_valid", "That code doesn't apply to this cart. Check it for typos or try another.") }}
      </p>

      <div
        v-if="applied"
        class="flex items-center justify-between gap-3 rounded-control border border-accent/40 bg-accent-soft px-3 py-2 text-sm"
      >
        <span class="flex items-center gap-2 font-mono text-xs"
          ><Icon name="lucide:ticket-check" size="14" aria-hidden="true" />{{
            code
          }}
          {{
            totals.voucherBelowMin
              ? `· needs ${money.format(totals.voucher?.minSubtotal ?? 0)}+`
              : "· applied"
          }}</span
        >
        <LazyVButton
          variant="tertiary"
          class="text-xs"
          @click="emit('voucher', '')"
        >
          {{ t("btn.remove") }}
        </LazyVButton>
      </div>
    </div>

    <div class="space-y-2">
      <LazyVButton
        variant="primary"
        size="lg"
        block
        :disabled="!totals.units"
        @click="emit('checkout')"
      >
        <Icon name="lucide:lock" size="16" aria-hidden="true" />{{
          t("btn.secure_checkout")
        }}
        <Icon
          name="lucide:arrow-right"
          size="16"
          class="icon-nudge rtl:-scale-x-100"
          aria-hidden="true"
        />
      </LazyVButton>

      <LazyVButton
        variant="secondary"
        block
        class="text-xs"
        :disabled="!totals.units"
      >
        <Icon name="lucide:smartphone" size="14" aria-hidden="true" />Pay with
        {{ t("btn.vodafone_cash_instapay") }}
      </LazyVButton>

      <p
        v-if="notice"
        class="rounded-control border border-line bg-raised p-2 text-xs text-mute"
        role="status"
      >
        {{ notice }}
      </p>

      <LazyVButton
        variant="tertiary"
        to="/products"
        class="flex items-center justify-center gap-1.5 text-sm"
        ><Icon
          name="lucide:arrow-left"
          size="14"
          class="rtl:-scale-x-100"
          aria-hidden="true"
        />{{ t("btn.continue_exploring_equipment_catalog") }}</LazyVButton
      >
    </div>

    <ul class="space-y-2 border-t border-line pt-4 text-xs text-mute">
      <li
        v-for="a in cartAssurances"
        :key="a.label"
        class="flex items-start gap-2"
      >
        <Icon
          :name="a.icon"
          size="14"
          class="bullet-icon"
          aria-hidden="true"
        />{{ a.label }}
      </li>
    </ul>
  </aside>
</template>

<script lang="ts" setup>
import { cartAssurances, pricing } from "~/data/cart";
import type { useCartTotals } from "~/composables/useCartTotals";

const { t } = useI18n();

const props = defineProps<{
  totals: ReturnType<typeof useCartTotals>;
  selectedCount: number;
  code: string;
  notice?: string;
}>();

const emit = defineEmits<{ voucher: [code: string]; checkout: [] }>();

const money = useMoney();
const draft = ref("");

// Only codes the server accepted are ever stored on the cart.
const applied = computed(() => !!props.code);

const applying = ref(false);
const voucherError = ref(false);

watch(draft, () => (voucherError.value = false));

const apply = async () => {
  const c = draft.value.trim().toUpperCase();
  if (!c) return;
  applying.value = true;
  voucherError.value = false;
  const accepted = await props.totals.check(c);
  applying.value = false;
  if (!accepted) {
    voucherError.value = true;
    return;
  }
  draft.value = "";
  emit("voucher", c);
};
</script>