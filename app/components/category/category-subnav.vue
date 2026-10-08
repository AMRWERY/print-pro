<template>
  <nav aria-label="Product categories" class="border-b border-line">
    <ul
      class="container-page flex gap-1 overflow-x-auto py-2 [scrollbar-width:none]"
    >
      <li v-for="t in tabs" :key="t.label" class="shrink-0">
        <nuxt-link-locale
          :to="t.to"
          class="inline-flex h-9 items-center rounded-control px-3 font-mono text-xs uppercase tracking-wider transition duration-200"
          :class="
            t.active
              ? 'bg-accent text-onaccent'
              : 'text-mute hover:bg-raised hover:text-paper'
          "
          :aria-current="t.active ? 'page' : undefined"
        >
          {{ t.label }}
        </nuxt-link-locale>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts" setup>
defineProps<{
  tabs: {
    label: string;
    to: string;
    active?: boolean;
  }[];
}>();
</script>