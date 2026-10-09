<template>
  <section
    id="inventory"
    class="section scroll-mt-28 !py-12 md:!py-16"
    aria-labelledby="inventory-title"
  >
    <div class="container-page space-y-6">
      <section-heading
        id="inventory-title"
        eyebrow="Verified system inventory"
        :title="`Verified system inventory (${inventory.total})`"
      >
        <div class="flex items-center gap-3">
          <LazyVButton variant="secondary"
            class="h-10 !px-3 lg:hidden"
            :aria-expanded="showFilters"
            aria-controls="inventory-filters"
            @click="showFilters = !showFilters"
          >
            <Icon
              name="lucide:sliders-horizontal"
              size="16"
              class="icon-wiggle"
              aria-hidden="true"
            />
            Filters
            <span
              v-if="inventory.activeCount"
              class="grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 font-mono text-xs font-bold text-onaccent"
              >{{ inventory.activeCount }}</span
            >
          </LazyVButton>
          <LazyVSelectInput
            v-model="inventory.sort"
            name="inventorySort"
            label="Sort"
            inline
            label-class="eyebrow"
            :options="sortOptions"
            input-class="!w-auto py-2 pe-8"
          />
        </div>
      </section-heading>

      <div class="gap-8 lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
        <aside
          id="inventory-filters"
          class="mb-4 lg:mb-0"
          :class="showFilters ? 'block' : 'hidden lg:block'"
          aria-label="Inventory filters"
        >
          <div class="card p-4"><inventory-filters /></div>
        </aside>

        <div class="space-y-4">
          <p class="sr-only" role="status">
            {{ inventory.total }} systems found
          </p>

          <div
            v-if="!inventory.total"
            class="card flex flex-col items-center gap-3 px-6 py-14 text-center"
          >
            <Icon
              name="lucide:search-x"
              size="28"
              class="text-mute"
              aria-hidden="true"
            />
            <h3 class="font-display text-xl">
              No systems match these parameters
            </h3>
            <p class="max-w-md text-sm text-mute">
              Widen the resolution or price range, or reset the filters to see
              the full inventory.
            </p>
            <LazyVButton variant="primary" @click="inventory.reset()">
              Reset filters
            </LazyVButton>
          </div>

          <TransitionGroup
            v-else
            tag="ul"
            name="inv"
            class="relative grid gap-4 md:grid-cols-2 xl:grid-cols-3"
          >
            <li v-for="p in inventory.paged" :key="p.id" class="flex">
              <VProductCard :product="p" class="w-full" />
            </li>
          </TransitionGroup>

          <LazyVPagination
            v-model:page="inventory.page"
            :total="inventory.total"
            :per-page="inventory.perPage"
            item-label="systems"
            scroll-to="#inventory"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { inventorySortOptions } from "~/data/cameras";

const inventory = useCameraInventory();
const sortOptions = inventorySortOptions.map((s) => ({ value: s.key, label: s.label }));
const uid = useId();
const showFilters = ref(false);
</script>

<style scoped>
.inv-enter-active,
.inv-leave-active {
  transition:
    opacity 0.25s ease-out,
    transform 0.25s ease-out;
}

.inv-enter-from,
.inv-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

.inv-leave-active {
  position: absolute;
}

.inv-move {
  transition: transform 0.3s ease-out;
}
</style>