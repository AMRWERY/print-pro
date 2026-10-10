<template>
  <div
    class="overflow-x-auto rounded-card border border-line bg-surface"
    role="region"
    aria-label="Comparison matrix (scrolls sideways on small screens)"
    tabindex="0"
  >
    <div
      role="table"
      :aria-label="`Comparison of ${cmp.products.length} products`"
      :style="{ minWidth }"
    >
      <!-- Product header row -->
      <div
        role="row"
        class="grid border-b border-line"
        :style="{ gridTemplateColumns: columns }"
      >
        <div
          role="columnheader"
          class="sticky start-0 z-10 flex flex-col gap-2 bg-surface p-4"
        >
          <p class="eyebrow text-accent">Audit summary</p>
          <p class="font-display text-xl leading-snug">
            Side-by-side bench evaluation
          </p>
          <p class="text-xs text-mute">
            {{ cmp.products.length }}
            {{ cmp.products.length === 1 ? "product" : "products" }} ·
            <span class="text-paper">{{ cmp.totalDeltas }}</span> differences
            detected
          </p>
        </div>
        <compare-product-head
          v-for="p in cmp.products"
          :key="p.id"
          :product="p"
          @remove="emit('remove', p.id)"
        />
      </div>

      <section
        v-for="s in cmp.visibleSections"
        :key="s.key"
        role="rowgroup"
        :aria-label="s.title"
      >
        <h2 class="border-b border-line bg-raised">
          <LazyVButton
            variant="plain"
            block
            class="flex items-center justify-between gap-3 px-4 py-3 text-start"
            :aria-expanded="!cmp.isCollapsed(s.key)"
            :aria-controls="`${uid}-${s.key}`"
            @click="cmp.toggleSection(s.key)"
          >
            <span class="flex flex-wrap items-center gap-3">
              <span class="font-mono text-sm tracking-wider"
                >{{ sectionNumber(s.key) }} / {{ s.title }}</span
              >
              <span
                v-if="s.deltas"
                class="rounded-control bg-accent-soft px-2 py-0.5 font-mono text-xs text-accent"
                >{{ s.deltas }}
                {{ s.deltas === 1 ? "delta" : "deltas" }} detected</span
              >
              <span v-else class="font-mono text-xs text-mute"
                >All specs identical</span
              >
            </span>
            <Icon
              name="lucide:chevron-down"
              size="18"
              class="shrink-0 text-mute transition-transform duration-200"
              :class="!cmp.isCollapsed(s.key) && 'rotate-180'"
              aria-hidden="true"
            />
          </LazyVButton>
        </h2>

        <div
          :id="`${uid}-${s.key}`"
          class="grid transition-[grid-template-rows] duration-300 ease-out"
          :class="
            cmp.isCollapsed(s.key) ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]'
          "
          :inert="cmp.isCollapsed(s.key)"
        >
          <div class="overflow-hidden">
            <div
              v-for="r in s.rows"
              :key="r.key"
              role="row"
              class="grid border-b border-line last:border-b-0"
              :class="cmp.highlight && !r.delta && 'opacity-60'"
              :style="{ gridTemplateColumns: columns }"
            >
              <div role="rowheader" class="sticky start-0 z-10 bg-surface p-4">
                <p class="text-sm font-medium">{{ r.label }}</p>
                <p
                  v-if="r.delta && r.hint"
                  class="font-mono text-xs tracking-wider text-accent"
                >
                  {{ r.hint }}
                </p>
                <p
                  v-else-if="!r.delta && cmp.products.length > 1"
                  class="font-mono text-xs tracking-wider text-mute"
                >
                  Identical spec
                </p>
              </div>
              <div
                v-for="(c, i) in r.cells"
                :key="i"
                role="cell"
                class="border-s border-line p-4"
                :class="cmp.highlight && c.differs && 'bg-accent-soft/50'"
              >
                <p
                  class="text-sm"
                  :class="
                    cmp.highlight && c.differs
                      ? 'font-medium text-accent'
                      : 'text-paper'
                  "
                >
                  {{ c.value }}
                </p>
                <p v-if="c.note" class="mt-0.5 text-xs text-mute">
                  {{ c.note }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { useComparison } from "~/composables/useComparison";

const props = defineProps<{ cmp: ReturnType<typeof useComparison> }>();

const emit = defineEmits<{ remove: [id: string] }>();

const uid = useId();
const LABEL = 11; // rem
const COL = 15; // rem

const columns = computed(
  () =>
    `${LABEL}rem repeat(${props.cmp.products.length}, minmax(${COL}rem, 1fr))`,
);
const minWidth = computed(
  () => `${LABEL + COL * props.cmp.products.length}rem`,
);

const sectionNumber = (key: string) => {
  const i = props.cmp.visibleSections.findIndex((s) => s.key === key);
  return String(i + 1).padStart(2, "0");
};
</script>