<template>
  <section aria-labelledby="promo-title" class="border-y border-accent/30 bg-accent-soft">
    <div v-reveal:fade class="container-page flex flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between">
      <div class="flex items-start gap-4">
        <span class="grid h-11 w-11 shrink-0 place-items-center rounded-control border border-accent/50 text-accent" aria-hidden="true">
          <Icon name="lucide:badge-percent" size="22" />
        </span>
        <div>
          <h2 id="promo-title" class="text-xl">End-of-quarter studio upgrade program</h2>
          <p class="text-sm text-mute">Up to $2,500 in manufacturer print rebates on qualifying medium-format and 44" Canon &amp; Epson pigment systems.</p>
        </div>
      </div>
      <div class="flex flex-wrap gap-3">
        <LazyVButton variant="secondary">Calculate rebate</LazyVButton>
        <LazyVButton variant="primary">Claim print rebate</LazyVButton>
      </div>
    </div>
  </section>
</template>
