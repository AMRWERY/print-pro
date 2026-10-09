<template>
  <section class="border-y border-line bg-surface" aria-labelledby="archival-title">
    <div class="container-page grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-20">
      <media-placeholder v-reveal:start src="/img/hero-img.png" fit="cover" label="Hasselblad medium-format camera on a calibration bench" size="140" class="aspect-[1697/927] w-full rounded-panel border border-line" />
      
      <div v-reveal class="space-y-6">
        <div class="space-y-3">
          <p class="eyebrow text-accent">Modern archival discipline</p>
          <h2 id="archival-title" class="text-3xl lg:text-5xl">Archival Chemistry &amp; Cleanroom Colorimetry.</h2>
          <p class="text-base text-mute">Fine-art galleries demand uncompromised pigment stability. We source pigment formulations and mould-made European papers tested against ozone decay, thermal degradation and lightfast tolerances.</p>
        </div>

        <div class="grid gap-3 sm:grid-cols-2">
          <article class="card space-y-1 bg-ink p-4">
            <p class="eyebrow">Encapsulated pigment</p>
            <h3 class="text-xl">Mineral crystal core</h3>
            <p class="text-sm text-mute">Resin-encapsulated particles mechanically anchored to the fibre for deeper blacks and superior longevity.</p>
          </article>
          <article class="card space-y-1 bg-ink p-4">
            <p class="eyebrow">Custom ICC spectrum</p>
            <h3 class="text-xl">Bench Delta-E &lt; 0.4</h3>
            <p class="text-sm text-mute">Every printer is profiled against a spectrophotometer target before it ships.</p>
          </article>
        </div>

        <dl class="grid grid-cols-3 gap-3 border-t border-line pt-5">
          <div v-for="s in specs" :key="s.label">
            <dt class="eyebrow">{{ s.label }}</dt>
            <dd class="font-display text-xl" dir="ltr">{{ s.value }}</dd>
          </div>
        </dl>

        <LazyVButton variant="primary">Request samples</LazyVButton>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
const specs = [
  { label: 'Lightfastness', value: '200+ yr' },
  { label: 'Color gamut', value: '118 %' },
  { label: 'Black density', value: 'Dmax 2.9' },
]
</script>
