<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        class="modal-root"
        role="dialog"
        aria-modal="true"
        aria-labelledby="concierge-modal-title"
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
                id="concierge-modal-title"
                class="font-mono text-sm font-bold tracking-wider text-paper"
              >
                Book a 1-on-1 tech concierge
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
            <p class="text-sm text-mute">
              A bench technician walks you through gear, calibration or a print
              job in a private 30-minute video session.
            </p>

            <LazyVSelectInput
              v-model="topic"
              name="concierge-topic"
              label="What do you need help with?"
              :options="topics"
            />

            <div class="grid gap-3 sm:grid-cols-2">
              <LazyVDatePicker
                v-model="date"
                name="concierge-date"
                label="Session date"
                required
                :min="earliest"
                :is-date-disabled="isWeekend"
                hint="Monday to Friday"
                :rules="requiredText('Pick a session date.')"
              />

              <LazyVSelectInput
                v-model="slot"
                name="concierge-slot"
                label="Time (studio time)"
                :options="slots"
              />
            </div>

            <div class="grid gap-3 sm:grid-cols-2">
              <LazyVInput
                v-model="name"
                name="concierge-name"
                label="Your name"
                required
                autocomplete="name"
                :rules="
                  requiredText(
                    'Enter your name so the technician can greet you.',
                  )
                "
              />

              <LazyVInput
                v-model="email"
                name="concierge-email"
                type="email"
                label="Email"
                required
                autocomplete="email"
                :rules="emailRule"
              />
            </div>

            <LazyVTextarea
              v-model="notes"
              name="concierge-notes"
              label="Anything we should prepare?"
              optional
              rows="3"
              placeholder="Models you are comparing, a print size, or a problem you are seeing"
            />

            <div class="flex items-center justify-end gap-3 pt-2">
              <LazyVButton variant="tertiary" @click="$emit('close')"
                >Cancel</LazyVButton
              >

              <LazyVButton type="submit" variant="primary" :loading="submitting"
                >Confirm session</LazyVButton
              >
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
const toast = useToast();
const auth = useAuthStore();

const props = defineProps<{ open: boolean }>();

const emit = defineEmits<{ close: [] }>();

const topics = [
  { value: "gear", label: "Choosing cameras, lenses or lighting" },
  { value: "printing", label: "Planning a print job or paper choice" },
  { value: "calibration", label: "Calibration and colour management" },
  { value: "setup", label: "Setting up or troubleshooting equipment" },
];

const slots = [
  { value: "09:00", label: "09:00 – 09:30" },
  { value: "10:30", label: "10:30 – 11:00" },
  { value: "13:00", label: "13:00 – 13:30" },
  { value: "15:00", label: "15:00 – 15:30" },
  { value: "16:30", label: "16:30 – 17:00" },
];

const topic = ref(topics[0]!.value);
const slot = ref(slots[0]!.value);
const date = ref("");
const name = ref("");
const email = ref("");
const notes = ref("");
const earliest = ref("");
const submitting = ref(false);

const { validate, resetForm } = useForm();

const localIso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const isWeekend = (iso: string) => {
  const day = new Date(`${iso}T00:00:00`).getDay();
  return day === 0 || day === 6;
};

// Each time the dialog opens: start from the next working day and prefill who you are.
watch(
  () => props.open,
  (open) => {
    if (!open) return;
    const d = new Date();
    do d.setDate(d.getDate() + 1);
    while (isWeekend(localIso(d)));
    earliest.value = date.value = localIso(d);
    name.value ||= auth.user?.name ?? "";
    email.value ||= auth.user?.email ?? "";
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

  const when = new Date(`${date.value}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  toast.success("Concierge session booked", {
    description: `${when} at ${slot.value}. A confirmation is on its way to ${email.value}.`,
  });
  notes.value = "";
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