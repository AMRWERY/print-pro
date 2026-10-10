<template>
  <div
    class="flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-line py-3"
  >
    <label class="flex cursor-pointer items-center gap-2 text-sm">
      <LazyVButton variant="plain"
        role="switch"
        :aria-checked="cmp.highlight"
        class="relative h-6 w-11 shrink-0 rounded-full border border-line transition-colors duration-200"
        :class="cmp.highlight ? 'bg-accent' : 'bg-raised'"
        @click="cmp.highlight = !cmp.highlight"
      >
        <span
          class="absolute start-0.5 top-0.5 h-4 w-4 rounded-full bg-paper transition-transform duration-200"
          :class="cmp.highlight && 'translate-x-5 rtl:-translate-x-5'"
        />
        <span class="sr-only">Highlight differences</span>
      </LazyVButton>
      <span>Highlight differences only</span>
      <span
        class="rounded-control bg-accent-soft px-2 py-0.5 font-mono text-xs text-accent"
        >{{ cmp.totalDeltas }} deltas</span
      >
    </label>

    <LazyVCheckboxImput v-model="cmp.hideIdentical" label-class="items-center">Hide identical specs</LazyVCheckboxImput>

    <LazyVButton variant="tertiary"
      class="inline-flex items-center gap-1.5 text-sm"
      @click="cmp.toggleAll()"
    >
      <Icon
        :name="
          cmp.allCollapsed
            ? 'lucide:chevrons-up-down'
            : 'lucide:chevrons-down-up'
        "
        size="16"
        aria-hidden="true"
      />
      {{ cmp.allCollapsed ? "Expand specs" : "Collapse specs" }}
    </LazyVButton>

    <div class="ms-auto flex flex-wrap items-center gap-3">
      <p class="meta">
        Comparing <span class="text-paper">{{ cmp.products.length }}</span> of
        {{ max }} slots
      </p>

      <div
        v-if="options.length && cmp.products.length < max"
        class="flex items-center gap-2"
      >
        <LazyVSelectInput
          :model-value="''"
          name="addProduct"
          label="Add a product to compare"
          hide-label
          :options="addOptions"
          input-class="!w-auto py-1.5 pe-8 text-xs"
          @update:model-value="(v) => v && emit('add', String(v))"
        />
      </div>

      <LazyVButton variant="secondary" class="h-9 !px-3 text-xs" @click="print">
        <Icon name="lucide:file-down" size="14" aria-hidden="true" />Export PDF
      </LazyVButton>
      <LazyVButton variant="secondary" class="h-9 !px-3 text-xs" @click="share">
        <Icon
          :key="`s-${copied}`"
          :name="copied ? 'lucide:check' : 'lucide:share-2'"
          size="14"
          :class="copied && 'animate-icon-pop'"
          aria-hidden="true"
        />
        {{ copied ? "Link copied" : "Share" }}
      </LazyVButton>
      <LazyVButton variant="secondary"
        class="h-9 !px-3 text-xs"
        @click="emit('clear')"
      >
        <Icon name="lucide:trash-2" size="14" aria-hidden="true" />Clear
      </LazyVButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { useComparison } from "~/composables/useComparison";
import { MAX_COMPARE } from "~/data/compare";
import { allProducts } from "~/data/product-details";

const props = defineProps<{ cmp: ReturnType<typeof useComparison> }>();
const emit = defineEmits<{ add: [id: string]; clear: [] }>();

const max = MAX_COMPARE;
const uid = useId();

const options = computed(() => {
  const picked = new Set(props.cmp.products.map((p) => p.id));
  return allProducts.filter(
    (p, i, all) =>
      !picked.has(p.id) && all.findIndex((q) => q.id === p.id) === i,
  );
});

const addOptions = computed(() => [
  { value: "", label: "+ Add product…" },
  ...options.value.map((p) => ({ value: p.id, label: p.brand + " " + p.name })),
]);

const print = () => window.print();

const { copy, copied } = useClipboard({ copiedDuring: 2000 });

const share = () => copy(window.location.href);
</script>