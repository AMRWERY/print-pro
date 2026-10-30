<template>
  <section class="card-roomy space-y-4" aria-labelledby="lookup-title">
    <div>
      <p class="eyebrow-accent">
        <span class="pip" aria-hidden="true" />Order tracking
      </p>
      <h1 id="lookup-title" class="font-display text-3xl sm:text-4xl">
        Track your order
      </h1>
      <p class="mt-1 text-sm text-mute">
        {{ t("orders.track_lookup_hint", "Enter your order number and the PIN from your confirmation. If you're signed in, your own orders don't need a PIN.") }}
      </p>
    </div>

    <form
      class="grid gap-3 md:grid-cols-[1fr_1fr_auto] md:items-start"
      novalidate
      @submit.prevent="submit"
    >
      <LazyVInput
        ref="idField"
        v-model="orderId"
        name="trackOrder"
        label="Order number"
        required
        :rules="
          requiredText(
            'Enter the order number from your confirmation, for example LP-1A2B3C.',
          )
        "
        autocomplete="off"
        autocapitalize="characters"
        placeholder="LP-XXXXXX"
        input-class="font-mono"
      />

      <LazyVInput
        ref="verifyField"
        v-model="verify"
        name="trackVerify"
        :label="t('orders.track_pin_label', 'Order PIN')"
        :required="!auth.isSignedIn"
        :optional="auth.isSignedIn"
        :rules="auth.isSignedIn ? undefined : requiredText(t('orders.track_pin_required', 'Enter the PIN from your order confirmation.'))"
        autocomplete="off"
        :placeholder="t('orders.track_pin_placeholder', 'e.g. 4821-9307')"
        input-class="font-mono"
      />

      <LazyVButton
        type="submit"
        variant="primary"
        size="lg"
        :loading="loading"
        icon="lucide:radar"
        class="md:mt-[1.625rem]"
        >{{ t("btn.track_order") }}</LazyVButton
      >
    </form>

    <p v-if="error" class="callout-accent" role="alert">
      <Icon
        name="lucide:circle-alert"
        size="16"
        class="bullet-icon"
        aria-hidden="true"
      />{{ error }}
    </p>

    <div v-if="recent.length" class="flex flex-wrap items-center gap-2">
      <span class="eyebrow">Your recent orders</span>
      <LazyVButton
        v-for="o in recent"
        :key="o.id"
        variant="plain"
        class="rounded-control border border-line px-2.5 py-1 font-mono text-xs transition duration-200 hover:border-accent hover:text-accent"
        @click="open(o)"
      >
        #{{ o.id }}
      </LazyVButton>
    </div>
  </section>
</template>

<script lang="ts" setup>
import type { Order } from "~/types/order";
import type { Validatable } from "~/types/track-order";

const { t } = useI18n();
const auth = useAuthStore();

defineProps<{ recent: Order[]; error?: string; loading?: boolean }>();

const emit = defineEmits<{
  lookup: [payload: { id: string; verify: string }];
  open: [order: Order];
}>();

const orderId = ref("");
const verify = ref("");
const idField = ref<Validatable>();
const verifyField = ref<Validatable>();

const submit = async () => {
  const [a, b] = await Promise.all([
    idField.value?.validate(),
    verifyField.value?.validate(),
  ]);
  if (!a?.valid || !b?.valid) return;
  emit("lookup", { id: orderId.value, verify: verify.value });
};

const open = (o: Order) => emit("open", o);
</script>