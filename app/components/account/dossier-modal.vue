<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog"
        aria-modal="true" aria-labelledby="dossier-modal-title">
        <div class="fixed inset-0 bg-ink/80 backdrop-blur-md transition-opacity" @click="$emit('close')" />

        <div
          class="relative w-full max-w-2xl overflow-hidden rounded-panel border border-line bg-surface shadow-2xl shadow-black/60 font-mono text-xs">
          <div class="flex items-center justify-between border-b border-line bg-ink px-5 py-3.5">
            <div class="flex items-center gap-2">
              <span class="h-2 w-2 rounded-full bg-accent" />
              <h2 id="dossier-modal-title" class="font-bold uppercase tracking-wider text-paper text-sm">
                {{ title || 'ARCHIVAL REQUISITION DOSSIER' }}
              </h2>
            </div>
            <button type="button" class="rounded-control p-1 text-mute transition hover:bg-raised hover:text-paper"
              aria-label="Close modal" @click="$emit('close')">
              <Icon name="lucide:x" size="18" />
            </button>
          </div>

          <div class="max-h-[75vh] overflow-y-auto p-6 space-y-5">
            <!-- Dossier Header Block -->
            <div class="border-b border-line pb-4 flex flex-wrap items-start justify-between gap-4">
              <div>
                <p class="font-display text-xl font-bold text-paper">
                  LUMEN &amp; PRESS METROLOGY WORKS
                </p>
                <p class="text-[11px] text-mute mt-0.5">
                  SWISS CALIBRATION ACCREDITATION // DIN EN ISO 9001:2015
                </p>
                <p class="text-[11px] text-accent mt-1">
                  ISSUED TO: Amr Mohamed • Metropolitan Archival Wing
                </p>
              </div>

              <div class="text-end">
                <span class="rounded border border-line bg-ink px-2.5 py-1 text-mute text-[10px]">
                  ARCHIVE REGISTRY: ARCH-2024-DE-NYC
                </span>
                <p class="text-[11px] text-mute mt-1">Date: 28 OCT 2024</p>
              </div>
            </div>

            <!-- Content preview -->
            <div class="space-y-3 font-sans text-xs text-mute leading-relaxed">
              <p>
                This dossier constitutes the official forensic record for optical instruments, calibration curves, and
                substrate allocations registered under Curatorial Tier 01 agreement.
              </p>

              <div class="rounded-control border border-line bg-ink/40 p-4 font-mono text-xs space-y-2">
                <div class="flex justify-between border-b border-line/40 pb-1.5 text-paper font-bold">
                  <span>METROLOGY SPECIFICATION</span>
                  <span>RESULT</span>
                </div>
                <div class="flex justify-between text-[11px]">
                  <span>FOGRA51 Proof Tolerance</span>
                  <span class="text-success font-semibold">PASS (ΔE = 0.186 Nom)</span>
                </div>
                <div class="flex justify-between text-[11px]">
                  <span>Spectral Collimation MTF</span>
                  <span class="text-success font-semibold">98.4% @ 50 Lp/mm</span>
                </div>
                <div class="flex justify-between text-[11px]">
                  <span>Relative Humidity Chamber Retention</span>
                  <span class="text-paper">42% (Airlock Sealed)</span>
                </div>
                <div class="flex justify-between text-[11px]">
                  <span>G-Force Maximum Shock Record</span>
                  <span class="text-success font-semibold">0.02 G (Damped Safe)</span>
                </div>
              </div>

              <p>
                Cryptographic authentication hash for this document:
              </p>
              <p class="rounded-control bg-ink/70 p-2 font-mono text-[11px] text-accent break-all">
                SHA-256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
              </p>
            </div>
          </div>

          <div class="flex items-center justify-between border-t border-line bg-ink px-5 py-3">
            <span class="text-mute text-[11px]">Authorized Signatory: Dr. Vance Lab</span>
            <div class="flex items-center gap-2">
              <button type="button"
                class="rounded-control border border-line px-4 py-1.5 font-bold text-mute hover:text-paper"
                @click="$emit('close')">
                CLOSE
              </button>
              <button type="button"
                class="inline-flex items-center gap-1.5 rounded-control bg-accent px-4 py-1.5 font-bold text-onaccent hover:brightness-110 active:scale-95"
                @click="printDoc">
                <Icon name="lucide:printer" size="13" />
                PRINT / EXPORT PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
defineProps<{
  open: boolean;
  title?: string;
}>();

defineEmits<{
  (e: "close"): void;
}>();

const printDoc = () => {
  window.print();
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