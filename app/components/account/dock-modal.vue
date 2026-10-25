<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        class="modal-root"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dock-modal-title"
      >
        <div
          class="fixed inset-0 bg-ink/80 backdrop-blur-md"
          @click="$emit('close')"
        />

        <div class="modal-panel">
          <div class="modal-head">
            <div class="flex items-center gap-2">
              <span class="h-2 w-2 rounded-full bg-cyan" aria-hidden="true" />
              <h2
                id="dock-modal-title"
                class="font-mono text-sm font-bold tracking-wider text-paper"
              >
                {{ dock ? "Edit delivery address" : "Add delivery address" }}
              </h2>
            </div>

            <LazyVButton
              variant="icon"
              icon="lucide:x"
              aria-label="Close dialog"
              @click="$emit('close')"
            />
          </div>

          <form
            class="space-y-4 p-5 sm:p-6"
            novalidate
            @submit.prevent="submitDock"
          >
            <LazyVInput
              ref="first"
              v-model="name"
              name="dock-name"
              label="Address name"
              required
              :rules="
                requiredText(
                  'Name this address so you can pick it at checkout.',
                )
              "
              placeholder="e.g. Head office"
            />

            <LazyVTextarea
              v-model="address"
              name="dock-address"
              label="Physical delivery address"
              required
              rows="3"
              :rules="
                minLengthText(
                  10,
                  'Enter the full street, city and postal code the courier should deliver to.',
                )
              "
              placeholder="Street, building, floor, city, postal code"
            />

            <div class="grid gap-3 sm:grid-cols-2">
              <LazyVSelectInput
                v-model="securityClearance"
                name="dock-clearance"
                label="Receiving hours"
                :options="clearances"
              />

              <LazyVInput
                v-model="bondedAgent"
                name="dock-agent"
                label="Contact person"
                optional
                placeholder="e.g. Mona, reception"
              />
            </div>

            <LazyVInput
              v-model="climateSpecs"
              name="dock-climate"
              label="Delivery instructions"
              optional
              placeholder="e.g. Use the loading bay at the rear"
            />

            <LazyVCheckboxInput
              v-model="primary"
              name="dock-primary"
              label="Use as my default delivery address"
            />

            <div class="flex items-center justify-end gap-3 pt-2">
              <LazyVButton variant="tertiary" @click="$emit('close')">{{
                t("btn.cancel")
              }}</LazyVButton>

              <LazyVButton type="submit" variant="primary" :loading="saving">{{
                t("btn.save_address")
              }}</LazyVButton>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
import type { ReceivingDock } from "~/types/account";

const { t } = useI18n();

const props = defineProps<{ open: boolean; dock?: ReceivingDock | null }>();

const emit = defineEmits<{ close: []; saved: [dock: ReceivingDock] }>();

const clearances = [
  { value: "WEEKDAYS 08:00-17:00", label: "Weekdays 08:00 – 17:00" },
  { value: "24/7 RECEPTION", label: "24/7 reception" },
  { value: "BY APPOINTMENT", label: "By appointment" },
];

const name = ref("");
const address = ref("");
const securityClearance = ref(clearances[0]!.value);
const bondedAgent = ref("");
const climateSpecs = ref("");
const primary = ref(false);
const saving = ref(false);
const first = ref<{ focus: () => void } | null>(null);

const { validate, resetForm } = useForm();

// Every time the dialog opens, start from the address being edited (or a blank one).
watch(
  () => props.open,
  async (open) => {
    if (!open) return;
    const d = props.dock;
    name.value = d?.name ?? "";
    address.value = d?.address ?? "";
    securityClearance.value = d?.securityClearance ?? clearances[0]!.value;
    bondedAgent.value = d?.bondedAgent ?? "";
    climateSpecs.value = d?.climateSpecs ?? "";
    primary.value = d?.isPrimary ?? false;
    resetForm();
    await nextTick();
    first.value?.focus();
  },
);

onKeyStroke("Escape", () => props.open && emit("close"));

const submitDock = async () => {
  const result = await validate();
  if (!result.valid) {
    await nextTick();
    document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
    return;
  }
  saving.value = true;
  emit("saved", {
    id: props.dock?.id ?? `dock-${Date.now()}`,
    name: name.value.trim(),
    code: props.dock?.code ?? "CUSTOM-ADDRESS",
    typeBadge: props.dock?.typeBadge ?? "DELIVERY ADDRESS",
    clearanceBadge: props.dock?.clearanceBadge ?? "SIGNATURE REQUIRED",
    address: address.value.trim(),
    climateSpecs: climateSpecs.value.trim() || "No special instructions",
    securityClearance: securityClearance.value,
    telemetry: props.dock?.telemetry ?? "Mon–Fri · 08:00–17:00",
    bondedAgent: bondedAgent.value.trim() || undefined,
    isPrimary: !!primary.value,
  });
  saving.value = false;
  emit("close");
};
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease-out;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
