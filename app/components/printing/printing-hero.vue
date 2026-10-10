<template>
  <header class="space-y-6">
    <div class="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
      <div class="max-w-3xl space-y-3">
        <p class="eyebrow-accent">
          <span class="pip" aria-hidden="true" />Optical metrology
          &amp; print lab
        </p>
        <h1
          class="font-display text-3xl font-bold tracking-tight text-paper sm:text-4xl lg:text-5xl"
        >
          Curatorial Archival Printing &amp; Metrology Configurator
        </h1>
        <p class="max-w-2xl text-sm leading-relaxed text-mute sm:text-base">
          Configure museum-grade pigment prints, exhibition proofs and bespoke
          bound folios. Certified 12-colour UltraChrome PRO12 ink sets with DIN
          ISO 12647-7 colorimetric verification.
        </p>
      </div>
      <dl class="shrink-0 space-y-1 font-mono text-xs lg:text-end">
        <div class="flex gap-2 lg:justify-end">
          <dt class="text-mute">Calibration standard</dt>
          <dd class="font-semibold text-paper">ISO 12647-7</dd>
        </div>
        <div class="flex gap-2 lg:justify-end">
          <dt class="text-mute">Lab temp · RH</dt>
          <dd class="font-semibold text-paper">20.8 °C · 48% ±1%</dd>
        </div>
      </dl>
    </div>

    <ul class="grid gap-3 md:grid-cols-3">
      <li
        v-for="t in trust"
        :key="t.title"
        class="flex items-start gap-3 card-compact"
      >
        <Icon
          :name="t.icon"
          size="18"
          class="bullet-icon"
          aria-hidden="true"
        />
        <div>
          <p class="font-mono text-2xs tracking-wider text-mute">
            {{ t.title }}
          </p>
          <p class="mt-0.5 text-sm text-paper">{{ t.body }}</p>
        </div>
      </li>
    </ul>
  </header>
</template>

<script lang="ts" setup>
const trust = [
  {
    icon: "lucide:shield-check",
    title: "Wilhelm Imaging tested",
    body: "200+ year museum dark-storage longevity",
  },
  {
    icon: "lucide:sun",
    title: "D50 daylight inspection",
    body: "5000K calibrated metrology light tables",
  },
  {
    icon: "lucide:target",
    title: "ICC ΔE < 0.5 tolerance",
    body: "Spectrophotometric X-Rite i1Pro3 profiling",
  },
];
</script>