<template>
  <nav
    v-if="catalog.pageCount > 1"
    aria-label="Pagination"
    class="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6"
  >
    <p class="font-mono text-xs text-mute">
      Displaying {{ catalog.rangeStart }}–{{ catalog.rangeEnd }} of
      {{ catalog.total }} verified items
    </p>
    <ul class="flex items-center gap-1.5">
      <li>
        <button
          type="button"
          class="btn-ghost h-9 !px-3 !py-0 font-mono text-xs uppercase"
          :disabled="catalog.page === 1"
          @click="go(catalog.page - 1)"
        >
          <Icon
            name="lucide:chevron-left"
            size="14"
            class="icon-nudge rtl:-scale-x-100"
            aria-hidden="true"
          />
          Prev
        </button>
      </li>
      <li v-for="(p, i) in pages" :key="`${p}-${i}`">
        <span v-if="p === '…'" class="px-1 text-mute" aria-hidden="true"
          >…</span
        >
        <button
          v-else
          type="button"
          class="h-9 min-w-9 rounded-control border px-2 font-mono text-xs transition duration-200"
          :class="
            p === catalog.page
              ? 'border-accent bg-accent text-onaccent'
              : 'border-line text-mute hover:border-mute hover:text-paper'
          "
          :aria-current="p === catalog.page ? 'page' : undefined"
          :aria-label="`Page ${p}`"
          @click="go(p as number)"
        >
          {{ p }}
        </button>
      </li>
      <li>
        <button
          type="button"
          class="btn-ghost h-9 !px-3 !py-0 font-mono text-xs uppercase"
          :disabled="catalog.page === catalog.pageCount"
          @click="go(catalog.page + 1)"
        >
          Next
          <Icon
            name="lucide:chevron-right"
            size="14"
            class="icon-nudge rtl:-scale-x-100"
            aria-hidden="true"
          />
        </button>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts" setup>
const catalog = useCatalog();

// 1 … 4 5 6 … 9 — always shows the first, last and neighbours of the current page.
const pages = computed<(number | "…")[]>(() => {
  const last = catalog.pageCount;
  const cur = catalog.page;
  const keep = new Set([1, last, cur - 1, cur, cur + 1]);
  const nums = [...keep]
    .filter((n) => n >= 1 && n <= last)
    .sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  nums.forEach((n, i) => {
    if (i && n - nums[i - 1]! > 1) out.push("…");
    out.push(n);
  });
  return out;
});

const go = (n: number) => {
  catalog.page = n;
  document
    .getElementById("catalog-results")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
};
</script>