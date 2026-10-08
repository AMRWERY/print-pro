<template>
  <div>
    <div class="container-page space-y-6 py-6 lg:py-8">
      <v-breadcrumb :items="crumbs" />

      <!-- A shared manifest opened from a link -->
      <div v-if="shared" class="flex flex-wrap items-center justify-between gap-3 rounded-card border border-accent/40 bg-accent-soft p-3 text-sm" role="status">
        <p class="flex items-center gap-2"><Icon name="lucide:share-2" size="16" aria-hidden="true" />You're viewing a shared registry manifest ({{ items.length }} items).</p>
        <div class="flex gap-2">
          <button type="button" class="btn-accent !px-3 !py-1.5 text-xs" @click="saveShared">Save to my registry</button>
          <button type="button" class="btn-ghost !px-3 !py-1.5 text-xs" @click="closeShared">Close</button>
        </div>
      </div>

      <wishlist-header
        v-model:name="wl.name"
        v-model:preview="preview"
        :count="items.length"
        :ready="ready"
        :total="assetTotal"
        :selected-count="selectedItems.length"
        :copied="copied"
        :registry-id="registryId"
        @move-selected="moveSelected"
        @share="share"
        @new-registry="wl.clear()"
      />

      <p class="sr-only" role="status">{{ announcement }}</p>

      <LazyVEmptyState
        v-if="!items.length"
        icon="lucide:bookmark-plus"
        title="Your registry is empty"
        description="Tap the heart on any product to save it here. Group items by studio, share the manifest with your team and move everything to the cart when you are ready."
      >
        <nuxt-link-locale to="/products" class="btn-accent">Browse the catalog</nuxt-link-locale>
      </LazyVEmptyState>

      <template v-else>
        <wishlist-toolbar
          v-model:active="category"
          v-model:view="view"
          v-model:sort="sort"
          :categories="categories"
          :shown="shown.length"
          :selected-count="selectedItems.length"
          :all-selected="allSelected"
          :some-selected="selectedItems.length > 0"
          :readonly="!!shared"
          @select-all="selectAll"
          @batch-remove="batchRemove"
        />

        <TransitionGroup tag="ul" name="wl" class="relative grid gap-4" :class="view === 'grid' ? 'sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'">
          <li v-for="p in shown" :key="p.id" class="flex">
            <wishlist-card
              class="w-full"
              :product="p"
              :list="view === 'list'"
              :readonly="!!shared"
              :selected="isSelected(p.id)"
              :tag="wl.tags[p.id] ?? 'Unassigned'"
              @update:selected="(v) => setSelected(p.id, v)"
              @tag="(t) => wl.setTag(p.id, t)"
              @remove="removeOne(p)"
              @move="moveOne(p)"
            />
          </li>
        </TransitionGroup>

        <p v-if="!shown.length" class="rounded-card border border-line bg-raised p-4 text-sm text-mute">
          Nothing in this category. <button type="button" class="text-accent hover:underline" @click="category = 'all'">Show all items</button>
        </p>
      </template>
    </div>

    <section class="border-t border-line py-12" aria-label="Registry assurances">
      <div class="container-page"><icon-feature-row :items="wishlistAssurances" /></div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { categoryOptions } from "~/data/catalog";
import { findProduct } from "~/data/product-details";
import { sampleRegistry, wishlistAssurances } from "~/data/wishlist";
import type { DetailedProduct } from "~/types/product";

const route = useRoute();
const router = useRouter();
const wl = useWishlistStore();
const cart = useCartStore();

const crumbs = [
  { label: "Studio registry", to: "/" },
  { label: "Printworks & optical hub", to: "/products" },
  { label: "Curated apparatus wishlist" },
];

// ?items=a,b,c opens someone else's manifest read-only.
const shared = computed(() => {
  const raw = route.query.items;
  const list = String((Array.isArray(raw) ? raw[0] : raw) ?? "")
    .split(",")
    .filter((id, i, all) => id && all.indexOf(id) === i && findProduct(id));
  return list.length ? list : null;
});

const preview = ref(false);
const sourceIds = computed(() => (preview.value ? [] : (shared.value ?? wl.ids)));
const items = computed(() =>
  sourceIds.value.map((id) => findProduct(id)).filter((p): p is DetailedProduct => !!p),
);

// ---- selection (everything selected unless the user unticks it) ----
const unselected = ref<string[]>([]);
const isSelected = (id: string) => !unselected.value.includes(id);
const setSelected = (id: string, on: boolean) =>
  (unselected.value = on ? unselected.value.filter((i) => i !== id) : [...unselected.value, id]);

// ---- filter / sort / view ----
const category = ref("all");
const sort = ref("price-desc");
const view = ref<"grid" | "list">("grid");

const categoryOf = (p: DetailedProduct) =>
  categoryOptions.find((o) => o.key === (p as { category?: string }).category)?.label ?? "Other";

const categories = computed(() => {
  const counts = new Map<string, number>();
  for (const p of items.value) counts.set(categoryOf(p), (counts.get(categoryOf(p)) ?? 0) + 1);
  return [
    { key: "all", label: "All", count: items.value.length },
    ...[...counts.entries()].map(([label, count]) => ({ key: label, label, count })),
  ];
});
// A removed category's chip disappears; fall back to "all".
watch(categories, (list) => {
  if (!list.some((c) => c.key === category.value)) category.value = "all";
});

const shown = computed(() => {
  const list = items.value.filter((p) => category.value === "all" || categoryOf(p) === category.value);
  const by: Record<string, (a: DetailedProduct, b: DetailedProduct) => number> = {
    "price-desc": (a, b) => b.price - a.price,
    "price-asc": (a, b) => a.price - b.price,
    rating: (a, b) => b.rating - a.rating,
    name: (a, b) => a.name.localeCompare(b.name),
  };
  return [...list].sort(by[sort.value] ?? by["price-desc"]!);
});

const selectedItems = computed(() => shown.value.filter((p) => isSelected(p.id)));
const allSelected = computed(() => shown.value.length > 0 && selectedItems.value.length === shown.value.length);
const selectAll = (on: boolean) => {
  const ids = shown.value.map((p) => p.id);
  unselected.value = on ? unselected.value.filter((id) => !ids.includes(id)) : [...new Set([...unselected.value, ...ids])];
};

// ---- numbers ----
const assetTotal = computed(() => items.value.reduce((n, p) => n + p.price, 0));
const ready = computed(() => items.value.filter((p) => p.badge.tone === "success").length);
const registryId = computed(() => {
  let h = 0;
  for (const c of wl.name) h = (h * 31 + c.charCodeAt(0)) % 9973;
  return `NYC-${String(h).padStart(4, "0")}`;
});

// ---- actions ----
const announcement = ref("");
const say = (m: string) => (announcement.value = m);

const moveOne = (p: DetailedProduct) => {
  cart.add(p.price);
  if (!shared.value) {
    wl.remove([p.id]);
    say(`${p.name} moved to cart.`);
  }
};
const removeOne = (p: DetailedProduct) => {
  wl.remove([p.id]);
  say(`${p.name} removed from registry.`);
};
const moveSelected = () => {
  const picked = selectedItems.value;
  if (!picked.length) return;
  for (const p of picked) cart.add(p.price);
  if (!shared.value) wl.remove(picked.map((p) => p.id));
  say(`${picked.length} ${picked.length === 1 ? "item" : "items"} moved to cart.`);
};
const batchRemove = () => {
  const picked = selectedItems.value;
  wl.remove(picked.map((p) => p.id));
  say(`${picked.length} ${picked.length === 1 ? "item" : "items"} removed.`);
};

const { copy, copied } = useClipboard({ copiedDuring: 2000 });
const share = () => {
  const url = new URL(window.location.origin + route.path);
  url.searchParams.set("items", items.value.map((p) => p.id).join(","));
  copy(url.toString());
};
const saveShared = () => {
  wl.addMany(shared.value ?? []);
  closeShared();
};
const closeShared = () => router.replace({ query: {} });
const loadSample = () => {
  wl.addMany(sampleRegistry);
  preview.value = false;
};

useSeoMeta({
  title: "Studio Registry & Wishlist — Lumen & Press",
  description: "Your saved apparatus: share the manifest, group items by studio and move them to the cart.",
  robots: "noindex",
});
</script>

<style scoped>
.wl-enter-active,
.wl-leave-active {
  transition:
    opacity 0.25s ease-out,
    transform 0.25s ease-out;
}
.wl-enter-from,
.wl-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
.wl-leave-active {
  position: absolute;
}
.wl-move {
  transition: transform 0.3s ease-out;
}
</style>
