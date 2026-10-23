<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        class="modal-root"
        role="dialog"
        aria-modal="true"
        aria-labelledby="calibration-modal-title"
      >
        <div
          class="fixed inset-0 bg-ink/80 backdrop-blur-md"
          @click="$emit('close')"
        />

        <div
          class="relative max-h-full w-full max-w-xl overflow-y-auto rounded-panel border border-accent/40 bg-surface shadow-2xl shadow-black/60"
        >
          <div
            class="modal-head"
          >
            <div class="flex items-center gap-2">
              <span class="pip rounded-full" aria-hidden="true" />
              <h2
                id="calibration-modal-title"
                class="font-mono text-sm font-bold tracking-wider text-accent"
              >
                Order supplies
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
            @submit.prevent="submitCalibration"
          >
            <LazyVSelectInput
              v-model="form.standard"
              name="cal-standard"
              label="Supply type"
              :options="standards"
            />
            <LazyVSelectInput
              v-model="form.substrate"
              name="cal-substrate"
              label="Machine model"
              :options="substrates"
            />

            <div class="grid gap-3 sm:grid-cols-2">
              <LazyVInput
                v-model="form.tolerance"
                name="cal-tolerance"
                label="Quantity"
                required
                :rules="requiredText('Enter how many you need, e.g. 2.')"
                placeholder="e.g. 2"
              />
              <LazyVSelectInput
                v-model="form.station"
                name="cal-station"
                label="Delivery address"
                :options="stations"
              />
            </div>

            <LazyVTextarea
              v-model="form.notes"
              name="cal-notes"
              label="Notes for our team"
              optional
              rows="3"
              placeholder="Preferred delivery time, colours needed, or anything else we should know"
            />

            <div
              class="flex items-center justify-between rounded-control border border-line bg-ink/30 p-3 text-xs text-mute"
            >
              <span class="font-mono">Estimated total</span>
              <span class="title-sm"
                >EGP 1,450.00</span
              >
            </div>

            <div class="flex items-center justify-end gap-3 pt-2">
              <LazyVButton variant="tertiary" @click="$emit('close')"
                >Cancel</LazyVButton
              >
              <LazyVButton type="submit" variant="primary" :loading="submitting"
                >Place order</LazyVButton
              >
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
  submitted: [
    details: {
      standard: string;
      substrate: string;
      tolerance: string;
      station: string;
      notes: string;
    },
  ];
}>();

const standards = [
  { value: "toner", label: "Toner cartridges" },
  { value: "ink", label: "Ink bottles and cartridges" },
  { value: "drum", label: "Drum units" },
];

const substrates = [
  { value: "corex-laser-210", label: "Corex Laser 210 Mono" },
  { value: "corex-laser-450c", label: "Corex Laser 450 Colour" },
  { value: "kopira-pro-a3-35", label: "Kopira Pro A3 35 ppm Mono" },
  { value: "printa-tank-500", label: "Printa Tank 500 Ink-Tank" },
  { value: "nordjet-lf-44", label: 'Nordjet Large-Format 44"' },
];

const stations = [
  { value: "head-office", label: "Head office (Cairo)" },
  { value: "branch", label: "Branch office (Giza)" },
];

const form = reactive({
  standard: "toner",
  substrate: "corex-laser-210",
  tolerance: "1",
  station: "head-office",
  notes: "",
});

const { validate } = useForm();
const submitting = ref(false);

onKeyStroke("Escape", () => props.open && emit("close"));

const submitCalibration = async () => {
  if (!(await validate()).valid) {
    await nextTick();
    document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
    return;
  }
  submitting.value = true;
  await simulateRequest(600);
  submitting.value = false;
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