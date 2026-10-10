<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog"
        aria-modal="true" aria-labelledby="cleanroom-modal-title">
        <div class="fixed inset-0 bg-ink/80 backdrop-blur-md transition-opacity" @click="$emit('close')" />

        <div
          class="relative w-full max-w-lg overflow-hidden rounded-panel border border-line bg-surface shadow-2xl shadow-black/60 font-mono text-xs">
          <div class="flex items-center justify-between border-b border-line bg-ink px-5 py-3.5">
            <div class="flex items-center gap-2">
              <span class="h-2 w-2 rounded-full bg-success" />
              <h2 id="cleanroom-modal-title" class="font-bold uppercase tracking-wider text-paper text-sm">
                BOOK CLEANROOM QA BENCH // ISO 5
              </h2>
            </div>
            <button type="button" class="rounded-control p-1 text-mute transition hover:bg-raised hover:text-paper"
              aria-label="Close modal" @click="$emit('close')">
              <Icon name="lucide:x" size="18" />
            </button>
          </div>

          <form class="p-5 sm:p-6 space-y-4" @submit.prevent="submitBooking">
            <div class="space-y-1.5">
              <label class="eyebrow text-mute">LOCATION &amp; AIRLOCK DOCK</label>
              <select v-model="location"
                class="w-full rounded-control border border-line bg-ink/60 px-3 py-2 text-paper focus:border-accent focus:outline-none">
                <option value="berlin-station-04">Berlin Station 04 — Köpenicker Str. 148 (Tier 4 Airlock)</option>
                <option value="nyc-dock-4b">New York Dock 4B — Metropolitan Archival Wing (Class 100)</option>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1.5">
                <label class="eyebrow text-mute">SESSION DATE</label>
                <input v-model="bookingDate" type="date"
                  class="w-full rounded-control border border-line bg-ink/60 px-3 py-2 text-paper focus:border-accent focus:outline-none" />
              </div>

              <div class="space-y-1.5">
                <label class="eyebrow text-mute">TIMESLOT (CET/EDT)</label>
                <select v-model="slot"
                  class="w-full rounded-control border border-line bg-ink/60 px-3 py-2 text-paper focus:border-accent focus:outline-none">
                  <option value="09:00 - 13:00">Morning Session: 09:00 - 13:00</option>
                  <option value="14:00 - 18:00">Afternoon Session: 14:00 - 18:00</option>
                  <option value="full-day">Full 8-Hour Intensive Bench Block</option>
                </select>
              </div>
            </div>

            <div class="space-y-1.5">
              <label class="eyebrow text-mute">EQUIPMENT ALLOCATION</label>
              <select v-model="equipmentType"
                class="w-full rounded-control border border-line bg-ink/60 px-3 py-2 text-paper focus:border-accent focus:outline-none">
                <option value="interferometry">Laser Interferometry MTF Bench</option>
                <option value="collimator">Parallel Beam Optical Collimator</option>
                <option value="spectro">D50 2000-Lux Spectro Verification Chamber</option>
              </select>
            </div>

            <div class="rounded-control border border-line bg-ink/40 p-3 space-y-1 text-[11px] text-mute">
              <div class="flex items-center justify-between text-paper font-semibold">
                <span>SECURITY CLEARANCE</span>
                <span class="text-success">LEVEL 4 CONSERVATOR (ACTIVE)</span>
              </div>
              <p class="font-sans text-xs">
                Amr Mohamed holds biometric pre-clearance for cleanroom entry without secondary vetting.
              </p>
            </div>

            <div class="flex items-center justify-end gap-3 pt-2">
              <button type="button"
                class="rounded-control border border-line px-4 py-2 font-mono text-xs text-mute hover:text-paper"
                @click="$emit('close')">
                CANCEL
              </button>
              <button type="submit"
                class="rounded-control bg-accent px-5 py-2 font-mono text-xs font-bold text-onaccent shadow-sm hover:brightness-110 active:scale-95">
                CONFIRM RESERVATION
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
  (e: "booked", payload: any): void;
}>();

const location = ref("berlin-station-04");
const bookingDate = ref("2024-11-04");
const slot = ref("09:00 - 13:00");
const equipmentType = ref("interferometry");

const submitBooking = () => {
  emit("booked", {
    location: location.value,
    date: bookingDate.value,
    slot: slot.value,
    equipment: equipmentType.value,
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