<template>
  <section class="section section-compact" aria-labelledby="spec-title">
    <div class="container-page space-y-8">
      <section-heading
        id="spec-title"
        eyebrow="Specification index"
        title="Comprehensive engineering specifications"
      />
      <div class="grid gap-4 md:grid-cols-2">
        <article
          v-for="(g, i) in groups"
          :key="g.title"
          v-reveal="{ delay: (i % 2) * 80 }"
          class="card p-5"
        >
          <h3 class="mb-3 text-lg">{{ g.title }}</h3>
          <dl class="divide-y divide-line text-sm">
            <div
              v-for="r in g.rows"
              :key="r.label"
              class="flex justify-between gap-4 py-2"
            >
              <dt class="text-mute">{{ r.label }}</dt>
              <dd class="text-end font-mono text-xs" dir="ltr">
                {{ r.value }}
              </dd>
            </div>
          </dl>
        </article>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import type { SpecGroup } from "~/types/product";

defineProps<{ groups: SpecGroup[] }>();
</script>