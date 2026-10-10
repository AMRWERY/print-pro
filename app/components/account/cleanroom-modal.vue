<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true" aria-labelledby="cleanroom-modal-title">
        <div class="fixed inset-0 bg-ink/80 backdrop-blur-md" @click="$emit('close')" />

        <div class="relative max-h-full w-full max-w-lg overflow-y-auto rounded-panel border border-line bg-surface shadow-2xl shadow-black/60">
          <div class="flex items-center justify-between border-b border-line bg-ink px-5 py-3.5">
            <div class="flex items-center gap-2">
              <span class="h-2 w-2 rounded-full bg-success" aria-hidden="true" />
              <h2 id="cleanroom-modal-title" class="font-mono text-sm font-bold uppercase tracking-wider text-paper">Book cleanroom QA bench // ISO 5</h2>
            </div>
            <LazyVButton variant="icon" icon="lucide:x" aria-label="Close dialog" @click="$emit('close')" />
          </div>

          <form class="space-y-4 p-5 sm:p-6" novalidate @submit.prevent="submitBooking">
            <LazyVSelectInput v-model="location" name="room-location" label="Location & airlock dock" :options="locations" />

            <div class="grid gap-3 sm:grid-cols-2">
              <LazyVInput v-model="bookingDate" name="room-date" type="date" label="Session date" required :rules="requiredText('Pick a session date.')" />
              <LazyVSelectInput v-model="slot" name="room-slot" label="Timeslot (CET/EDT)" :options="slots" />
            </div>

            <LazyVSelectInput v-model="equipmentType" name="room-equipment" label="Equipment allocation" :options="equipment" />

            <div class="space-y-1 rounded-control border border-line bg-ink/40 p-3 text-xs text-mute">
              <div class="flex items-center justify-between font-mono font-semibold text-paper">
                <span>SECURITY CLEARANCE</span>
                <span class="text-success">LEVEL 4 CONSERVATOR (ACTIVE)</span>
              </div>
              <p>{{ name }} holds biometric pre-clearance for cleanroom entry without secondary vetting.</p>
            </div>

            <div class="flex items-center justify-end gap-3 pt-2">
              <LazyVButton variant="tertiary" @click="$emit('close')">Cancel</LazyVButton>
              <LazyVButton type="submit" variant="primary">Confirm reservation</LazyVButton>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
const props = defineProps<{ open: boolean }>();
const emit = defineEmits<{
  close: [];
  booked: [details: { location: string; date: string; slot: string; equipment: string }];
}>();

const { profile } = useAccount();
const name = computed(() => profile.value.name);

const locations = [
  { value: "Berlin Station 04", label: "Berlin Station 04 — Köpenicker Str. 148 (Tier 4 Airlock)" },
  { value: "New York Dock 4B", label: "New York Dock 4B — Metropolitan Archival Wing (Class 100)" },
];
const slots = [
  { value: "09:00 - 13:00", label: "Morning session: 09:00 - 13:00" },
  { value: "14:00 - 18:00", label: "Afternoon session: 14:00 - 18:00" },
  { value: "Full day", label: "Full 8-hour intensive bench block" },
];
const equipment = [
  { value: "interferometry", label: "Laser Interferometry MTF Bench" },
  { value: "collimator", label: "Parallel Beam Optical Collimator" },
  { value: "spectro", label: "D50 2000-Lux Spectro Verification Chamber" },
];

const location = ref(locations[0]!.value);
const bookingDate = ref("");
const slot = ref(slots[0]!.value);
const equipmentType = ref(equipment[0]!.value);

const { validate } = useForm();

// A booking can't start in the past; default to tomorrow each time the dialog opens.
watch(
  () => props.open,
  (open) => {
    if (!open) return;
    const d = new Date();
    d.setDate(d.getDate() + 1);
    bookingDate.value = d.toISOString().slice(0, 10);
  },
);

onKeyStroke("Escape", () => props.open && emit("close"));

const submitBooking = async () => {
  if (!(await validate()).valid) {
    await nextTick();
    document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
    return;
  }
  emit("booked", { location: location.value, date: bookingDate.value, slot: slot.value, equipment: equipmentType.value });
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
