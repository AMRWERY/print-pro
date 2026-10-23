<template>
  <header class="space-y-6">
    <div class="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
      <div class="max-w-3xl space-y-3">
        <p class="eyebrow-accent">
          <span class="pip" aria-hidden="true" />Print Lab
          &amp; print service
        </p>
        <h1
          class="font-display text-3xl font-bold tracking-tight text-paper sm:text-4xl lg:text-5xl"
        >
          Print your documents, drawings and posters
        </h1>
        <p class="max-w-2xl text-sm leading-relaxed text-mute sm:text-base">
          Upload your files and configure size, paper, binding and delivery with a
          live price. We print on our wide-format and production machines and
          check every file before it prints.
        </p>
      </div>
      <dl class="shrink-0 space-y-1 font-mono text-xs lg:text-end">
        <div class="flex gap-2 lg:justify-end">
          <dt class="text-mute">Turnaround</dt>
          <dd class="font-semibold text-paper">From 2 working days</dd>
        </div>
        <div class="flex gap-2 lg:justify-end">
          <dt class="text-mute">Sizes</dt>
          <dd class="font-semibold text-paper">A4 to A0 and custom rolls</dd>
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
    title: "Every file checked",
    body: "We check size and resolution before printing",
  },
  {
    icon: "lucide:sun",
    title: "Colour checked",
    body: "Printed colours compared against your file",
  },
  {
    icon: "lucide:target",
    title: "Protected for delivery",
    body: "Rolled or flat-packed, with tracking",
  },
];
</script>