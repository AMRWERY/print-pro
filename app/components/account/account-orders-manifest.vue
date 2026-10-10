<template>
  <section class="rounded-card border border-line bg-surface p-5 sm:p-6" aria-labelledby="orders-manifest-title">
    <!-- Header with controls -->
    <header class="flex flex-col gap-4 border-b border-line pb-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div class="flex items-center gap-2">
          <span class="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
          <h2 id="orders-manifest-title" class="font-display text-lg font-bold text-paper sm:text-xl">
            Recent Orders &amp; Requisitions Manifest
          </h2>
          <span class="rounded-full bg-raised px-2 py-0.5 font-mono text-[11px] text-mute">
            {{ orders.length }} Active
          </span>
        </div>
        <p class="mt-0.5 text-xs text-mute">
          Calibrated apparatus, sealed roll media, and trace-telemetry tracked shipments
        </p>
      </div>

      <!-- Action buttons -->
      <div class="flex flex-wrap items-center gap-2">
        <div class="relative min-w-36">
          <input v-model="searchQuery" type="search" placeholder="Filter Requisition #"
            class="w-full rounded-control border border-line bg-ink/60 px-3 py-1.5 font-mono text-xs text-paper placeholder:text-mute focus:border-accent focus:outline-none" />
        </div>

        <button type="button"
          class="inline-flex items-center gap-1.5 rounded-control border border-line bg-surface px-3 py-1.5 font-mono text-xs text-mute transition hover:border-accent hover:text-paper"
          @click="exportLedger">
          <Icon name="lucide:download" size="13" aria-hidden="true" />
          <span>EXPORT CSV</span>
        </button>
      </div>
    </header>

    <!-- Orders list -->
    <div class="mt-4 space-y-4">
      <article v-for="order in filteredOrders" :key="order.id"
        class="rounded-card border border-line bg-ink/30 p-4 transition duration-200 hover:border-accent/30">
        <!-- Top order info bar -->
        <div class="flex flex-wrap items-start justify-between gap-3 border-b border-line/60 pb-3">
          <div class="space-y-1">
            <div class="flex flex-wrap items-center gap-2 font-mono text-xs">
              <span class="font-bold text-accent">{{ order.id }}</span>
              <span class="text-line">•</span>
              <span class="rounded-control px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider" :class="order.status === 'in-transit'
                ? 'border border-accent/40 bg-accent-soft text-accent'
                : order.status === 'delivered'
                  ? 'border border-success/40 bg-success-soft text-success'
                  : 'border border-line bg-raised text-mute'
                ">
                {{ order.statusLabel }}
              </span>
              <span v-if="order.badgeLabel" class="text-mute">
                // {{ order.badgeLabel }}
              </span>
            </div>

            <p v-if="order.waybill" class="font-mono text-[11px] text-mute">
              WAYBILL: <span class="text-paper">{{ order.waybill }}</span>
            </p>
            <p v-else-if="order.serial" class="font-mono text-[11px] text-mute">
              Serial: <span class="text-paper">{{ order.serial }}</span> • {{ order.date }}
            </p>
            <p v-else-if="order.date" class="font-mono text-[11px] text-mute">
              Order Date: <span class="text-paper">{{ order.date }}</span>
            </p>
          </div>

          <div class="text-end">
            <span class="font-display text-xl font-bold text-paper">
              {{ money.format(order.amount) }}
            </span>
          </div>
        </div>

        <!-- Order Items & Description -->
        <div class="mt-3 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div class="space-y-2">
            <h3 class="font-display text-base font-semibold text-paper">
              {{ order.title }}
            </h3>

            <!-- Item thumbnails -->
            <div class="flex items-center gap-2">
              <div v-for="(item, idx) in order.items" :key="idx"
                class="relative h-12 w-12 overflow-hidden rounded-control border border-line bg-surface"
                :title="item.name">
                <img v-if="item.thumb" :src="item.thumb" :alt="item.name" class="h-full w-full object-contain p-1" />
                <div v-else class="grid h-full w-full place-items-center bg-raised text-mute">
                  <Icon :name="item.icon || 'lucide:box'" size="16" />
                </div>
                <span v-if="item.quantity && item.quantity > 1"
                  class="absolute bottom-0 end-0 rounded-tl bg-accent px-1 font-mono text-[9px] font-bold text-onaccent">
                  x{{ item.quantity }}
                </span>
              </div>
            </div>

            <!-- Route metadata -->
            <div v-if="order.dispatchedFrom || order.traceTelemetry || order.benchVerified || order.calibrationLog"
              class="space-y-0.5 font-mono text-[11px] text-mute">
              <p v-if="order.dispatchedFrom">
                Dispatched: <span class="text-paper">{{ order.dispatchedFrom }}</span>
                <span v-if="order.destination"> → Destination: <span class="text-paper">{{ order.destination
                    }}</span></span>
              </p>
              <p v-if="order.traceTelemetry" class="text-cyan">
                TRACE: {{ order.traceTelemetry }}
              </p>
              <p v-if="order.benchVerified" class="text-success">
                Bench Verified: {{ order.benchVerified }}
              </p>
              <p v-if="order.calibrationLog" class="text-mute">
                {{ order.calibrationLog }}
              </p>
            </div>
          </div>
        </div>

        <!-- Telemetry bar for in-transit order -->
        <div v-if="order.flight"
          class="mt-3 rounded-control border border-line/60 bg-ink/70 p-2.5 font-mono text-[11px] text-mute space-y-2">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div class="flex flex-wrap items-center gap-3">
              <span class="font-bold text-paper">FLIGHT: {{ order.flight.code }} ({{ order.flight.route }})</span>
              <span>ALTITUDE: <span class="text-paper">{{ order.flight.altitude }}</span></span>
              <span>CARGO TEMP: <span class="text-paper">{{ order.flight.cargoTemp }}</span></span>
              <span>RELATIVE HUMIDITY: <span class="text-paper">{{ order.flight.humidity }}</span></span>
            </div>
            <span class="inline-flex items-center gap-1.5 font-bold text-success">
              <span class="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              STATUS: {{ order.flight.status }}
            </span>
          </div>

          <!-- Stepper stages -->
          <div class="grid grid-cols-4 gap-1 pt-1">
            <div v-for="(st, sidx) in order.flight.stages" :key="st" class="space-y-1">
              <div class="h-1 rounded-full transition duration-300" :class="sidx <= order.flight.currentStageIndex
                ? 'bg-accent'
                : 'bg-line'
                " />
              <p class="truncate text-[10px]" :class="sidx === order.flight.currentStageIndex
                ? 'font-bold text-accent'
                : 'text-mute'
                ">
                {{ st }}
              </p>
            </div>
          </div>
        </div>

        <!-- Card bottom action buttons -->
        <div class="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line/60 pt-3">
          <div class="flex flex-wrap items-center gap-2">
            <template v-if="order.status === 'in-transit'">
              <button type="button"
                class="inline-flex items-center gap-1.5 rounded-control bg-accent px-3 py-1.5 font-mono text-xs font-semibold text-onaccent shadow-sm transition hover:brightness-110 active:scale-95"
                @click="$emit('open-telemetry', order)">
                <span class="relative flex h-2 w-2">
                  <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                  <span class="relative inline-flex h-2 w-2 rounded-full bg-white" />
                </span>
                TRACK LIVE TELEMETRY
              </button>
              <button type="button"
                class="inline-flex items-center gap-1.5 rounded-control border border-line bg-surface px-3 py-1.5 font-mono text-xs text-mute transition hover:border-accent hover:text-paper"
                @click="$emit('view-waybill', order)">
                <Icon name="lucide:file-text" size="13" />
                WAYBILL PDF
              </button>
            </template>

            <template v-else-if="order.status === 'delivered'">
              <button type="button"
                class="inline-flex items-center gap-1.5 rounded-control border border-line bg-surface px-3 py-1.5 font-mono text-xs text-mute transition hover:border-accent hover:text-paper"
                @click="$emit('view-calibration-cert', order)">
                <Icon name="lucide:award" size="13" />
                CALIBRATION CERT (PDF)
              </button>
              <button type="button"
                class="inline-flex items-center gap-1.5 rounded-control border border-line bg-surface px-3 py-1.5 font-mono text-xs text-mute transition hover:border-accent hover:text-paper"
                @click="$emit('reorder-consumables', order)">
                <Icon name="lucide:refresh-cw" size="13" />
                RE-ORDER CONSUMABLES
              </button>
            </template>

            <template v-else>
              <button type="button"
                class="inline-flex items-center gap-1.5 rounded-control border border-line bg-surface px-3 py-1.5 font-mono text-xs text-mute transition hover:border-accent hover:text-paper"
                @click="$emit('view-dossier', order)">
                <Icon name="lucide:archive" size="13" />
                VIEW REQUISITION DOSSIER
              </button>
            </template>
          </div>

          <span class="font-mono text-xs text-mute">
            Zero Bead Pixel Warranty Active
          </span>
        </div>
      </article>
    </div>

    <!-- Manifest Footer -->
    <footer
      class="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3 font-mono text-xs text-mute">
      <span>Showing {{ filteredOrders.length }} of 24 Total Orders</span>
      <button type="button" class="inline-flex items-center gap-1 text-accent transition hover:underline"
        @click="$emit('view-fiscal-archive')">
        View Complete Fiscal Archive
        <Icon name="lucide:arrow-right" size="13" />
      </button>
    </footer>
  </section>
</template>

<script lang="ts" setup>
import type { RequisitionOrder } from "~/types/account";

const props = defineProps<{
  orders: RequisitionOrder[];
}>();

defineEmits<{
  (e: "open-telemetry", order: RequisitionOrder): void;
  (e: "view-waybill", order: RequisitionOrder): void;
  (e: "view-calibration-cert", order: RequisitionOrder): void;
  (e: "reorder-consumables", order: RequisitionOrder): void;
  (e: "view-dossier", order: RequisitionOrder): void;
  (e: "view-fiscal-archive"): void;
}>();

const money = useMoney();
const searchQuery = ref("");

const filteredOrders = computed(() => {
  if (!searchQuery.value.trim()) return props.orders;
  const q = searchQuery.value.toLowerCase().trim();
  return props.orders.filter(
    (o) =>
      o.id.toLowerCase().includes(q) ||
      o.title.toLowerCase().includes(q) ||
      o.statusLabel.toLowerCase().includes(q) ||
      (o.waybill && o.waybill.toLowerCase().includes(q)),
  );
});

const exportLedger = () => {
  const headers = ["Order ID", "Title", "Status", "Amount", "Waybill"];
  const rows = props.orders.map((o) => [
    o.id,
    `"${o.title.replace(/"/g, '""')}"`,
    o.statusLabel,
    o.amount,
    o.waybill ?? "",
  ]);
  const csvContent =
    "data:text/csv;charset=utf-8," +
    [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "atelier-orders-manifest.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
</script>