<template>
  <div class="card flex flex-col items-center gap-4 px-6 py-16 text-center">
    <span
      class="grid h-14 w-14 place-items-center rounded-full border border-line text-mute"
      aria-hidden="true"
    >
      <Icon name="lucide:search-x" size="26" />
    </span>
    <div class="space-y-1">
      <h2 class="font-display text-xl">
        No instruments match these constraints
      </h2>
      <p class="max-w-md text-sm text-mute">
        Try removing a filter or widening the price range. Can’t find a specific
        model? Our bench team can source it.
      </p>
    </div>

    <div class="flex flex-wrap justify-center gap-3">
      <button type="button" class="btn-accent" @click="catalog.reset()">
        Reset all filters
      </button>

      <nuxt-link-locale to="/" class="btn-ghost"
        >Request a sourcing quote</nuxt-link-locale
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
const catalog = useCatalog();
</script>