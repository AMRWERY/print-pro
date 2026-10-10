<template>
  <section class="rounded-card border border-line bg-surface p-4" aria-labelledby="proof-title">
    <header class="mb-3 flex items-center justify-between gap-2">
      <h2 id="proof-title" class="eyebrow text-mute">Metrological soft-proof simulator</h2>
      <span class="rounded-control border border-accent/40 bg-accent-soft px-2 py-0.5 font-mono text-[10px] font-bold text-accent">D50 5000K</span>
    </header>

    <!-- A dark mount board with the print floating in it, drawn at the chosen proportions -->
    <div class="grid aspect-[4/5] place-items-center rounded-control bg-[#15171d] p-6">
      <div class="max-h-full max-w-full bg-white p-2 shadow-2xl shadow-black/60 transition-all duration-300 motion-reduce:transition-none" :style="{ aspectRatio: ratio, height: tall ? '100%' : 'auto', width: tall ? 'auto' : '100%' }">
        <img :src="previewUrl || sample" :alt="previewUrl ? 'Soft-proof of your uploaded image' : 'Sample artwork, shown until you upload a file'" class="h-full w-full object-cover transition-[filter] duration-300 motion-reduce:transition-none" :style="{ filter: paper.tint }" />
      </div>
    </div>
    <p class="mt-3 font-mono text-[11px] leading-relaxed text-mute">
      {{ caption }}<span v-if="!previewUrl"> · sample artwork</span>
    </p>
  </section>
</template>

<script lang="ts" setup>
const { config, previewUrl, paper, price } = usePrintConfig();

const sample = "/img/hero-img.png";

const ratio = computed(() => {
  const { w, h } = price.value.size;
  return w > 0 && h > 0 ? `${w} / ${h}` : "2 / 3";
});
const tall = computed(() => price.value.size.h >= price.value.size.w);

const caption = computed(() => {
  const { w, h } = price.value.size;
  return `${w}″ × ${h}″ · ${paper.value.name} · ${config.ink === "mono" ? "Piezography" : "PRO12"} · ${config.duplex === "double" ? "double" : "single"}-sided`;
});
</script>
