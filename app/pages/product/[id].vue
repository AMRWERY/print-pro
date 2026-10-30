<template>
  <div v-if="product && detail" class="pb-20 lg:pb-0">
      <div class="container-page page-stack">
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
    
      <compatibility-list
        v-if="detail.compatibleWith?.length"
        :items="detail.compatibleWith"
        :yield-note="detail.yieldNote"
        :heading="product.group === 'ink' ? 'Compatible with' : 'Compatible supplies'"
      />

      <reviews-section :key="product.id" :product-id="product.id" :reviews="detail.reviews" />

      <section class="border-t border-line py-12 md:py-16" aria-labelledby="qa-title">
        <div class="container-page max-w-3xl space-y-8">
          <LazyVAccordion id="qa-title" eyebrow="Pre-sale support" title="Questions & answers" />
       
          <faq-accordion :items="detail.qa" />
        </div>
      </section>

      <related-products v-if="related.length" :items="related" />
      <trust-row />
  </div>

  <div v-else class="container-page page-stack" aria-busy="true">
    <LazyVSkeletonLoader variant="line" class="!h-3 w-1/3" />
    <product-details-skeleton-loader />
  </div>
</template>

<script lang="ts" setup>
const route = useRoute();
const id = computed(() => String(route.params.id));

const catalog = useCatalogStore();

const notFound = (id: string) =>
  createError({
    statusCode: catalog.productState(id).code || 404,
    statusMessage: "Product not found",
    fatal: true,
  });

// Same page component is reused when navigating between products; the id is reactive so it reloads.
// Called before any await, so on the server the visitor's request context is available.
const first = catalog.loadProduct(id.value);
if (import.meta.server) {
  // Wait on the server so the HTML has the product (and a missing one is a real 404).
  if (!(await first)) throw notFound(id.value);
}

watch(id, (next) => {
  catalog.loadProduct(next);
});
// On the client a failed load (hidden or unknown product) ends in the error page.
watch(
  () => catalog.productState(id.value).status,
  (status) => {
    if (status === "error") showError(notFound(id.value));
  },
  { immediate: import.meta.client },
);

const page = computed(() => catalog.productPage(id.value));
const product = computed(() => page.value?.product);
const detail = computed(() => page.value?.detail);
const related = computed(() => page.value?.related ?? []);
const crumbs = computed(
  () =>
    detail.value?.crumbs ?? [
      { label: "Index", to: "/" },
      { label: product.value?.name ?? "Product" },
    ],
);

useSeoMeta({
  title: () => product.value?.name ?? "Product",
  description: () => detail.value?.subtitle,
});
</script>
