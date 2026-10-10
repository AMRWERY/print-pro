<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog"
        aria-modal="true" aria-labelledby="calibration-modal-title">
        <div class="fixed inset-0 bg-ink/80 backdrop-blur-md transition-opacity" @click="$emit('close')" />

        <div
          class="relative w-full max-w-xl overflow-hidden rounded-panel border border-accent/40 bg-surface shadow-2xl shadow-black/60 font-mono text-xs">
          <!-- Header -->
          <div class="flex items-center justify-between border-b border-line bg-ink px-5 py-3.5">
            <div class="flex items-center gap-2">
              <span class="h-2 w-2 rounded-full bg-accent" />
              <h2 id="calibration-modal-title" class="font-bold uppercase tracking-wider text-accent text-sm">
                INITIATE CALIBRATION ORDER // ISO 12647-7
              </h2>
            </div>
            <button type="button" class="rounded-control p-1 text-mute transition hover:bg-raised hover:text-paper"
              aria-label="Close modal" @click="$emit('close')">
              <Icon name="lucide:x" size="18" />
            </button>
          </div>

          <!-- Form Body -->
          <form class="p-5 sm:p-6 space-y-4" @submit.prevent="submitCalibration">
            <div class="space-y-1.5">
              <label class="eyebrow text-mute">TARGET METROLOGY STANDARD</label>
              <select v-model="form.standard"
                class="w-full rounded-control border border-line bg-ink/60 px-3 py-2 text-paper focus:border-accent focus:outline-none">
                <option value="iso-12647-7">ISO 12647-7:2016 Proof Verification (Strict ΔE &lt; 0.35)</option>
                <option value="fogra-51">FOGRA51 / PSO Coated v3 (Optical Brightener Compensated)</option>
                <option value="g7-master">Idealliance G7 Master Print Benchmark</option>
              </select>
            </div>

            <div class="space-y-1.5">
              <label class="eyebrow text-mute">SUBSTRATE &amp; PAPER PROFILE</label>
              <select v-model="form.substrate"
                class="w-full rounded-control border border-line bg-ink/60 px-3 py-2 text-paper focus:border-accent focus:outline-none">
                <option value="hahnemuhle-rag">Hahnemühle Photo Rag 308gsm (100% Cotton, Pure White)</option>
                <option value="canson-platine">Canson Infinity Platine Fibre Rag 310gsm (Baryta Base)</option>
                <option value="ilford-gold">Ilford Galerie Gold Fibre Gloss 310gsm (Gelatin Coated)</option>
                <option value="awagami-kozo">Awagami Kozo Natural 110gsm (Handmade Mulberry)</option>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1.5">
                <label class="eyebrow text-mute">OPTICAL TOLERANCE</label>
                <input v-model="form.tolerance" type="text"
                  class="w-full rounded-control border border-line bg-ink/60 px-3 py-2 text-paper focus:border-accent focus:outline-none"
                  placeholder="ΔE ≤ 0.35" />
              </div>

              <div class="space-y-1.5">
                <label class="eyebrow text-mute">BENCH STATION</label>
                <select v-model="form.station"
                  class="w-full rounded-control border border-line bg-ink/60 px-3 py-2 text-paper focus:border-accent focus:outline-none">
                  <option value="berlin-04">Berlin Station 04 (Köpenicker)</option>
                  <option value="nyc-4b">NYC Metropolitan Wing (Dock 4B)</option>
                </select>
              </div>
            </div>

            <div class="space-y-1.5">
              <label class="eyebrow text-mute">SPECIAL CURATORIAL INSTRUCTIONS</label>
              <textarea v-model="form.notes" rows="3"
                class="w-full rounded-control border border-line bg-ink/60 p-3 text-paper focus:border-accent focus:outline-none font-sans text-xs"
                placeholder="Specify ink limits, UV filtration, or custom spectrometer patch grid (e.g. 1728 patches)..." />
            </div>

            <div
              class="rounded-control border border-line bg-ink/30 p-3 text-[11px] text-mute flex items-center justify-between">
              <span>ESTIMATED BENCH COST</span>
              <span class="font-display font-bold text-base text-paper">$1,450.00</span>
            </div>

            <!-- Footer Buttons -->
            <div class="flex items-center justify-end gap-3 pt-2">
              <button type="button"
                class="rounded-control border border-line px-4 py-2 font-mono text-xs text-mute hover:text-paper"
                @click="$emit('close')">
                CANCEL
              </button>
              <button type="submit"
                class="rounded-control bg-accent px-5 py-2 font-mono text-xs font-bold text-onaccent shadow-sm hover:brightness-110 active:scale-95">
                SUBMIT REQUISITION
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "submitted", payload: any): void;
}>();

const form = reactive({
  standard: "iso-12647-7",
  substrate: "hahnemuhle-rag",
  tolerance: "ΔE ≤ 0.35",
  station: "berlin-04",
  notes: "",
});

const submitCalibration = () => {
  emit("submitted", { ...form });
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