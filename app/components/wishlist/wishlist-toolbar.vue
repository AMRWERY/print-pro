<template>
  <div class="space-y-3">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div
        class="flex flex-wrap gap-2"
        role="group"
        aria-label="Filter by category"
      >
        <button
          v-for="c in categories"
          :key="c.key"
          type="button"
          class="rounded-control border px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition duration-200"
          :class="
            active === c.key
              ? 'border-accent bg-accent text-onaccent'
              : 'border-line text-mute hover:border-mute hover:text-paper'
          "
          :aria-pressed="active === c.key"
          @click="emit('update:active', c.key)"
        >
          {{ c.label }} ({{ c.count }})
        </button>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <div
          class="inline-flex rounded-control border border-line p-0.5"
          role="group"
          aria-label="Layout"
        >
          <button
            v-for="v in views"
            :key="v.key"
            type="button"
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
          </button>
        </div>
        <div class="flex items-center gap-2">
          <label :for="`${uid}-sort`" class="eyebrow">Sort</label>
          <select
            :id="`${uid}-sort`"
            class="field !w-auto py-1.5 pe-8 text-xs"
            :value="sort"
            @change="
              emit('update:sort', ($event.target as HTMLSelectElement).value)
            "
          >
            <option
              v-for="s in wishlistSortOptions"
              :key="s.key"
              :value="s.key"
            >
              {{ s.label }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div
      v-if="!readonly"
      class="flex flex-wrap items-center justify-between gap-3 border-y border-line py-2"
    >
      <label class="flex cursor-pointer items-center gap-2 text-sm">
        <input
          type="checkbox"
          class="check"
          :checked="allSelected"
          :indeterminate.prop="someSelected && !allSelected"
          @change="
            emit('select-all', ($event.target as HTMLInputElement).checked)
          "
        />
        Select all ({{ shown }})
      </label>
      <button
        type="button"
        class="link-quiet inline-flex items-center gap-1.5 text-sm disabled:opacity-40"
        :disabled="!selectedCount"
        @click="emit('batch-remove')"
      >
        <Icon name="lucide:trash-2" size="14" aria-hidden="true" />Batch remove
        ({{ selectedCount }})
      </button>
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

const views = [
  { key: "grid" as const, label: "Grid view", icon: "lucide:layout-grid" },
  { key: "list" as const, label: "Detailed spec list", icon: "lucide:list" },
];
</script>