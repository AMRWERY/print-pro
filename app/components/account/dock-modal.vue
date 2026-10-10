<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog"
        aria-modal="true" aria-labelledby="dock-modal-title">
        <div class="fixed inset-0 bg-ink/80 backdrop-blur-md transition-opacity" @click="$emit('close')" />

        <div
          class="relative w-full max-w-lg overflow-hidden rounded-panel border border-line bg-surface shadow-2xl shadow-black/60 font-mono text-xs">
          <div class="flex items-center justify-between border-b border-line bg-ink px-5 py-3.5">
            <div class="flex items-center gap-2">
              <span class="h-2 w-2 rounded-full bg-cyan" />
              <h2 id="dock-modal-title" class="font-bold uppercase tracking-wider text-paper text-sm">
                {{ dock ? 'EDIT RECEIVING PORT' : 'DEPLOY NEW RECEIVING PORT' }}
              </h2>
            </div>
            <button type="button" class="rounded-control p-1 text-mute transition hover:bg-raised hover:text-paper"
              aria-label="Close modal" @click="$emit('close')">
              <Icon name="lucide:x" size="18" />
            </button>
          </div>

          <form class="p-5 sm:p-6 space-y-4" @submit.prevent="submitDock">
            <div class="space-y-1.5">
              <label class="eyebrow text-mute">PORT / ATELIER IDENTIFIER</label>
              <input v-model="name" type="text" required
                class="w-full rounded-control border border-line bg-ink/60 px-3 py-2 text-paper focus:border-accent focus:outline-none"
                placeholder="e.g. Zurich Archival Ingest Bay 02" />
            </div>

            <div class="space-y-1.5">
              <label class="eyebrow text-mute">PHYSICAL DELIVERY ADDRESS</label>
              <textarea v-model="address" rows="2" required
                class="w-full rounded-control border border-line bg-ink/60 p-3 text-paper focus:border-accent focus:outline-none font-sans text-xs"
                placeholder="Full delivery street, building, city, zip, and laboratory wing..." />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1.5">
                <label class="eyebrow text-mute">SECURITY CLEARANCE</label>
                <select v-model="securityClearance"
                  class="w-full rounded-control border border-line bg-ink/60 px-3 py-2 text-paper focus:border-accent focus:outline-none">
                  <option value="LEVEL 4 CONSERVATOR">Level 4 Conservator (Diplomatic Seal)</option>
                  <option value="DE-METRX-4">DE-METRX-4 Cleanroom Transit</option>
                  <option value="LEVEL 3 RESEARCH">Level 3 Research Fellow</option>
                </select>
              </div>

              <div class="space-y-1.5">
                <label class="eyebrow text-mute">BONDED AGENT</label>
                <input v-model="bondedAgent" type="text"
                  class="w-full rounded-control border border-line bg-ink/60 px-3 py-2 text-paper focus:border-accent focus:outline-none"
                  placeholder="#CH-882" />
              </div>
            </div>

            <div class="space-y-1.5">
              <label class="eyebrow text-mute">CLIMATE SPECS</label>
              <input v-model="climateSpecs" type="text"
                class="w-full rounded-control border border-line bg-ink/60 px-3 py-2 text-paper focus:border-accent focus:outline-none"
                placeholder="Constant 18°C / 45% Relative Humidity" />
            </div>

            <div class="flex items-center justify-end gap-3 pt-2">
              <button type="button"
                class="rounded-control border border-line px-4 py-2 font-mono text-xs text-mute hover:text-paper"
                @click="$emit('close')">
                CANCEL
              </button>
              <button type="submit"
                class="rounded-control bg-accent px-5 py-2 font-mono text-xs font-bold text-onaccent shadow-sm hover:brightness-110 active:scale-95">
                SAVE PORT CONFIGURATION
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
import type { ReceivingDock } from "~/types/account";

const props = defineProps<{
  open: boolean;
  dock?: ReceivingDock | null;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "saved", payload: any): void;
}>();

const name = ref(props.dock?.name || "");
const address = ref(props.dock?.address || "");
const securityClearance = ref(props.dock?.securityClearance || "LEVEL 4 CONSERVATOR");
const bondedAgent = ref(props.dock?.bondedAgent || "#CH-882");
const climateSpecs = ref(props.dock?.climateSpecs || "Direct Climate Airlock Access (Bay 12)");

watch(
  () => props.dock,
  (d) => {
    if (d) {
      name.value = d.name;
      address.value = d.address;
      securityClearance.value = d.securityClearance;
      bondedAgent.value = d.bondedAgent || "";
      climateSpecs.value = d.climateSpecs;
    } else {
      name.value = "";
      address.value = "";
      securityClearance.value = "LEVEL 4 CONSERVATOR";
      bondedAgent.value = "#CH-882";
      climateSpecs.value = "Direct Climate Airlock Access (Bay 12)";
    }
  },
);

const submitDock = () => {
  emit("saved", {
    id: props.dock?.id || `dock-${Date.now()}`,
    name: name.value,
    code: "CUSTOM-DOCK",
    typeBadge: "CUSTOM ATELIER",
    clearanceBadge: "ISO 5 AIRLOCK",
    address: address.value,
    climateSpecs: climateSpecs.value,
    securityClearance: securityClearance.value,
    telemetry: "18.9°C / 44.0% RH",
    bondedAgent: bondedAgent.value,
    isPrimary: false,
  });
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