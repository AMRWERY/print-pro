<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog"
        aria-modal="true" aria-labelledby="telemetry-modal-title">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-ink/80 backdrop-blur-md transition-opacity" @click="$emit('close')" />

        <!-- Dialog Window -->
        <div
          class="relative w-full max-w-2xl overflow-hidden rounded-panel border border-accent/40 bg-surface shadow-2xl shadow-black/60 font-mono text-xs">
          <!-- HUD Header -->
          <div class="flex items-center justify-between border-b border-line bg-ink px-5 py-3.5">
            <div class="flex items-center gap-2.5">
              <span class="relative flex h-2.5 w-2.5">
                <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span class="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
              </span>
              <h2 id="telemetry-modal-title" class="font-bold uppercase tracking-wider text-accent text-sm">
                LIVE TELEMETRY HUD // CRATE #LP-948201
              </h2>
            </div>

            <button type="button" class="rounded-control p-1 text-mute transition hover:bg-raised hover:text-paper"
              aria-label="Close telemetry HUD" @click="$emit('close')">
              <Icon name="lucide:x" size="18" />
            </button>
          </div>

          <div class="max-h-[80vh] overflow-y-auto p-5 sm:p-6 space-y-6">
            <!-- Flight Status Strip -->
            <div
              class="flex flex-wrap items-center justify-between gap-3 rounded-control border border-line bg-ink/50 p-3">
              <div>
                <p class="eyebrow text-mute">CARRIER ROUTE</p>
                <p class="font-display text-base font-bold text-paper">
                  Lufthansa Cargo • Flight LH-400 (FRA ✈ JFK)
                </p>
                <p class="text-[11px] text-mute">
                  Waybill: <span class="text-paper">LH-CARGO-VP185-26</span> • Est. Touchdown: <span
                    class="text-paper">28 OCT 14:30 EDT</span>
                </p>
              </div>

              <div class="text-end">
                <span
                  class="rounded-control bg-success-soft px-2.5 py-1 text-xs font-bold text-success border border-success/30">
                  ON-SCHEDULE • IN FLIGHT
                </span>
                <p class="text-[11px] text-mute mt-1">Altitude: 36,000 FT (Cruising)</p>
              </div>
            </div>

            <!-- Route Stepper -->
            <div class="space-y-2">
              <p class="eyebrow text-mute">CRATE DISPATCH TIMELINE</p>
              <div class="grid grid-cols-4 gap-2">
                <div class="rounded-control border border-line bg-ink/30 p-2.5 text-center space-y-1">
                  <Icon name="lucide:check-circle" size="14" class="text-success mx-auto" />
                  <p class="font-bold text-paper">BER Cleared</p>
                  <p class="text-[10px] text-mute">26 OCT 08:15</p>
                </div>
                <div class="rounded-control border border-line bg-ink/30 p-2.5 text-center space-y-1">
                  <Icon name="lucide:check-circle" size="14" class="text-success mx-auto" />
                  <p class="font-bold text-paper">TXL Customs</p>
                  <p class="text-[10px] text-mute">26 OCT 12:40</p>
                </div>
                <div class="rounded-control border border-accent bg-accent/10 p-2.5 text-center space-y-1">
                  <Icon name="lucide:plane" size="14" class="text-accent animate-pulse mx-auto" />
                  <p class="font-bold text-accent">Mid-Atlantic</p>
                  <p class="text-[10px] text-accent">ACTIVE CRUISE</p>
                </div>
                <div class="rounded-control border border-line bg-ink/30 p-2.5 text-center space-y-1 opacity-60">
                  <Icon name="lucide:clock" size="14" class="text-mute mx-auto" />
                  <p class="font-bold text-paper">JFK Dock 4B</p>
                  <p class="text-[10px] text-mute">ETA 28 OCT</p>
                </div>
              </div>
            </div>

            <!-- Real-Time Atmospheric & Physical Sensors Grid -->
            <div>
              <p class="eyebrow text-mute mb-2">HERMETIC VAULT SENSOR READINGS (LIVE FEED)</p>
              <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div class="rounded-control border border-line bg-surface p-3 space-y-1">
                  <dt class="text-mute text-[10px]">INTERNAL TEMP</dt>
                  <dd class="font-display text-xl font-bold text-paper">19.2°C</dd>
                  <dd class="text-[10px] text-success">Target 18°C ± 2°C (Optimal)</dd>
                </div>

                <div class="rounded-control border border-line bg-surface p-3 space-y-1">
                  <dt class="text-mute text-[10px]">RELATIVE HUMIDITY</dt>
                  <dd class="font-display text-xl font-bold text-paper">42% RH</dd>
                  <dd class="text-[10px] text-success">Target 45% ± 5% (Dry)</dd>
                </div>

                <div class="rounded-control border border-line bg-surface p-3 space-y-1">
                  <dt class="text-mute text-[10px]">IMPACT / G-FORCE</dt>
                  <dd class="font-display text-xl font-bold text-paper">0.02 G</dd>
                  <dd class="text-[10px] text-success">&lt; 0.5 G Damped Safe</dd>
                </div>

                <div class="rounded-control border border-line bg-surface p-3 space-y-1">
                  <dt class="text-mute text-[10px]">NITROGEN SEAL</dt>
                  <dd class="font-display text-xl font-bold text-paper">1.02 atm</dd>
                  <dd class="text-[10px] text-cyan">Airlock Sealed</dd>
                </div>
              </div>
            </div>

            <!-- Cryptographic Tamper Seal -->
            <div class="rounded-control border border-line bg-ink/60 p-3.5 space-y-2">
              <div class="flex items-center justify-between">
                <span class="font-bold text-paper flex items-center gap-1.5">
                  <Icon name="lucide:shield-check" size="14" class="text-cyan" />
                  PHYSICAL &amp; CRYPTOGRAPHIC TAMPER SEAL
                </span>
                <span class="rounded bg-success/20 px-2 py-0.5 font-bold text-success text-[10px]">
                  SEAL INTACT
                </span>
              </div>
              <p class="font-sans text-xs text-mute">
                Hardware electronic seal #SEAL-LP-884920 polled every 120 seconds. No unshielded decompression or
                mechanical breach detected.
              </p>
              <p class="text-[10px] text-mute font-mono">
                SIGNATURE: SHA-256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069
              </p>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="flex items-center justify-between border-t border-line bg-ink px-5 py-3">
            <span class="text-mute text-[11px]">Station Sync: FRA Telemetry Hub #04</span>
            <button type="button"
              class="rounded-control bg-raised border border-line px-4 py-1.5 font-bold text-paper transition hover:border-accent hover:text-accent"
              @click="$emit('close')">
              DISMISS HUD
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
import type { RequisitionOrder } from "~/types/account";

defineProps<{
  open: boolean;
  order?: RequisitionOrder | null;
}>();

defineEmits<{
  (e: "close"): void;
}>();
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