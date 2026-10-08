<template>
  <Transition name="fab">
    <button
      v-if="visible"
      type="button"
      class="btn-icon fixed bottom-5 end-5 z-30 h-11 w-11 bg-surface/90 shadow-lg shadow-black/20 backdrop-blur"
      aria-label="Back to top"
      @click="toTop"
    >
      <Icon
        name="lucide:arrow-up"
        size="18"
        class="icon-lift"
        aria-hidden="true"
      />
    </button>
  </Transition>
</template>

<script lang="ts" setup>
const { y } = useWindowScroll();
const visible = computed(() => y.value > 600);

const toTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
</script>

<style scoped>
.fab-enter-active,
.fab-leave-active {
  transition:
    opacity 0.25s ease-out,
    transform 0.25s ease-out;
}

.fab-enter-from,
.fab-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>