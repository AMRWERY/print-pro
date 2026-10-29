<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        class="modal-root"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dossier-modal-title"
      >
        <div
          class="fixed inset-0 bg-ink/80 backdrop-blur-md transition-opacity"
          @click="$emit('close')"
        />

        <div
          class="relative w-full max-w-2xl overflow-hidden rounded-panel border border-line bg-surface shadow-2xl shadow-black/60 font-mono text-xs"
        >
          <div class="modal-head">
            <div class="flex items-center gap-2">
              <span class="pip rounded-full" />
              <h2
                id="dossier-modal-title"
                class="font-bold tracking-wider text-paper text-sm"
              >
                {{ title || t("account.order_document") }}
              </h2>
            </div>
            <LazyVButton
              variant="plain"
              class="rounded-control p-1 text-mute transition hover:bg-raised hover:text-paper"
              aria-label="Close modal"
              @click="$emit('close')"
            >
              <Icon name="lucide:x" size="18" />
            </LazyVButton>
          </div>

          <div class="max-h-[75vh] overflow-y-auto p-6 space-y-5">
            <!-- Dossier Header Block -->
            <div
              class="border-b border-line pb-4 flex flex-wrap items-start justify-between gap-4"
            >
              <div>
                <p class="title-md">PRINTPRO</p>
                <p class="text-1xs text-mute mt-0.5">
                  {{ t("account.sales_service") }} // support@printpro.com
                </p>
                <p class="text-1xs text-accent mt-1">
                  {{ t("account.issued_to") }}: Amr Mohamed
                </p>
              </div>

              <div class="text-end">
                <span
                  class="rounded border border-line bg-ink px-2.5 py-1 text-mute text-2xs"
                >
                  {{ t("account.reference") }} PP-2026-CAI
                </span>
                <p class="text-1xs text-mute mt-1">
                  {{ t("account.date") }}: 28 OCT 2026
                </p>
              </div>
            </div>

            <!-- Content preview -->
            <div class="space-y-3 font-sans text-xs text-mute leading-relaxed">
              <p>
                {{
                  t(
                    "account.this_document_is_the_official_record_of_your_order_its_delivery_and_any_service_work_carried_out_under_your_business_account",
                  )
                }}
              </p>

              <div
                class="rounded-control border border-line bg-ink/40 p-4 font-mono text-xs space-y-2"
              >
                <div
                  class="flex justify-between border-b border-line/40 pb-1.5 text-paper font-bold"
                >
                  <span>{{ t("account.check") }}</span>
                  <span>{{ t("account.result") }}</span>
                </div>
                <div class="flex justify-between text-1xs">
                  <span>{{ t("account.pre_dispatch_test") }}</span>
                  <span class="text-success font-semibold">{{
                    t("account.passed")
                  }}</span>
                </div>
                <div class="flex justify-between text-1xs">
                  <span>{{ t("account.test_page_quality") }}</span>
                  <span class="text-success font-semibold">{{
                    t("account.passed")
                  }}</span>
                </div>
                <div class="flex justify-between text-1xs">
                  <span>{{ t("account.packaging_condition") }}</span>
                  <span class="text-paper">{{ t("account.sealed") }}</span>
                </div>
                <div class="flex justify-between text-1xs">
                  <span>{{ t("account.delivery_condition") }}</span>
                  <span class="text-success font-semibold">{{
                    t("account.no_damage_reported")
                  }}</span>
                </div>
              </div>

              <p>{{ t("account.document_reference") }}</p>
              <p
                class="rounded-control bg-ink/70 p-2 font-mono text-1xs text-accent break-all"
              >
                PP-DOC-2026-0001
              </p>
            </div>
          </div>

          <div class="modal-foot">
            <span class="text-mute text-1xs">{{
              t("account.issued_by_our_customer_service")
            }}</span>
            <div class="flex items-center gap-2">
              <LazyVButton
                variant="plain"
                class="rounded-control border border-line px-4 py-1.5 font-bold text-mute hover:text-paper"
                @click="$emit('close')"
              >
                {{ t("btn.close") }}
              </LazyVButton>

              <LazyVButton
                variant="plain"
                class="inline-flex items-center gap-1.5 rounded-control bg-accent px-4 py-1.5 font-bold text-onaccent hover:brightness-110 active:scale-95"
                @click="printDoc"
              >
                <Icon name="lucide:printer" size="13" />
                {{ t("btn.print_export") }} PDF
              </LazyVButton>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
const { t } = useI18n();

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