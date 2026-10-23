<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        class="modal-root"
        role="dialog"
        aria-modal="true"
        aria-labelledby="telemetry-modal-title"
      >
        <!-- Backdrop -->
        <div
          class="fixed inset-0 bg-ink/80 backdrop-blur-md transition-opacity"
          @click="$emit('close')"
        />

        <!-- Dialog Window -->
        <div
          class="relative w-full max-w-2xl overflow-hidden rounded-panel border border-accent/40 bg-surface shadow-2xl shadow-black/60 text-sm"
        >
          <div class="modal-head">
            <div class="flex items-center gap-2.5">
              <span class="relative flex h-2.5 w-2.5">
                <span class="ping-ring" />
                <span
                  class="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent"
                />
              </span>
              <h2
                id="telemetry-modal-title"
                class="font-bold tracking-wider text-accent text-sm"
              >
                Delivery tracking · {{ order?.id ?? "Order" }}
              </h2>
            </div>

            <LazyVButton
              variant="plain"
              class="rounded-control p-1 text-mute transition hover:bg-raised hover:text-paper"
              aria-label="Close delivery tracking"
              @click="$emit('close')"
            >
              <Icon name="lucide:x" size="18" />
            </LazyVButton>
          </div>

          <div class="max-h-[80vh] overflow-y-auto p-5 sm:p-6 space-y-6">
            <!-- Courier strip -->
            <div
              class="flex flex-wrap items-center justify-between gap-3 rounded-control border border-line bg-ink/50 p-3"
            >
              <div>
                <p class="eyebrow text-mute">Courier</p>
                <p class="title-sm">
                  {{ order?.badgeLabel ?? "Insured courier delivery" }}
                </p>
                <p class="text-xs text-mute">
                  Tracking number:
                  <span class="text-paper" dir="ltr">{{
                    order?.waybill ?? "Pending"
                  }}</span>
                </p>
              </div>
              <div class="text-end">
                <span
                  class="inline-flex items-center gap-1.5 rounded-control bg-success-soft px-2 py-1 text-xs font-semibold text-success"
                >
                  <Icon name="lucide:truck" size="13" aria-hidden="true" />
                  {{ order?.statusLabel ?? "On the way" }}
                </span>
                <p class="mt-1 text-xs text-mute">
                  Delivering to {{ order?.destination ?? "your address" }}
                </p>
              </div>
            </div>

            <!-- Progress -->
            <div class="space-y-2">
              <p class="eyebrow text-mute">Delivery progress</p>
              <ol class="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <li
                  v-for="(s, i) in steps"
                  :key="s.label"
                  class="rounded-control border p-3"
                  :class="
                    i < current
                      ? 'border-success/40 bg-success-soft'
                      : i === current
                        ? 'border-accent/60 bg-accent-soft'
                        : 'border-line bg-ink/40'
                  "
                  :aria-current="i === current ? 'step' : undefined"
                >
                  <Icon
                    :name="i < current ? 'lucide:check-circle' : s.icon"
                    size="14"
                    :class="
                      i < current
                        ? 'text-success'
                        : i === current
                          ? 'text-accent'
                          : 'text-mute'
                    "
                    aria-hidden="true"
                  />
                  <p class="mt-1.5 font-semibold text-paper">{{ s.label }}</p>
                  <p class="text-xs text-mute">{{ s.note }}</p>
                </li>
              </ol>
            </div>

            <!-- Handover notes -->
            <div class="space-y-2 rounded-control border border-line bg-ink/40 p-4">
              <p class="flex items-center gap-1.5 font-semibold text-paper">
                <Icon
                  name="lucide:shield-check"
                  size="14"
                  class="text-success"
                  aria-hidden="true"
                />
                On delivery
              </p>
              <ul class="list-disc space-y-1 ps-5 text-xs text-mute">
                <li>Someone must be present to sign for the delivery.</li>
                <li>
                  Check the packaging before signing and note any damage on the
                  delivery receipt.
                </li>
                <li>Photocopiers and large printers are installed by a technician.</li>
              </ul>
            </div>
          </div>

          <div
            class="flex items-center justify-between gap-3 border-t border-line px-5 py-3"
          >
            <span class="text-xs text-mute">Need help? support@printpro.com</span>
            <LazyVButton variant="secondary" @click="$emit('close')"
              >Close</LazyVButton
            >
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
import type { RequisitionOrder } from "~/types/account";

const props = defineProps<{
  open: boolean;
  order?: RequisitionOrder | null;
}>();

defineEmits<{
  (e: "close"): void;
}>();

const steps = [
  { label: "Order confirmed", note: "We have your order", icon: "lucide:clipboard-check" },
  { label: "Packed", note: "Checked and sealed", icon: "lucide:package" },
  { label: "On the way", note: "With the courier", icon: "lucide:truck" },
  { label: "Delivered", note: "Signed for", icon: "lucide:home" },
];

// Where the order is in the steps above.
const current = computed(() => {
  const status = props.order?.status;
  if (status === "delivered" || status === "archived") return 3;
  if (status === "in-transit") return 2;
  return 1;
});
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
