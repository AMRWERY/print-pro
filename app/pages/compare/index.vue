<template>
  <div>
    <div class="container-page space-y-6 py-6 lg:py-8">
      <LazyVBreadcrumb :items="crumbs" />

      <header v-reveal class="space-y-4">
        <p class="eyebrow flex items-center gap-2 text-accent">
          <span class="h-2 w-2 bg-accent" aria-hidden="true" />Metric protocol ·
          bench certified
        </p>
        <h1 class="max-w-4xl text-3xl sm:text-5xl">
          Bench comparison matrix &amp; difference audit
        </h1>
        <p class="max-w-3xl text-sm text-mute sm:text-base">
          Side-by-side technical evaluation across engines, sensors, optics and
          archival substrates. Differences are highlighted so you can see what
          actually separates two systems.
        </p>
        <div
          class="flex flex-wrap gap-2"
          role="group"
          aria-label="Comparison presets"
        >
          <LazyVButton
            variant="plain"
            v-for="p in comparePresets"
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

      <div
        v-else
        class="card flex flex-col items-center gap-4 px-6 py-16 text-center"
      >
        <span
          class="grid h-14 w-14 place-items-center rounded-full border border-line text-mute"
          aria-hidden="true"
        >
          <Icon name="lucide:git-compare" size="26" />
        </span>
        <div class="space-y-1">
          <h2 class="font-display text-xl">Nothing to compare yet</h2>
          <p class="max-w-md text-sm text-mute">
            Use the compare button on any product card, or load one of the bench
            presets below.
          </p>
        </div>

        <LazyVButton variant="primary" to="/products"
          >Browse the catalog</LazyVButton
        >
      </div>
    </div>

    <compare-presets @load="setIds" />
  </div>
</template>

<script lang="ts" setup>
import { comparePresets, MAX_COMPARE } from "~/data/compare";
import { findProduct } from "~/data/product-details";

const route = useRoute();
const router = useRouter();
const store = useCompareStore();

const crumbs = [
  { label: "Index", to: "/" },
  { label: "Bench tools", to: "/products" },
  { label: "Comparison bench (active session)" },
];

// The URL (?ids=a,b,c) is the source of truth so a comparison can be shared.
const ids = computed(() => {
  const raw = route.query.ids;
  return String((Array.isArray(raw) ? raw[0] : raw) ?? "")
    .split(",")
    .filter((id, i, all) => id && all.indexOf(id) === i && findProduct(id))
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
  title: "Bench Comparison",
  description:
    "Compare bench-verified cameras, printers and archival substrates side by side.",
  robots: "noindex",
});
</script>