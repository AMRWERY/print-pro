<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
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
            class="flex items-center justify-between border-b border-line bg-ink px-5 py-3.5"
          >
            <div class="flex items-center gap-2">
              <span class="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
              <h2
                id="calibration-modal-title"
                class="font-mono text-sm font-bold tracking-wider text-accent"
              >
                Initiate calibration order // ISO 12647-7
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
              label="Target metrology standard"
              :options="standards"
            />
            <LazyVSelectInput
              v-model="form.substrate"
              name="cal-substrate"
              label="Substrate & paper profile"
              :options="substrates"
            />

            <div class="grid gap-3 sm:grid-cols-2">
              <LazyVInput
                v-model="form.tolerance"
                name="cal-tolerance"
                label="Optical tolerance"
                required
                :rules="requiredText('Enter a tolerance, e.g. ΔE ≤ 0.35.')"
                placeholder="ΔE ≤ 0.35"
              />
              <LazyVSelectInput
                v-model="form.station"
                name="cal-station"
                label="Bench station"
                :options="stations"
              />
            </div>

            <LazyVTextarea
              v-model="form.notes"
              name="cal-notes"
              label="Special curatorial instructions"
              optional
              rows="3"
              placeholder="Ink limits, UV filtration, or a custom patch grid (e.g. 1728 patches)"
            />

            <div
              class="flex items-center justify-between rounded-control border border-line bg-ink/30 p-3 text-xs text-mute"
            >
              <span class="font-mono">Estimated bench cost</span>
              <span class="font-display text-base font-bold text-paper"
                >$1,450.00</span
              >
            </div>

            <div class="flex items-center justify-end gap-3 pt-2">
              <LazyVButton variant="tertiary" @click="$emit('close')"
                >Cancel</LazyVButton
              >
              <LazyVButton type="submit" variant="primary"
                >Submit requisition</LazyVButton
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
  {
    value: "iso-12647-7",
    label: "ISO 12647-7:2016 Proof Verification (Strict ΔE < 0.35)",
  },
  {
    value: "fogra-51",
    label: "FOGRA51 / PSO Coated v3 (Optical Brightener Compensated)",
  },
  { value: "g7-master", label: "Idealliance G7 Master Print Benchmark" },
];

const substrates = [
  {
    value: "hahnemuhle-rag",
    label: "Hahnemühle Photo Rag 308gsm (100% Cotton, Pure White)",
  },
  {
    value: "canson-platine",
    label: "Canson Infinity Platine Fibre Rag 310gsm (Baryta Base)",
  },
  {
    value: "ilford-gold",
    label: "Ilford Galerie Gold Fibre Gloss 310gsm (Gelatin Coated)",
  },
  {
    value: "awagami-kozo",
    label: "Awagami Kozo Natural 110gsm (Handmade Mulberry)",
  },
];

const stations = [
  { value: "berlin-04", label: "Berlin Station 04 (Köpenicker)" },
  { value: "nyc-4b", label: "NYC Metropolitan Wing (Dock 4B)" },
];

const form = reactive({
  standard: "iso-12647-7",
  substrate: "hahnemuhle-rag",
  tolerance: "ΔE ≤ 0.35",
  station: "berlin-04",
  notes: "",
});

const { validate } = useForm();

onKeyStroke("Escape", () => props.open && emit("close"));

const submitCalibration = async () => {
  if (!(await validate()).valid) {
    await nextTick();
    document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
    return;
  }
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