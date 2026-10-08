<template>
  <div>
    <nav class="container-page pt-4" aria-label="Breadcrumb">
      <ol class="flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-wider text-mute">
        <li><nuxt-link-locale to="/" class="hover:text-paper">Index</nuxt-link-locale></li>
        <li aria-hidden="true">/</li>
        <li><nuxt-link-locale to="/products" class="hover:text-paper">Optical systems</nuxt-link-locale></li>
        <li aria-hidden="true">/</li>
        <li aria-current="page" class="text-accent">Cameras &amp; digital backs</li>
      </ol>
    </nav>

    <category-hero
      eyebrow="100 MP+ · 16-bit natural colour"
      title="Cameras & Digital Backs"
      description="Calibrated medium-format systems, 16-bit colour engines and cinema sensor platforms, engineered for commercial shoots, cultural archiving and fine-art reproduction."
      :stats="cameraStats"
    >
      <template #actions>
        <button type="button" class="btn-accent" @click="scrollToInventory">
          Explore {{ inventory.total }} systems
          <Icon name="lucide:arrow-down" size="16" class="icon-bob" aria-hidden="true" />
        </button>

        <button type="button" class="btn-ghost">Camera system guide 2026</button>
      
        <nuxt-link-locale to="/" class="link-quiet inline-flex items-center gap-1.5 px-1 text-sm">
          <Icon name="lucide:calendar-clock" size="16" class="icon-wiggle" aria-hidden="true" />
          Book a consultation
        </nuxt-link-locale>
      </template>
    </category-hero>

    <subcategory-grid :items="subcategories" @select="pickSub" />
  
    <brand-strip label="Authorized system brands" :brands="authorizedBrands" />
  
    <flagship-showcase :items="flagships" />

    <trade-in-banner
      title="Step up to 100MP with up to $2,500 instant trade credit"
      body="Bring your current body or back. Get an optical benchmark and trade value on the spot."
      primary="Appraise my kit"
      secondary="Trade terms"
    />

    <inventory-section />

    <format-matrix :columns="matrix.columns" :rows="matrix.rows" />

    <section class="pb-12 md:pb-16" aria-labelledby="usecase-title">
      <div class="container-page space-y-8">
        <section-heading id="usecase-title" eyebrow="Workflow fit" title="Which system for which job" />
       
        <use-case-grid :items="useCases" />
      </div>
    </section>

    <section class="border-t border-line py-12 md:py-16" aria-labelledby="faq-title">
      <div class="container-page max-w-3xl space-y-8">
        <section-heading id="faq-title" eyebrow="Laboratory dispatch standards" title="Technical clarifications & protocols" />
      
        <faq-accordion :items="faqs" />
      </div>
    </section>

    <trust-row />
  </div>
</template>

<script lang="ts" setup>
import type { CameraSub } from "~/types/cameras";
import {
  authorizedBrands,
  cameraProducts,
  cameraStats,
  categoryTabs,
  faqs,
  flagships,
  matrix,
  subcategories,
  useCases,
} from "~/data/cameras";

const inventory = provideCameraInventory(cameraProducts);

const scrollToInventory = () =>
  document.getElementById("inventory")?.scrollIntoView({ behavior: "smooth", block: "start" });

const pickSub = (key: CameraSub) => {
  inventory.setSub(key);
  scrollToInventory();
};

useSeoMeta({
  title: "Cameras & Digital Backs — Lumen & Press",
  description:
    "Calibrated medium-format cameras, digital backs and cinema platforms, bench-verified before dispatch.",
});
</script>
