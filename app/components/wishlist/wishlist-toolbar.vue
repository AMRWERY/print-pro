<template>
  <div class="space-y-3">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div
        class="flex flex-wrap gap-2"
        role="group"
        aria-label="Filter by category"
      >
        <LazyVButton
          variant="plain"
          v-for="c in categories"
          :key="c.key"
          class="rounded-control border px-3 py-1.5 font-mono text-xs tracking-wider transition duration-200"
          :class="
            active === c.key
              ? 'border-accent bg-accent text-onaccent'
              : 'border-line text-mute hover:border-mute hover:text-paper'
          "
          :aria-pressed="active === c.key"
          @click="emit('update:active', c.key)"
        >
          {{ c.label }} ({{ c.count }})
        </LazyVButton>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <div
          class="inline-flex rounded-control border border-line p-0.5"
          role="group"
          aria-label="Layout"
        >
          <LazyVButton
            variant="plain"
            v-for="v in views"
            :key="v.key"
            class="grid h-8 w-8 place-items-center rounded-[4px] transition-colors duration-200"
            :class="
              view === v.key
                ? 'bg-raised text-accent'
                : 'text-mute hover:text-paper'
            "
            :aria-pressed="view === v.key"
            :aria-label="v.label"
            @click="emit('update:view', v.key)"
          >
            <Icon :name="v.icon" size="16" aria-hidden="true" />
          </LazyVButton>
        </div>
        <div class="flex items-center gap-2">
          <LazyVSelectInput
            :model-value="sort"
            name="wishlistSort"
            label="Sort"
            inline
            label-class="eyebrow"
            :options="sortOptions"
            input-class="!w-auto py-1.5 pe-8 text-xs"
            @update:model-value="(v) => emit('update:sort', String(v))"
          />
        </div>
      </div>
    </div>

    <div
      v-if="!readonly"
      class="flex flex-wrap items-center justify-between gap-3 border-y border-line py-2"
    >
      <LazyVInput
        type="checkbox"
        :model-value="allSelected"
        :indeterminate="someSelected && !allSelected"
        label-class="items-center"
        @update:model-value="(v) => emit('select-all', !!v)"
      >
        Select all ({{ shown }})
      </LazyVInput>

      <LazyVButton
        variant="tertiary"
        class="inline-flex items-center gap-1.5 text-sm disabled:opacity-40"
        :disabled="!selectedCount"
        @click="emit('batch-remove')"
      >
        <Icon name="lucide:trash-2" size="14" aria-hidden="true" />Batch remove
        ({{ selectedCount }})
      </LazyVButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { wishlistSortOptions } from "~/data/wishlist";

defineProps<{
  categories: { key: string; label: string; count: number }[];
  active: string;
  view: "grid" | "list";
  sort: string;
  shown: number;
  selectedCount: number;
  allSelected: boolean;
  someSelected: boolean;
  readonly?: boolean;
}>();

const emit = defineEmits<{
  "update:active": [value: string];
  "update:view": [value: "grid" | "list"];
  "update:sort": [value: string];
  "select-all": [value: boolean];
  "batch-remove": [];
}>();

const uid = useId();
const sortOptions = wishlistSortOptions.map((s) => ({
  value: s.key,
  label: s.label,
}));

const views = [
  { key: "grid" as const, label: "Grid view", icon: "lucide:layout-grid" },
  { key: "list" as const, label: "Detailed spec list", icon: "lucide:list" },
];
</script>