<template>
  <div>
    <div class="container-page page-stack">
      <LazyVBreadcrumb :items="crumbs" />

      <header v-reveal class="space-y-4">
        <p class="eyebrow-accent">
          <span class="pip" aria-hidden="true" />{{ t("compare_ui.compare_products") }}
        </p>
        <h1 class="max-w-4xl text-3xl sm:text-5xl">
          {{ t("compare_ui.page_title") }}
        </h1>
        <p class="max-w-3xl text-sm text-mute sm:text-base">
          {{ t("compare_ui.page_description") }}
        </p>
        <div
          class="flex flex-wrap gap-2"
          role="group"
          :aria-label="t('compare_ui.presets')"
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
          <Icon name="lucide:info" size="16" aria-hidden="true" />{{
            t("compare_ui.add_one_more")
          }}
        </p>

        <compare-matrix
          :cmp="cmp"
          @remove="(id) => setIds(ids.filter((i) => i !== id))"
        />
      </template>

      <LazyVEmptyState
        v-else
        icon="lucide:git-compare"
        :eyebrow="t('compare_ui.empty_eyebrow')"
        :tag="t('compare_ui.empty_tag')"
        :title="t('compare_ui.empty_title')"
        :description="t('compare_ui.empty_description')"
      >
        <LazyVButton variant="primary" to="/products">{{
          t("btn.browse_the_catalog")
        }}</LazyVButton>
      </LazyVEmptyState>
    </div>

    <compare-presets @load="setIds" />
  </div>
</template>

<script lang="ts" setup>
import { comparePresets as presetList, MAX_COMPARE } from "~/data/compare";

const catalog = useCatalogStore();
const { findProduct } = catalog;
onMounted(() => catalog.ensureCatalog());
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const store = useCompareStore();

const categoryOf = (id: string) =>
  (findProduct(id) as { category?: string } | undefined)?.category;

const crumbs = computed(() => [
  { label: t("catalog_ui.index"), to: "/" },
  { label: t("catalog_ui.products"), to: "/products" },
  { label: t("compare_ui.compare_products") },
]);

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
  title: t("compare_ui.compare_products"),
  description: t("compare_ui.seo_description"),
  robots: "noindex",
});
</script>