<template>
  <aside
    class="border-b border-line bg-ink/95 px-4 py-2.5 backdrop-blur transition-colors duration-200"
    aria-label="Demo account switcher"
  >
    <div
      class="container-page flex flex-wrap items-center justify-between gap-3 text-xs"
    >
      <div class="flex flex-wrap items-center gap-2 font-mono">
        <span
          class="inline-flex items-center gap-1.5 font-bold tracking-wider text-accent"
        >
          <span class="relative flex h-2 w-2">
            <span class="ping-ring" />
            <span class="relative inline-flex pip rounded-full" />
          </span>
          DEMO ACCOUNT // SELECT ACCOUNT TYPE:
        </span>
      </div>

      <div
        class="flex flex-wrap items-center gap-1.5"
        role="tablist"
        aria-label="Account types"
      >
        <LazyVButton
          variant="plain"
          v-for="m in modes"
          :key="m.id"
          role="tab"
          :aria-selected="modelValue === m.id"
          class="inline-flex items-center gap-1.5 rounded-control px-2.5 py-1 font-mono text-1xs font-medium tracking-wider transition duration-150"
          :class="
            modelValue === m.id
              ? 'bg-accent text-onaccent shadow-sm'
              : 'border border-line bg-surface text-mute hover:border-accent/40 hover:text-paper'
          "
          @click="$emit('update:modelValue', m.id)"
        >
          <Icon :name="m.icon" size="13" aria-hidden="true" />
          <span>{{ m.label }}</span>
        </LazyVButton>
      </div>

      <!-- Quick theme & view indicator -->
      <div
        class="hidden items-center gap-3 font-mono text-1xs text-mute xl:flex"
      >
        <span class="flex items-center gap-1.5">
          <span class="h-1.5 w-1.5 rounded-full bg-success" />
          DEMO MODE
        </span>
        <span class="text-line">|</span>
        <span class="flex items-center gap-1.5">
          <Icon name="lucide:shield-check" size="13" class="text-cyan" />
          256-BIT CRYPTO SIGN
        </span>
      </div>
    </div>
  </aside>
</template>

<script lang="ts" setup>
import type { OperatingMode } from "~/types/account";

const { t } = useI18n();

defineProps<{
  modelValue: OperatingMode;
}>();

defineEmits<{
  (e: "update:modelValue", value: OperatingMode): void;
}>();

const modes = [
  {
    id: "standard" as OperatingMode,
    label: t("btn.standard_account"),
    icon: "lucide:sliders-horizontal",
  },
  {
    id: "high-volume" as OperatingMode,
    label: t("btn.high_volume_orders"),
    icon: "lucide:layers",
  },
  {
    id: "new-member" as OperatingMode,
    label: t("btn.new_customer"),
    icon: "lucide:user-plus",
  },
  {
    id: "vip-escrow" as OperatingMode,
    label: t("btn.business_credit_active"),
    icon: "lucide:lock",
  },
];
</script>