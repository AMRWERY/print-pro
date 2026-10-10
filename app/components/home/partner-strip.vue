<template>
  <section
    class="border-b border-line bg-surface"
    aria-label="Direct manufacturer partners"
  >
    <div
      v-reveal:fade
      class="container-page flex flex-col gap-4 py-6 lg:flex-row lg:items-center lg:gap-10"
    >
      <p class="eyebrow shrink-0">Direct manufacturer partners</p>

      <!-- Infinite carousel. Fades out at both edges; pauses on hover / keyboard focus. -->
      <div
        class="min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)] motion-reduce:overflow-x-auto motion-reduce:[mask-image:none]"
      >
        <div
          class="flex w-max animate-marquee hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] motion-reduce:animate-none"
        >
          <!-- Two identical halves; the second is hidden from assistive tech. -->
          <ul
            v-for="copy in 2"
            :key="copy"
            class="flex shrink-0 items-center gap-10 pe-10 font-display text-base font-semibold tracking-wider text-mute"
            :aria-hidden="copy === 2 ? true : undefined"
            :aria-label="copy === 1 ? 'Partners' : undefined"
          >
            <li
              v-for="(p, i) in loop"
              :key="`${p}-${i}`"
              class="whitespace-nowrap transition-colors duration-200 hover:text-paper"
            >
              {{ p }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { partners } from "~/data/home";

// Repeated so one half is always wider than the strip, even on large screens.
const loop = [...partners, ...partners];
</script>