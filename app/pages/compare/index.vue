<template>
  <div>
    <div class="container-page page-stack">
      <LazyVBreadcrumb :items="crumbs" />

      <header v-reveal class="space-y-4">
        <p class="eyebrow-accent">
          <span class="pip" aria-hidden="true" />Compare products
        </p>
        <h1 class="max-w-4xl text-3xl sm:text-5xl">
          Compare printers, photocopiers and supplies
        </h1>
        <p class="max-w-3xl text-sm text-mute sm:text-base">
          Put up to four products from one category side by side. Differences
          are highlighted so you can see what actually separates them.
        </p>
        <div
          class="flex flex-wrap gap-2"
          role="group"
          aria-label="Comparison presets"
        >
          <LazyVButton
            variant="plain"
            v-for="p in presetList"
            :key="p.key"
            class="rounded-control border px-3 py-1.5 font-mono text-xs tracking-wider transition duration-200"
            :class="
              isActivePreset(p.ids)
                ? 'border-accent bg-accent text-onaccent'
                : 'border-line text-mute hover:border-mute hover:text-paper'
            "
            :aria-pressed="isActivePreset(p.ids)"
            @click="setIds(p.ids)"
          >
            {{ p.label }} <span class="opacity-80">({{ p.ids.length }})</span>
          </LazyVButton>
        </div>
      </header>

      <template v-if="cmp.products.length">
        <compare-toolbar
          :cmp="cmp"
          @add="(id) => setIds([...ids, id])"
          @clear="setIds([])"
        />

        <p
          v-if="cmp.products.length === 1"
          class="flex items-center gap-2 rounded-card border border-line bg-raised p-3 text-sm text-mute"
        >
          <Icon name="lucide:info" size="16" aria-hidden="true" />Add at least
          one more product to see the differences.
        </p>

        <compare-matrix
          :cmp="cmp"
          @remove="(id) => setIds(ids.filter((i) => i !== id))"
        />
      </template>

      <LazyVEmptyState
        v-else
        icon="lucide:git-compare"
        eyebrow="MATRIX :: COMPARE_NULL"
        tag="0 PRODUCTS"
        title="Nothing to compare yet"
        description="Use the compare button on any product card, or load one of the ready-made comparisons below."
      >
        <LazyVButton variant="primary" to="/products"
          >Browse the catalog</LazyVButton
        >
      </LazyVEmptyState>
    </div>

    <compare-presets @load="setIds" />
  </div>
</template>

<script lang="ts" setup>
// Named presetList so <compare-presets> resolves to the component, not this array.
import { comparePresets as presetList, MAX_COMPARE } from "~/data/compare";
import { findProduct } from "~/data/product-details";

const categoryOf = (id: string) =>
  (findProduct(id) as { category?: string } | undefined)?.category;

const route = useRoute();
const router = useRouter();
const store = useCompareStore();

const crumbs = [
  { label: "Index", to: "/" },
  { label: "Products", to: "/products" },
  { label: "Compare products" },
];

// The URL (?ids=a,b,c) is the source of truth so a comparison can be shared.
const ids = computed(() => {
  const raw = route.query.ids;
  return String((Array.isArray(raw) ? raw[0] : raw) ?? "")
    .split(",")
    .filter((id, i, all) => id && all.indexOf(id) === i && findProduct(id))
    .filter((id, _i, all) => categoryOf(id) === categoryOf(all[0]!)) // one category at a time
    .slice(0, MAX_COMPARE);
});

const setIds = (next: string[]) => {
  const list = next.slice(0, MAX_COMPARE);
  store.set(list);
  router.replace({ query: list.length ? { ids: list.join(",") } : {} });
};

const isActivePreset = (presetIds: string[]) =>
  presetIds.length === ids.value.length &&
  presetIds.every((id) => ids.value.includes(id));

const cmp = useComparison(ids);

onMounted(() => {
  // Arrived without a list in the URL: restore the one picked on the cards.
  if (!ids.value.length && store.ids.length) setIds(store.ids);
  else store.set(ids.value);
});

useSeoMeta({
  title: "Compare products",
  description: "Compare printers, photocopiers and supplies side by side.",
  robots: "noindex",
});
</script>