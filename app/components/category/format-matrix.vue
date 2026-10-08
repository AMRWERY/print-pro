<template>
  <section class="section !py-12 md:!py-16" aria-labelledby="matrix-title">
    <div class="container-page space-y-6">
      <section-heading
        id="matrix-title"
        eyebrow="Engineering comparison"
        title="Format decision matrix: 44×33 mm crop vs 53.4×40 mm full 645"
        body="Evaluating the physics of light gathering, diffraction thresholds and strobe sync across professional production workflows."
      />

      <!-- Desktop: a real table -->
      <div
        v-reveal
        class="hidden overflow-hidden rounded-card border border-line md:block"
      >
        <table class="w-full border-collapse text-start text-sm">
          <caption class="sr-only">
            Comparison of the two sensor formats
          </caption>
          <thead class="bg-raised">
            <tr>
              <th scope="col" class="eyebrow p-4 text-start">
                Optical parameter
              </th>
              <th
                v-for="c in columns"
                :key="c"
                scope="col"
                class="p-4 text-start font-display text-base"
              >
                {{ c }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="r in rows"
              :key="r.label"
              class="border-t border-line transition-colors duration-200 hover:bg-raised/60"
            >
              <th scope="row" class="p-4 text-start font-medium text-mute">
                {{ r.label }}
              </th>
              <td v-for="(v, i) in r.values" :key="i" class="p-4 font-mono">
                {{ v }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile: one card per parameter instead of a miniature table -->
      <ul class="space-y-3 md:hidden">
        <li v-for="r in rows" :key="r.label" v-reveal class="card p-4">
          <p class="eyebrow mb-2">{{ r.label }}</p>
          <dl class="space-y-2 text-sm">
            <div
              v-for="(v, i) in r.values"
              :key="i"
              class="flex justify-between gap-4"
            >
              <dt class="text-mute">{{ columns[i] }}</dt>
              <dd class="text-end font-mono">{{ v }}</dd>
            </div>
          </dl>
        </li>
      </ul>
    </div>
  </section>
</template>

<script lang="ts" setup>
defineProps<{
  columns: string[];
  rows: { label: string; values: string[] }[];
}>();
</script>