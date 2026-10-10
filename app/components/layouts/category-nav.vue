<template>
  <nav
    aria-label="Product categories"
    class="hidden border-b border-line bg-ink lg:block"
  >
    <div class="container-page flex items-center justify-between gap-6">
      <ul class="flex items-center">
        <li v-for="c in categories" :key="c.label">
          <nuxt-link-locale
            :to="c.to"
            active-class="!text-accent"
            :class="matchesSearch(c) && '!text-accent'"
            class="inline-flex h-11 items-center px-3 font-mono text-xs uppercase tracking-wider text-mute transition duration-200 hover:text-paper"
          >
            {{ c.label }}
          </nuxt-link-locale>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script lang="ts" setup>
import { categories } from "~/data/home";

const matchesSearch = useCategorySearchMatch();
</script>