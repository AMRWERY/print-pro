<template>
  <section class="section section-compact" aria-labelledby="compat-title">
    <div class="container-page space-y-6">
      <section-heading
        id="compat-title"
        eyebrow="Compatibility"
        :title="heading ?? 'Compatible with'"
      />

      <ul class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <li
          v-for="(item, i) in items"
          :key="item"
          v-reveal="{ delay: (i % 3) * 70 }"
          class="card flex items-center gap-3 p-4"
        >
          <Icon
            name="lucide:circle-check"
            size="18"
            class="shrink-0 text-success"
            aria-hidden="true"
          />
          <span class="text-sm font-medium">{{ item }}</span>
        </li>
      </ul>

      <p v-if="yieldNote" class="meta max-w-2xl">{{ yieldNote }}</p>
    </div>
  </section>
</template>

<script lang="ts" setup>
defineProps<{ items: string[]; yieldNote?: string; heading?: string }>();
</script>
