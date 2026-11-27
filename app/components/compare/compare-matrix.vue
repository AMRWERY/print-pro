<template>
  <div
    class="overflow-x-auto card"
    role="region"
    :aria-label="t('compare_ui.matrix_region')"
    tabindex="0"
  >
    <div
      role="table"
      :aria-label="t('compare_ui.table_label', { n: cmp.products.length })"
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
          <p class="eyebrow text-accent">{{ t("compare_ui.summary") }}</p>
          <p class="font-display text-xl leading-snug">
            {{ t("compare_ui.side_by_side") }}
          </p>
          <p class="text-xs text-mute">
            {{
              cmp.products.length === 1
                ? t("compare_ui.product_one", { n: cmp.products.length })
                : t("compare_ui.product_other", { n: cmp.products.length })
            }}
            ·
            <i18n-t keypath="compare_ui.differences_detected" tag="span">
              <template #count>
                <span class="text-paper">{{ cmp.totalDeltas }}</span>
              </template>
            </i18n-t>
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
                >{{
                  s.deltas === 1
                    ? t("compare_ui.delta_detected", { n: s.deltas })
                    : t("compare_ui.deltas_detected", { n: s.deltas })
                }}</span
              >
              <span v-else class="meta">{{
                t("btn.all_specs_identical")
              }}</span>
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
          class="collapse-grid"
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
                  class="meta tracking-wider"
                >
                  {{ t("compare_ui.identical_spec") }}
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

const { t } = useI18n();

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