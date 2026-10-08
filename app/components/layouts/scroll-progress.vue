<template>
  <div
    class="pointer-events-none absolute inset-x-0 bottom-0 h-0.5"
    aria-hidden="true"
  >
    <div
      class="h-full origin-[left_center] bg-accent transition-transform duration-150 ease-out rtl:origin-[right_center]"
      :style="{ transform: `scaleX(${progress})` }"
    />
  </div>
</template>

<script lang="ts" setup>
// Reading progress for the whole page, drawn along the bottom edge of the header.
const { y } = useWindowScroll();
const { height } = useWindowSize();

const progress = computed(() => {
  if (!import.meta.client) return 0;
  const max = document.documentElement.scrollHeight - height.value;
  return max > 0 ? Math.min(1, Math.max(0, y.value / max)) : 0;
});
</script>
