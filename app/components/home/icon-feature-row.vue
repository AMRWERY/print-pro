<template>
  <ul class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
    <li v-for="i in items" :key="i.title" class="flex gap-3">
      <span class="grid h-10 w-10 shrink-0 place-items-center rounded-control border border-line text-accent" aria-hidden="true">
        <Icon :name="i.icon" size="20" />
      </span>
      <div>
        <h3 class="text-base font-semibold">{{ i.title }}</h3>
        <p class="mt-1 text-sm text-mute">{{ i.body }}</p>
      </div>
    </li>
  </ul>
</template>

<script lang="ts" setup>
defineProps<{ items: { icon: string; title: string; body: string }[] }>()
</script>
