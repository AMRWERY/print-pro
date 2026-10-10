<template>
  <section class="border-b border-line py-4 last:border-b-0">
    <h3>
      <LazyVButton variant="plain" block
        class="eyebrow flex items-center justify-between gap-2 !text-paper"
        :aria-expanded="open"
        :aria-controls="id"
        @click="open = !open"
      >
        {{ title }}
        <Icon
          name="lucide:chevron-down"
          size="14"
          class="transition-transform duration-200"
          :class="open && 'rotate-180'"
          aria-hidden="true"
        />
      </LazyVButton>
    </h3>
    <div
      :id="id"
      class="collapse-grid"
      :class="open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
      :inert="!open"
    >
      <div class="overflow-hidden">
        <div class="pt-3"><slot /></div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{ title: string; defaultOpen?: boolean }>(),
  {
    defaultOpen: true,
  },
);

const open = ref(props.defaultOpen);
const id = useId();
</script>