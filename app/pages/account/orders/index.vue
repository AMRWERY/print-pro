<template>
  <div class="space-y-6">
    <LazyVBreadcrumb :items="crumbs" />

    <header class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 class="title-lg">{{ t("acct_orders.page_title") }}</h1>
        <p class="mt-1 text-sm text-mute">
          {{ t("acct_orders.page_desc") }}
        </p>
      </div>
      <LazyVButton
        variant="secondary"
        icon="lucide:download"
        @click="exportCsv"
        >{{ t("btn.export_csv") }}</LazyVButton
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

      <LazyVEmptyState
        v-else-if="error"
        icon="lucide:cloud-off"
        :eyebrow="t('acct_orders.err_eyebrow')"
        :tag="t('acct_orders.err_tag')"
        tag-tone="warning"
        :title="t('account.orders_load_error_title', 'We couldn’t load your orders')"
        :description="
          t(
            'account.orders_load_error_description',
            'Your order history is temporarily unavailable. Your orders are safe; try again in a moment.',
          )
        "
      >
        <LazyVButton variant="primary" @click="refresh()">{{
          t("account.orders_load_error_retry", "Try again")
        }}</LazyVButton>
      </LazyVEmptyState>

      <template v-else-if="filtered.length">
        <orders-table :orders="pageRows" />

        <orders-cards :orders="mobileRows" />

        <!-- Desktop: numbered pages. Phones: load more. -->
        <div class="mt-4 hidden md:block">
          <LazyVPagination
            v-model:page="page"
            :per-page="perPage"
            :total="filtered.length"
            :item-label="t('acct_orders.item_label')"
            scroll-to="#results"
            :label="t('acct_orders.pagination')"
          />
        </div>
        <div class="mt-4 space-y-2 text-center md:hidden">
          <p class="meta">
            {{ t("acct_orders.displaying", { shown: mobileRows.length, total: filtered.length }) }}
          </p>
          <LazyVButton
            v-if="mobileRows.length < filtered.length"
            variant="secondary"
            block
            icon="lucide:chevrons-down"
            @click="mobileLimit += perPage"
            >{{ t("btn.load_more_orders") }}</LazyVButton
          >
        </div>
      </template>

      <LazyVEmptyState
        v-else
        icon="lucide:receipt-text"
        :eyebrow="t('acct_orders.empty_eyebrow')"
        :tag="orders.length ? t('acct_orders.empty_tag_filtered') : t('acct_orders.empty_tag_empty')"
        :title="
          orders.length ? t('acct_orders.empty_title_filtered') : t('acct_orders.empty_title_none')
        "
        :description="
          orders.length
            ? t('acct_orders.empty_desc_filtered')
            : t('acct_orders.empty_desc_none')
        "
      >
        <LazyVButton v-if="orders.length" variant="primary" @click="reset">{{
          t("btn.clear_filters")
        }}</LazyVButton>

        <LazyVButton v-else variant="primary" to="/products">{{
          t("btn.browse_the_catalog")
        }}</LazyVButton>
      </LazyVEmptyState>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n();

const { orders, pending, error, refresh } = useAccount();

const search = ref("");
const status = ref("all");
const quarter = ref("all");
const port = ref("all");
const page = ref(1);
const mobileLimit = ref(5);
const perPage = 5;

const crumbs = computed(() => [
  { label: t("acct_ui.crumb_home"), to: "/" },
  { label: t("acct_ui.crumb_workspace"), to: "/account" },
  { label: t("acct_ui.crumb_orders") },
]);

const quarterOptions = computed(() => [
  { value: "all", label: t("acct_orders.all_quarters") },
  ...[...new Set(orders.value.map(orderQuarter).filter(Boolean))].map((q) => ({
    value: q,
    label: q,
  })),
]);

const portOptions = computed(() => [
  { value: "all", label: t("acct_orders.all_ports") },
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
  title: () => `${t("acct_orders.page_title")} — PrintPro`,
  description: () => t("acct_orders.seo_desc"),
});
</script>