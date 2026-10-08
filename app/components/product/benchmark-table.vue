<template>
  <section class="pb-12 md:pb-16" aria-labelledby="bench-title">
    <div class="container-page space-y-4">
      <div v-reveal>
        <h2 id="bench-title" class="text-2xl">{{ table.title }}</h2>
        <p class="text-sm text-mute">{{ table.note }}</p>
      </div>

      <div
        v-reveal
        class="hidden overflow-hidden rounded-card border border-line md:block"
      >
        <table class="w-full border-collapse text-sm">
          <caption class="sr-only">
            {{
              table.title
            }}
          </caption>
          <thead class="bg-raised">
            <tr>
              <th
                v-for="c in table.columns"
                :key="c"
                scope="col"
                class="eyebrow p-3 text-start"
              >
                {{ c }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="r in table.rows"
              :key="r[0]"
              class="border-t border-line transition-colors duration-200 hover:bg-raised/60"
            >
              <th scope="row" class="p-3 text-start font-medium">{{ r[0] }}</th>
              <td
                v-for="(v, i) in r.slice(1)"
                :key="i"
                class="p-3 font-mono text-xs"
              >
                {{ v }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <ul class="space-y-3 md:hidden">
        <li v-for="r in table.rows" :key="r[0]" v-reveal class="card p-4">
          <p class="mb-2 font-medium">{{ r[0] }}</p>
          <dl class="space-y-1.5 text-sm">
            <div
              v-for="(v, i) in r.slice(1)"
              :key="i"
              class="flex justify-between gap-4"
            >
              <dt class="text-mute">{{ table.columns[i + 1] }}</dt>
              <dd class="text-end font-mono text-xs">{{ v }}</dd>
            </div>
          </dl>
        </li>
      </ul>
    </div>
  </section>
</template>

<script lang="ts" setup>
import type { ProductDetail } from "~/types/product";

defineProps<{ table: NonNullable<ProductDetail["benchmark"]> }>();
</script>