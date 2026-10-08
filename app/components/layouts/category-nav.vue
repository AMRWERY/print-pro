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
            class="inline-flex h-11 items-center px-3 font-mono text-xs uppercase tracking-wider text-mute transition duration-200 hover:text-paper"
          >
            {{ c.label }}
          </nuxt-link-locale>
        </li>
      </ul>
      <ul
        class="flex items-center gap-5 font-mono text-xs uppercase tracking-wider"
      >
        <li>
          <nuxt-link-locale
            to="/"
            class="inline-flex items-center gap-1.5 text-accent hover:underline"
            ><Icon
              name="lucide:repeat"
              size="14"
              class="icon-spin"
              aria-hidden="true"
            />Trade-in evaluation</nuxt-link-locale
          >
        </li>

        <li>
          <nuxt-link-locale
            to="/"
            class="link-quiet inline-flex items-center gap-1.5"
          >
            <Icon
              name="lucide:swatch-book"
              size="14"
              class="icon-wiggle"
              aria-hidden="true"
            />ICC custom profile</nuxt-link-locale
          >
        </li>
      </ul>
    </div>
  </nav>
</template>

<script lang="ts" setup>
import { categories } from "~/data/home";
</script>
