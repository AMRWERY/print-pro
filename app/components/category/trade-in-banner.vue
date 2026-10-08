<template>
  <section
    aria-labelledby="tradein-title"
    class="border-y border-accent/30 bg-accent-soft"
  >
    <div
      v-reveal:fade
      class="container-page flex flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between"
    >
      <div class="flex items-start gap-4">
        <span
          class="grid h-11 w-11 shrink-0 place-items-center rounded-control border border-accent/50 text-accent"
          aria-hidden="true"
        >
          <Icon name="lucide:repeat" size="22" class="icon-spin" />
        </span>
        <div>
          <h2 id="tradein-title" class="text-xl">{{ title }}</h2>
          <p class="text-sm text-mute">{{ body }}</p>
        </div>
      </div>
      <div class="flex flex-wrap gap-3">
        <button type="button" class="btn-accent">{{ primary }}</button>
        <button type="button" class="btn-ghost">{{ secondary }}</button>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
defineProps<{
  title: string;
  body: string;
  primary: string;
  secondary: string;
}>();
</script>