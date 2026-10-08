<template>
  <div class="pb-20 lg:pb-0">
    <div class="container-page space-y-6 py-6 lg:py-8">
      <LazyVBreadcrumb :items="crumbs" />

      <div class="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <product-gallery :key="product.id" :items="detail.gallery" />
      
        <product-buy-box :key="product.id" :product="product" :detail="detail" />
      </div>

      <key-facts :items="detail.keyFacts" />
    </div>

    <feature-trio v-if="detail.feature" :feature="detail.feature" />
  
    <benchmark-table v-if="detail.benchmark" :table="detail.benchmark" />
  
    <spec-groups :groups="detail.specGroups" />
  
    <document-downloads v-if="detail.documents.length" :items="detail.documents" />
  
    <reviews-section v-if="detail.reviews" :reviews="detail.reviews" />

    <section class="border-t border-line py-12 md:py-16" aria-labelledby="qa-title">
      <div class="container-page max-w-3xl space-y-8">
        <LazyVAccordion id="qa-title" eyebrow="Pre-sale support" title="Technical inquiries & lab Q&A" />
     
        <faq-accordion :items="detail.qa" />
      </div>
    </section>

    <related-products v-if="related.length" :items="related" />
    <trust-row />
  </div>
</template>

<script lang="ts" setup>
import { findProduct, getProductDetail } from "~/data/product-details";

const route = useRoute();
const id = computed(() => String(route.params.id));

const found = findProduct(id.value);
if (!found) {
  throw createError({ statusCode: 404, statusMessage: "Product not found", fatal: true });
}

// Same page component is reused when navigating between products.
const product = computed(() => findProduct(id.value) ?? found);
const detail = computed(() => getProductDetail(product.value));
const related = computed(() =>
  detail.value.related.map((rid) => findProduct(rid)).filter((p): p is NonNullable<typeof p> => !!p),
);
const crumbs = computed(() => detail.value.crumbs ?? [{ label: "Index", to: "/" }, { label: product.value.name }]);

useSeoMeta({
  title: () => `${product.value.name} — Lumen & Press`,
  description: () => detail.value.subtitle,
});
</script>
