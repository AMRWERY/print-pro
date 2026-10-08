<template>
  <div class="flex min-h-screen flex-col">
    <a href="#main" class="sr-only z-50 rounded-control bg-accent px-4 py-2 text-onaccent focus:not-sr-only focus:absolute focus:start-4 focus:top-4">Skip to content</a>
    <announcement-bar />

    <site-header />

    <main id="main" class="flex-1">
      <slot />
    </main>

    <site-footer />
  </div>
</template>

<script lang="ts" setup>

</script>