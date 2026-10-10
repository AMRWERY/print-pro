<template>
  <LazyVInput
    type="checkbox"
    :model-value="checked"
    label-class="group items-center rounded-control py-1.5"
    @update:model-value="emit('change')"
  >
    <span class="flex items-center justify-between gap-2">
      <span
        class="transition-colors duration-200"
        :class="checked ? 'text-paper' : 'text-mute group-hover:text-paper'"
        >{{ label }}</span
      >
      <span v-if="count !== undefined" class="meta">{{ count }}</span>
    </span>
  </LazyVInput>
</template>

<script lang="ts" setup>
defineProps<{ label: string; checked: boolean; count?: number }>();

const emit = defineEmits<{ change: [] }>();
</script>