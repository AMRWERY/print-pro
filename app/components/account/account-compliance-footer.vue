<template>
  <footer class="rounded-card border border-line bg-surface p-6 font-mono text-xs text-mute space-y-6"
    aria-label="Atelier technical compliance standards">
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="sec in sections" :key="sec.title" class="space-y-1.5 border-s border-line ps-3">
        <h3 class="flex items-center gap-1.5 font-bold uppercase tracking-wider text-paper text-[11px]">
          <span class="h-2 w-2 bg-accent" aria-hidden="true" />
          {{ sec.title }}
        </h3>
        <p class="font-sans text-xs leading-relaxed text-mute">
          {{ sec.body }}
        </p>
        <p class="text-[10px] text-accent font-semibold pt-1">
          {{ sec.code }}
        </p>
      </div>
    </div>

    <div class="flex flex-wrap items-center justify-between gap-3 border-t border-line/60 pt-4 text-[11px]">
      <span>
        &copy; 2026 LUMEN &amp; PRESS METROLOGY WORKS. SWISS CALIBRATION ACCREDITATION
      </span>
      <span class="flex items-center gap-1.5 text-success">
        <span class="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
        SYSTEM PRECISION ONLINE
      </span>
    </div>
  </footer>
</template>

<script lang="ts" setup>
import { complianceSections } from "~/data/account";

const sections = complianceSections;
</script>