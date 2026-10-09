<template>
  <aside class="card space-y-4 p-5" aria-labelledby="summary-title">
    <div class="flex items-center justify-between gap-2">
      <h2 id="summary-title" class="font-display text-2xl uppercase">
        Order summary
      </h2>
      <span
        class="inline-flex items-center gap-1 rounded-control border border-line px-2 py-0.5 font-mono text-xs text-mute"
        ><Icon
          name="lucide:badge-check"
          size="12"
          class="text-success"
          aria-hidden="true"
        />Tax-exempt studio verified</span
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
        <dt>Tiered volume discount (media)</dt>
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
        <dt class="text-mute">Climate-crated freight (insured)</dt>
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
          <span class="font-mono text-xs text-mute">USD</span></span
        >
      </p>
      <p
        v-if="totals.leaseMonthly"
        class="mt-2 flex justify-between gap-3 font-mono text-xs text-mute"
      >
        <span>Commercial lease equivalent</span
        ><span>{{ money.format(totals.leaseMonthly) }} / mo</span>
      </p>
    </div>

    <!-- Voucher -->
    <div class="space-y-2">
      <p class="eyebrow">Studio voucher or consortium code</p>
      <form v-if="!applied" class="flex items-start gap-2" novalidate @submit.prevent="apply">
        <LazyVInput
          ref="voucherInput"
          v-model="draft"
          class="flex-1"
          name="voucher"
          label="Voucher code"
          hide-label
          :rules="voucherRule"
          autocomplete="off"
          autocapitalize="characters"
          placeholder="BIENNIAL-PRINT-2025"
          input-class="font-mono"
        />
        <LazyVButton variant="secondary" type="submit" class="shrink-0" :disabled="!draft.trim()">Apply</LazyVButton>
      </form>
      
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
        <LazyVButton variant="tertiary"
          class="text-xs"
          @click="emit('voucher', '')"
        >
          Remove
        </LazyVButton>
      </div>
    </div>

    <div class="space-y-2">
      <LazyVButton variant="primary" size="lg" block
       
        :disabled="!totals.units"
        @click="emit('checkout')"
      >
        <Icon name="lucide:lock" size="16" aria-hidden="true" />Secure studio
        checkout
        <Icon
          name="lucide:arrow-right"
          size="16"
          class="icon-nudge rtl:-scale-x-100"
          aria-hidden="true"
        />
      </LazyVButton>
      <LazyVButton variant="secondary" block
        class="text-xs"
        :disabled="!totals.units"
      >
        <Icon name="lucide:landmark" size="14" aria-hidden="true" />Wire
        transfer / escrow (save 2%)
      </LazyVButton>
      <p
        v-if="notice"
        class="rounded-control border border-line bg-raised p-2 text-xs text-mute"
        role="status"
      >
        {{ notice }}
      </p>
      <LazyVButton variant="tertiary"
        to="/products"
        class="flex items-center justify-center gap-1.5 text-sm"
        ><Icon
          name="lucide:arrow-left"
          size="14"
          class="rtl:-scale-x-100"
          aria-hidden="true"
        />Continue exploring equipment catalog</LazyVButton>
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
          class="mt-0.5 shrink-0 text-accent"
          aria-hidden="true"
        />{{ a.label }}
      </li>
    </ul>
  </aside>
</template>

<script lang="ts" setup>
import { cartAssurances, pricing, vouchers } from "~/data/cart";
import type { useCartTotals } from "~/composables/useCartTotals";

const props = defineProps<{
  totals: ReturnType<typeof useCartTotals>;
  selectedCount: number;
  code: string;
  notice?: string;
}>();

const emit = defineEmits<{ voucher: [code: string]; checkout: [] }>();

const money = useMoney();
const draft = ref("");

const applied = computed(
  () => !!props.code && !!vouchers[props.code.toUpperCase()],
);

const voucherInput = ref<{ validate: () => Promise<{ valid: boolean }> }>();

// vee-validate rule: empty is fine (Apply stays disabled); unknown codes explain themselves.
const voucherRule = (v: unknown) =>
  !v || vouchers[String(v).trim().toUpperCase()]
    ? true
    : "That code isn't recognised. Check it for typos, or try BIENNIAL-PRINT-2025.";

const apply = async () => {
  const result = await voucherInput.value?.validate();
  if (!result?.valid) return;
  const c = draft.value.trim().toUpperCase();
  draft.value = "";
  emit("voucher", c);
};

</script>