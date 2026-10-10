<template>
  <div class="border-b border-line bg-surface text-xs text-mute">
    <div class="container-page flex items-center justify-between gap-4 py-2">
      <ul
        class="flex min-w-0 items-center gap-6 overflow-x-auto whitespace-nowrap font-mono tracking-wider [scrollbar-width:none]"
      >
        <li
          v-for="(item, i) in promoItems"
          :key="item"
          :class="i > 0 && 'hidden md:list-item'"
        >
          {{ item }}
        </li>
      </ul>
      <a
        href="tel:+18004125866"
        dir="ltr"
        class="hidden shrink-0 items-center gap-1.5 font-mono transition duration-200 hover:text-paper lg:inline-flex"
      >
        <Icon
          name="lucide:phone"
          size="14"
          class="icon-wiggle"
          aria-hidden="true"
        />
        Concierge +1 (800) 412-5866
      </a>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { promoItems } from "~/data/home";
</script>