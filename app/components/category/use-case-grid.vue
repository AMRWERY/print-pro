<template>
  <ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <li v-for="(u, i) in items" :key="u.title" v-reveal="{ delay: i * 80 }">
      <article
        class="group card h-full space-y-3 p-5 transition duration-200 hover:border-mute/50"
      >
        <span
          class="grid h-10 w-10 place-items-center rounded-control border border-line text-accent"
          aria-hidden="true"
        >
          <Icon :name="u.icon" size="20" class="icon-lift" />
        </span>
        <h3 class="text-lg">{{ u.title }}</h3>
        <p class="text-sm text-mute">{{ u.body }}</p>
      </article>
    </li>
  </ul>
</template>

<script lang="ts" setup>
defineProps<{ items: { title: string; body: string; icon: string }[] }>();
</script>