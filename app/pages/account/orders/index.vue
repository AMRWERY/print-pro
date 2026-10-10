<template>
  <div class="space-y-6">
    <LazyVBreadcrumb :items="crumbs" />

    <header class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1
          class="title-lg"
        >
          Orders &amp; Calibrations
        </h1>
        <p class="mt-1 text-sm text-mute">
          Every requisition placed with Lumen &amp; Press, with live status.
        </p>
      </div>
      <LazyVButton variant="secondary" icon="lucide:download" @click="exportCsv"
        >Export CSV</LazyVButton
      >
    </header>

    <orders-stats :orders="orders" />

    <orders-filters
      v-model:search="search"
      v-model:status="status"
      v-model:quarter="quarter"
      v-model:port="port"
      :quarter-options="quarterOptions"
      :port-options="portOptions"
      :counts="counts"
      :active="filtersActive"
      @reset="reset"
    />

    <div id="results" class="scroll-mt-28">
      <table-skeleton-loader v-if="pending" :rows="5" />

      <template v-else-if="filtered.length">
        <orders-table :orders="pageRows" />

        <orders-cards :orders="mobileRows" />

        <!-- Desktop: numbered pages. Phones: load more. -->
        <div class="mt-4 hidden md:block">
          <LazyVPagination
            v-model:page="page"
            :per-page="perPage"
            :total="filtered.length"
            item-label="orders"
            scroll-to="#results"
            label="Orders pagination"
          />
        </div>
        <div class="mt-4 space-y-2 text-center md:hidden">
          <p class="meta">
            Displaying {{ mobileRows.length }} of {{ filtered.length }}
          </p>
          <LazyVButton
            v-if="mobileRows.length < filtered.length"
            variant="secondary"
            block
            icon="lucide:chevrons-down"
            @click="mobileLimit += perPage"
            >Load more orders</LazyVButton
          >
        </div>
      </template>

      <LazyVEmptyState
        v-else
        icon="lucide:receipt-text"
        eyebrow="LEDGER :: ORDERS"
        :tag="orders.length ? 'FILTERED' : 'EMPTY'"
        :title="
          orders.length ? 'No orders match these filters' : 'No orders yet'
        "
        :description="
          orders.length
            ? 'Try a different status, quarter or port, or clear the filters.'
            : 'Orders you place show up here with live tracking and paperwork.'
        "
      >
        <LazyVButton v-if="orders.length" variant="primary" @click="reset"
          >Clear filters</LazyVButton
        >

        <LazyVButton v-else variant="primary" to="/products"
          >Browse the catalog</LazyVButton
        >
      </LazyVEmptyState>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { orders, pending } = useAccount();

const search = ref("");
const status = ref("all");
const quarter = ref("all");
const port = ref("all");
const page = ref(1);
const mobileLimit = ref(5);
const perPage = 5;

const crumbs = [
  { label: "Studio procurement", to: "/" },
  { label: "Atelier workspace", to: "/account" },
  { label: "Orders & calibrations" },
];

const quarterOptions = computed(() => [
  { value: "all", label: "All quarters" },
  ...[...new Set(orders.value.map(orderQuarter).filter(Boolean))].map((q) => ({
    value: q,
    label: q,
  })),
]);

const portOptions = computed(() => [
  { value: "all", label: "All receiving ports" },
  ...[
    ...new Set(
      orders.value.map((o) => o.destination).filter((d): d is string => !!d),
    ),
  ].map((d) => ({ value: d, label: d })),
]);

const counts = computed(() => {
  const c: Record<string, number> = { all: orders.value.length };
  for (const o of orders.value) c[o.status] = (c[o.status] ?? 0) + 1;
  return c;
});

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase();
  return orders.value.filter(
    (o) =>
      (status.value === "all" || o.status === status.value) &&
      (quarter.value === "all" || orderQuarter(o) === quarter.value) &&
      (port.value === "all" || o.destination === port.value) &&
      (!q ||
        o.id.toLowerCase().includes(q) ||
        o.title.toLowerCase().includes(q) ||
        (o.waybill ?? "").toLowerCase().includes(q) ||
        o.items.some((i) => i.name.toLowerCase().includes(q))),
  );
});

const filtersActive = computed(
  () =>
    !!search.value ||
    status.value !== "all" ||
    quarter.value !== "all" ||
    port.value !== "all",
);

const pageRows = computed(() =>
  filtered.value.slice((page.value - 1) * perPage, page.value * perPage),
);
const mobileRows = computed(() => filtered.value.slice(0, mobileLimit.value));

// Any filter change starts again from the first page.
watch([search, status, quarter, port], () => {
  page.value = 1;
  mobileLimit.value = perPage;
});

const reset = () => {
  search.value = "";
  status.value = quarter.value = port.value = "all";
};

const exportCsv = () => {
  const cell = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  const rows = [
    ["Order", "Placed", "Items", "Status", "Total"],
    ...filtered.value.map((o) => [
      o.id,
      orderDateLabel(o),
      o.title,
      o.statusLabel,
      o.amount.toFixed(2),
    ]),
  ];
  const blob = new Blob([rows.map((r) => r.map(cell).join(",")).join("\n")], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "orders.csv";
  a.click();
  URL.revokeObjectURL(url);
};

definePageMeta({
  layout: "account",
});

useSeoMeta({
  title: "Orders & Calibrations — Lumen & Press",
  description: "Your requisitions, with live status and paperwork.",
});
</script>