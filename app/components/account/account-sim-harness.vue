<template>
  <aside class="border-b border-line bg-ink/95 px-4 py-2.5 backdrop-blur transition-colors duration-200"
    aria-label="Atelier simulation harness">
    <div class="container-page flex flex-wrap items-center justify-between gap-3 text-xs">
      <div class="flex flex-wrap items-center gap-2 font-mono">
        <span class="inline-flex items-center gap-1.5 font-bold tracking-wider text-accent">
          <span class="relative flex h-2 w-2">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span class="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          ATELIER SIM HARNESS // SELECT OPERATING MODE:
        </span>
      </div>

      <div class="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Operating modes">
        <LazyVButton variant="plain" v-for="m in modes" :key="m.id" role="tab" :aria-selected="modelValue === m.id"
          class="inline-flex items-center gap-1.5 rounded-control px-2.5 py-1 font-mono text-[11px] font-medium tracking-wider transition duration-150"
          :class="modelValue === m.id
              ? 'bg-accent text-onaccent shadow-sm'
              : 'border border-line bg-surface text-mute hover:border-accent/40 hover:text-paper'
            " @click="$emit('update:modelValue', m.id)">
          <Icon :name="m.icon" size="13" aria-hidden="true" />
          <span>{{ m.label }}</span>
        </LazyVButton>
      </div>

      <!-- Quick theme & view indicator -->
      <div class="hidden items-center gap-3 font-mono text-[11px] text-mute xl:flex">
        <span class="flex items-center gap-1.5">
          <span class="h-1.5 w-1.5 rounded-full bg-success" />
          ISO 5 BENCH ACTIVE
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

defineProps<{
  modelValue: OperatingMode;
}>();

defineEmits<{
  (e: "update:modelValue", value: OperatingMode): void;
}>();

const modes = [
  {
    id: "standard" as OperatingMode,
    label: "[STANDARD ATELIER MODE]",
    icon: "lucide:sliders-horizontal",
  },
  {
    id: "high-volume" as OperatingMode,
    label: "[HIGH-VOLUME ORDERS (44)]",
    icon: "lucide:layers",
  },
  {
    id: "new-member" as OperatingMode,
    label: "[NEW STUDIO MEMBER]",
    icon: "lucide:user-plus",
  },
  {
    id: "vip-escrow" as OperatingMode,
    label: "[VIP CONSIGNMENT ESCROW ACTIVE]",
    icon: "lucide:lock",
  },
];
</script>