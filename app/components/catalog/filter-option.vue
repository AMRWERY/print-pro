<template>
  <label
    class="group flex cursor-pointer items-center gap-2.5 rounded-control py-1.5 text-sm"
  >
    <input
      type="checkbox"
      class="check"
      :checked="checked"
      @change="emit('change')"
    />
    <span
      class="flex-1 transition-colors duration-200"
      :class="checked ? 'text-paper' : 'text-mute group-hover:text-paper'"
      >{{ label }}</span
    >
    <span v-if="count !== undefined" class="font-mono text-xs text-mute">{{
      count
    }}</span>
  </label>
</template>

<script lang="ts" setup>
defineProps<{ label: string; checked: boolean; count?: number }>();

const emit = defineEmits<{ change: [] }>();
</script>