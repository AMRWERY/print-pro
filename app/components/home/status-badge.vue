<template>
  <span class="badge border" :class="tones[tone]">
    <Icon :name="icon" size="12" aria-hidden="true" />
    {{ label }}
  </span>
</template>

<script lang="ts" setup>
// Status is always icon + text + colour, never colour alone (design.md §5, §22).
defineProps<{
  label: string;
  icon: string;
  tone: "success" | "info" | "warning";
}>();

const tones = {
  success: "border-success/40 bg-success-soft text-success",
  info: "border-cyan/40 bg-cyan-soft text-cyan",
  warning: "border-yellow/40 bg-yellow-soft text-yellow",
};
</script>