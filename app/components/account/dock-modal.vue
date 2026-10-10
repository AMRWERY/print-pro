<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true" aria-labelledby="dock-modal-title">
        <div class="fixed inset-0 bg-ink/80 backdrop-blur-md" @click="$emit('close')" />

        <div class="relative max-h-full w-full max-w-lg overflow-y-auto rounded-panel border border-line bg-surface shadow-2xl shadow-black/60">
          <div class="flex items-center justify-between border-b border-line bg-ink px-5 py-3.5">
            <div class="flex items-center gap-2">
              <span class="h-2 w-2 rounded-full bg-cyan" aria-hidden="true" />
              <h2 id="dock-modal-title" class="font-mono text-sm font-bold uppercase tracking-wider text-paper">
                {{ dock ? "Edit receiving port" : "Deploy new receiving port" }}
              </h2>
            </div>
            <LazyVButton variant="icon" icon="lucide:x" aria-label="Close dialog" @click="$emit('close')" />
          </div>

          <form class="space-y-4 p-5 sm:p-6" novalidate @submit.prevent="submitDock">
            <LazyVInput ref="first" v-model="name" name="dock-name" label="Port / atelier identifier" required :rules="requiredText('Name this port so you can pick it at checkout.')" placeholder="e.g. Zurich Archival Ingest Bay 02" />

            <LazyVTextarea v-model="address" name="dock-address" label="Physical delivery address" required rows="3" :rules="minLengthText(10, 'Enter the full street, city and postal code the carrier should deliver to.')" placeholder="Street, building, city, postal code, wing" />

            <div class="grid gap-3 sm:grid-cols-2">
              <LazyVSelectInput v-model="securityClearance" name="dock-clearance" label="Security clearance" :options="clearances" />
              <LazyVInput v-model="bondedAgent" name="dock-agent" label="Bonded agent" optional placeholder="#CH-882" />
            </div>

            <LazyVInput v-model="climateSpecs" name="dock-climate" label="Climate specs" optional placeholder="Constant 18°C / 45% relative humidity" />

            <LazyVInput v-model="primary" name="dock-primary" type="checkbox" label="Use as my primary receiving port" />

            <div class="flex items-center justify-end gap-3 pt-2">
              <LazyVButton variant="tertiary" @click="$emit('close')">Cancel</LazyVButton>
              <LazyVButton type="submit" variant="primary" :loading="saving">Save port</LazyVButton>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
import type { ReceivingDock } from "~/types/account";

const props = defineProps<{ open: boolean; dock?: ReceivingDock | null }>();
const emit = defineEmits<{ close: []; saved: [dock: ReceivingDock] }>();

const clearances = [
  { value: "LEVEL 4 CONSERVATOR", label: "Level 4 Conservator (Diplomatic Seal)" },
  { value: "DE-METRX-4", label: "DE-METRX-4 Cleanroom Transit" },
  { value: "LEVEL 3 RESEARCH", label: "Level 3 Research Fellow" },
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

// Every time the dialog opens, start from the dock being edited (or a blank one).
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
    code: props.dock?.code ?? "CUSTOM-DOCK",
    typeBadge: props.dock?.typeBadge ?? "CUSTOM ATELIER",
    clearanceBadge: props.dock?.clearanceBadge ?? "ISO 5 AIRLOCK",
    address: address.value.trim(),
    climateSpecs: climateSpecs.value.trim() || "Standard climate control",
    securityClearance: securityClearance.value,
    telemetry: props.dock?.telemetry ?? "18.9°C / 44.0% RH",
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
