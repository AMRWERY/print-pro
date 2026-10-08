<template>
  <form role="search" class="relative w-full" @submit.prevent="submit">
    <label for="site-search" class="sr-only"
      >Search cameras, lenses, printers and paper</label
    >
    <Icon
      name="lucide:search"
      size="18"
      class="pointer-events-none absolute inset-y-0 start-3 my-auto text-mute"
      aria-hidden="true"
    />
    <input
      id="site-search"
      v-model="query"
      type="search"
      autocomplete="off"
      placeholder="Search cameras, lenses, printers, paper…"
      class="field ps-10 pe-4"
    />
  </form>
</template>

<script lang="ts" setup>
const query = ref("");
const submit = () => {
  // Search results page is not built yet.
};
</script>