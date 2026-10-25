<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        class="modal-root"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cleanroom-modal-title"
      >
        <div
          class="fixed inset-0 bg-ink/80 backdrop-blur-md"
          @click="$emit('close')"
        />

        <div class="modal-panel">
          <div class="modal-head">
            <div class="flex items-center gap-2">
              <span
                class="h-2 w-2 rounded-full bg-success"
                aria-hidden="true"
              />
              <h2
                id="cleanroom-modal-title"
                class="font-mono text-sm font-bold tracking-wider text-paper"
              >
                Book a service visit
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
            @submit.prevent="submitBooking"
          >
            <LazyVSelectInput
              v-model="location"
              name="room-location"
              label="Visit location"
              :options="locations"
            />

            <div class="grid gap-3 sm:grid-cols-2">
              <LazyVDatePicker
                v-model="bookingDate"
                name="room-date"
                label="Session date"
                required
                :min="tomorrow"
                :rules="requiredText('Pick a session date.')"
              />

              <LazyVSelectInput
                v-model="slot"
                name="room-slot"
                label="Time slot"
                :options="slots"
              />
            </div>

            <LazyVSelectInput
              v-model="equipmentType"
              name="room-equipment"
              label="Type of visit"
              :options="equipment"
            />

            <div
              class="space-y-1 rounded-control border border-line bg-ink/40 p-3 text-xs text-mute"
            >
              <div
                class="flex items-center justify-between font-mono font-semibold text-paper"
              >
                <span>ACCOUNT TYPE</span>
                <span class="text-success">BUSINESS ACCOUNT (ACTIVE)</span>
              </div>
              <p>
                Visits for {{ name }} are covered by your maintenance terms. A
                technician will confirm the time by phone.
              </p>
            </div>

            <div class="flex items-center justify-end gap-3 pt-2">
              <LazyVButton variant="tertiary" @click="$emit('close')">{{
                t("btn.cancel")
              }}</LazyVButton>
              
              <LazyVButton
                type="submit"
                variant="primary"
                :loading="submitting"
                >{{ t("btn.confirm_visit") }}</LazyVButton
              >
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
const { t } = useI18n();

const props = defineProps<{ open: boolean }>();

const emit = defineEmits<{
  close: [];
  booked: [
    details: {
      location: string;
      date: string;
      slot: string;
      equipment: string;
    },
  ];
}>();

const { profile } = useAccount();
const name = computed(() => profile.value.name);

const locations = [
  { value: "Head office", label: "Head office (Cairo)" },
  { value: "Branch office", label: "Branch office (Giza)" },
];

const slots = [
  { value: "09:00 - 13:00", label: "Morning session: 09:00 - 13:00" },
  { value: "14:00 - 18:00", label: "Afternoon session: 14:00 - 18:00" },
  { value: "Full day", label: "Full day: 09:00 - 17:00" },
];

const equipment = [
  { value: "service", label: "Scheduled servicing" },
  { value: "repair", label: "Repair call-out" },
  { value: "install", label: "Installation and setup" },
];

const location = ref(locations[0]!.value);
const bookingDate = ref("");
const slot = ref(slots[0]!.value);
const equipmentType = ref(equipment[0]!.value);

const { validate } = useForm();
const submitting = ref(false);

// A booking can't start in the past; default to tomorrow each time the dialog opens.
const localIso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const tomorrow = ref("");

watch(
  () => props.open,
  (open) => {
    if (!open) return;
    const d = new Date();
    d.setDate(d.getDate() + 1);
    tomorrow.value = bookingDate.value = localIso(d);
  },
);

onKeyStroke("Escape", () => props.open && emit("close"));

const submitBooking = async () => {
  if (!(await validate()).valid) {
    await nextTick();
    document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
    return;
  }
  submitting.value = true;
  await simulateRequest(600);
  submitting.value = false;
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