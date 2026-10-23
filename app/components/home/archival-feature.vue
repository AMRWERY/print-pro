<template>
  <section
    class="border-y border-line bg-surface"
    aria-labelledby="archival-title"
  >
    <div
      class="container-page grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-20"
    >
      <media-placeholder
        v-reveal:start
        src="/img/hero-img.png"
        fit="cover"
        label="Technician installing a photocopier in an office"
        size="140"
        class="h-[360px] w-full rounded-panel border border-line sm:h-[440px] lg:h-[520px]"
      />

      <div v-reveal class="space-y-6">
        <div class="space-y-3">
          <p class="eyebrow text-accent">Genuine supplies</p>
          <h2 id="archival-title" class="text-3xl lg:text-5xl">
            Genuine ink and toner, matched to your machine.
          </h2>
          <p class="text-base text-mute">
            Original ink, toner and drum units keep prints sharp and machines
            reliable. Every supply lists the exact models it fits, so you order
            the right one the first time.
          </p>
        </div>

        <div class="grid gap-3 sm:grid-cols-2">
          <article class="card-compact space-y-1 bg-ink">
            <p class="eyebrow">Sealed and genuine</p>
            <h3 class="text-xl">Factory-sealed packaging</h3>
            <p class="text-sm text-mute">
              Never refilled or relabelled. What you receive is what the
              manufacturer packed.
            </p>
          </article>
          <article class="card-compact space-y-1 bg-ink">
            <p class="eyebrow">Matched to your model</p>
            <h3 class="text-xl">Compatibility checked</h3>
            <p class="text-sm text-mute">
              Each product page lists the printers and photocopiers it fits, with
              page yield and cost per page.
            </p>
          </article>
        </div>

        <dl class="grid grid-cols-3 gap-3 border-t border-line pt-5">
          <div v-for="s in specs" :key="s.label">
            <dt class="eyebrow">{{ s.label }}</dt>
            <dd class="font-display text-xl" dir="ltr">{{ s.value }}</dd>
          </div>
        </dl>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
const specs = [
  { label: "Genuine", value: "100 %" },
  { label: "Dispatch", value: "Same day" },
  { label: "Returns", value: "Easy" },
];
</script>