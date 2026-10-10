<template>
  <div class="min-h-screen bg-ink text-paper transition-colors duration-200">
    <!-- Atelier Simulation Harness (Top sticky mode bar) -->
    <account-sim-harness v-model="operatingMode" />

    <!-- Toast Alert Notification -->
    <Transition name="toast">
      <div v-if="toastMessage" role="alert"
        class="fixed bottom-6 end-6 z-50 flex items-center gap-2.5 rounded-card border border-accent/40 bg-surface px-4 py-3 font-mono text-xs text-paper shadow-2xl shadow-black/60">
        <span class="h-2 w-2 rounded-full bg-accent animate-ping" />
        <span>{{ toastMessage }}</span>
      </div>
    </Transition>

    <div class="container-page py-6 lg:py-8 space-y-6">
      <!-- Breadcrumb -->
      <LazyVBreadcrumb :items="crumbs" />

      <!-- DESKTOP EXPERIENCE (Large Screens) -->
      <div class="hidden lg:grid lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-6 items-start">
        <!-- Sticky Left Sidebar -->
        <account-sidebar :active-tab="activeTab" :order-count="currentOrders.length"
          :registry-count="registryItems.length" class="sticky top-20" @select-tab="activeTab = $event" />

        <!-- Main Workspace Area -->
        <main class="min-w-0 space-y-6">
          <!-- Hero Header -->
          <account-hero :profile="currentProfile" @initiate-calibration="openCalibrationModal = true"
            @book-cleanroom="openCleanroomModal = true"
            @request-courier="showToast('Bonded courier request dispatched to DHL Global Forwarding Aviation')"
            @view-vat-dossier="openDossier('TAX VAT DOSSIER // FISCAL Q3')" />

          <!-- 4 Stat Metric Cards -->
          <account-metrics :order-count="metricValues.orderCount" :settled-total="metricValues.settledTotal"
            :active-transit-count="metricValues.transitCount" :active-crate-code="metricValues.crateCode"
            :apparatus-count="metricValues.apparatusCount" :registry-valuation="metricValues.registryValuation"
            :escrow-amount="metricValues.escrowAmount" />

          <!-- Tab: Overview or Orders -->
          <div v-show="activeTab === 'overview' || activeTab === 'orders'" class="space-y-6">
            <!-- Empty state for New Member Mode -->
            <div v-if="operatingMode === 'new-member'"
              class="rounded-card border border-dashed border-line bg-surface p-8 text-center space-y-4">
              <div class="mx-auto grid h-16 w-16 place-items-center rounded-full bg-raised text-accent">
                <Icon name="lucide:sparkles" size="28" />
              </div>
              <div class="space-y-1">
                <h3 class="font-display text-xl font-bold text-paper">
                  Welcome to the Metrology Atelier Network
                </h3>
                <p class="max-w-md mx-auto text-sm text-mute">
                  Your studio credentials are confirmed. Link your designated receiving port, reserve apparatus, or
                  initiate your first bench calibration.
                </p>
              </div>
              <div class="flex flex-wrap justify-center gap-3 pt-2">
                <button type="button"
                  class="rounded-control bg-accent px-4 py-2 font-mono text-xs font-bold text-onaccent hover:brightness-110"
                  @click="openCalibrationModal = true">
                  INITIATE FIRST CALIBRATION
                </button>
                <NuxtLinkLocale to="/products"
                  class="rounded-control border border-line bg-surface px-4 py-2 font-mono text-xs text-mute hover:text-paper">
                  EXPLORE APPARATUS CATALOG
                </NuxtLinkLocale>
              </div>
            </div>

            <!-- Orders Manifest -->
            <account-orders-manifest v-else :orders="currentOrders" @open-telemetry="openTelemetry"
              @view-waybill="openDossier(`AIR WAYBILL // ${$event.waybill || $event.id}`)"
              @view-calibration-cert="openDossier(`CALIBRATION CERTIFICATE // ${$event.id}`)"
              @reorder-consumables="reorderItems($event)"
              @view-dossier="openDossier(`REQUISITION DOSSIER // ${$event.id}`)"
              @view-fiscal-archive="openDossier('COMPLETE FISCAL ARCHIVE (2024-2026)')" />
          </div>

          <!-- Tab: Overview or Registry -->
          <div v-show="activeTab === 'overview' || activeTab === 'registry'"
            class="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <!-- Studio Registry & Reserved Apparatus -->
            <account-registry-section :items="registryItems" @add-to-manifest="addToCartItem($event)" />

            <!-- Receiving Docks & Ports -->
            <account-docks-section :docks="receivingDocks" @edit-dock="editDock($event)" @deploy-dock="deployNewDock" />
          </div>

          <!-- Tab: Overview or Vault -->
          <div v-show="activeTab === 'overview' || activeTab === 'vault'"
            class="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_1.9fr]">
            <!-- Cryptographic Audit Stream -->
            <account-audit-stream :logs="auditLogs" />

            <!-- Curated Companion Apparatus & Consumables -->
            <account-curated-companions :products="companionProducts" @add-companion="addCompanionItem($event)" />
          </div>

          <!-- Compliance & Technical Accreditation Footer -->
          <account-compliance-footer />
        </main>
      </div>

      <!-- MOBILE EXPERIENCE (Small Screens) -->
      <div class="lg:hidden">
        <account-mobile-view :profile="currentProfile" :orders="currentOrders" :registry-items="registryItems"
          @new-order="openCalibrationModal = true" @open-crate="openTelemetry($event)"
          @open-escrow="showToast(`Escrow Pool Liquidity: ${money.format(currentProfile.escrowAvailable)} Instant Clearance`)"
          @open-telemetry="openTelemetry($event)" @add-registry="addToCartItem($event)" @change-dock="deployNewDock" />
      </div>
    </div>

    <!-- Modals -->
    <telemetry-modal :open="openTelemetryModal" :order="selectedOrder" @close="openTelemetryModal = false" />

    <calibration-modal :open="openCalibrationModal" @close="openCalibrationModal = false"
      @submitted="onCalibrationSubmitted" />

    <cleanroom-modal :open="openCleanroomModal" @close="openCleanroomModal = false" @booked="onCleanroomBooked" />

    <dock-modal :open="openDockModal" :dock="editingDock" @close="openDockModal = false" @saved="onDockSaved" />

    <dossier-modal :open="openDossierModal" :title="dossierTitle" @close="openDossierModal = false" />
  </div>
</template>

<script lang="ts" setup>
import {
  defaultAtelierProfile,
  defaultAuditLogs,
  defaultCompanionProducts,
  defaultOrders,
  defaultReceivingDocks,
  defaultRegistryItems,
  highVolumeExtraOrders,
} from "~/data/account";
import type {
  AtelierProfile,
  AtelierTab,
  CompanionProduct,
  OperatingMode,
  ReceivingDock,
  RegistryItem,
  RequisitionOrder,
} from "~/types/account";

const auth = useAuthStore();
const cart = useCartStore();
const money = useMoney();

// Page Navigation State
const activeTab = ref<AtelierTab>("overview");
const operatingMode = ref<OperatingMode>("standard");

// Modals State
const openTelemetryModal = ref(false);
const openCalibrationModal = ref(false);
const openCleanroomModal = ref(false);
const openDockModal = ref(false);
const openDossierModal = ref(false);
const dossierTitle = ref("ARCHIVAL REQUISITION DOSSIER");
const selectedOrder = ref<RequisitionOrder | null>(null);
const editingDock = ref<ReceivingDock | null>(null);

// Toast Notification
const toastMessage = ref("");
let toastTimer: any = null;
const showToast = (msg: string) => {
  toastMessage.value = msg;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastMessage.value = "";
  }, 3500);
};

// Dynamic Data bound to operating mode
const registryItems = ref<RegistryItem[]>([...defaultRegistryItems]);
const receivingDocks = ref<ReceivingDock[]>([...defaultReceivingDocks]);
const auditLogs = ref([...defaultAuditLogs]);
const companionProducts = ref<CompanionProduct[]>([...defaultCompanionProducts]);

const currentProfile = computed<AtelierProfile>(() => {
  const base = { ...defaultAtelierProfile };
  if (operatingMode.value === "vip-escrow") {
    base.escrowAvailable = 45000;
    base.escrowLimit = 75000;
  } else if (operatingMode.value === "new-member") {
    base.escrowAvailable = 5000;
    base.escrowLimit = 15000;
  }
  return base;
});

const currentOrders = computed<RequisitionOrder[]>(() => {
  if (operatingMode.value === "new-member") {
    return [];
  }
  if (operatingMode.value === "high-volume") {
    return [...defaultOrders, ...highVolumeExtraOrders];
  }
  return defaultOrders;
});

const metricValues = computed(() => {
  if (operatingMode.value === "new-member") {
    return {
      orderCount: 0,
      settledTotal: 0,
      transitCount: 0,
      crateCode: "NO ACTIVE CRATE",
      apparatusCount: 3,
      registryValuation: 4593,
      escrowAmount: 5000,
    };
  }
  if (operatingMode.value === "high-volume") {
    return {
      orderCount: 44,
      settledTotal: 189450,
      transitCount: 3,
      crateCode: "#LP-948201",
      apparatusCount: 18,
      registryValuation: 94500,
      escrowAmount: 38500,
    };
  }
  if (operatingMode.value === "vip-escrow") {
    return {
      orderCount: 24,
      settledTotal: 78500,
      transitCount: 1,
      crateCode: "#LP-948201",
      apparatusCount: 8,
      registryValuation: 34150,
      escrowAmount: 45000,
    };
  }
  return {
    orderCount: 24,
    settledTotal: 45000,
    transitCount: 1,
    crateCode: "#LP-948201",
    apparatusCount: 8,
    registryValuation: 34150,
    escrowAmount: 12450,
  };
});

// Modal Handlers
const openTelemetry = (order?: RequisitionOrder | null) => {
  selectedOrder.value = order || currentOrders.value.find((o) => o.status === "in-transit") || null;
  openTelemetryModal.value = true;
};

const openDossier = (title: string) => {
  dossierTitle.value = title;
  openDossierModal.value = true;
};

const editDock = (dock: ReceivingDock) => {
  editingDock.value = dock;
  openDockModal.value = true;
};

const deployNewDock = () => {
  editingDock.value = null;
  openDockModal.value = true;
};

const onDockSaved = (dock: ReceivingDock) => {
  const idx = receivingDocks.value.findIndex((d) => d.id === dock.id);
  if (idx !== -1) {
    receivingDocks.value[idx] = dock;
    showToast(`Updated receiving port: ${dock.name}`);
  } else {
    receivingDocks.value.push(dock);
    showToast(`Deployed new receiving port: ${dock.name}`);
  }
};

const onCalibrationSubmitted = (details: any) => {
  showToast(`Calibration order submitted for ${details.standard.toUpperCase()} (Tolerance: ${details.tolerance})`);
  auditLogs.value.unshift({
    id: `audit-${Date.now()}`,
    title: "CALIBRATION ORDER REGISTERED",
    timestamp: "JUST NOW",
    summary: `Spectro proof order initiated for ${details.substrate} at ${details.station}.`,
    hash: `SHA-256: 4e99f...${Date.now().toString(16).slice(-4)}`,
    category: "qa",
    severity: "verified",
  });
};

const onCleanroomBooked = (details: any) => {
  showToast(`Cleanroom bench reserved at ${details.location} on ${details.date} (${details.slot})`);
};

// Cart Integrations
const addToCartItem = (item: RegistryItem) => {
  cart.add({
    id: item.id,
    sku: `LP-REG-${item.id}`,
    category: "digital",
    dispatch: "in-stock",
    group: "camera",
    badge: { label: "Registry allocation", tone: "info", icon: "lucide:check" },
    brand: "Atelier Registry",
    name: item.name,
    blurb: item.specNotes,
    specs: ["Atelier Allocated", "Bench QA"],
    rating: 5,
    reviews: 1,
    price: item.price,
    lease: 0,
    icon: (item.icon as any) || "lucide:box",
    image: item.image,
  });
  showToast(`Added ${item.name} to requisition manifest`);
};

const addCompanionItem = (prod: CompanionProduct) => {
  cart.add({
    id: prod.id,
    sku: `LP-COMP-${prod.id}`,
    category: "substrates",
    dispatch: "in-stock",
    group: "print",
    badge: { label: prod.badge, tone: "success", icon: "lucide:check" },
    brand: "Lumen & Press",
    name: prod.name,
    blurb: prod.description,
    specs: [prod.tag, "Certified"],
    rating: 5,
    reviews: 1,
    price: prod.price,
    lease: 0,
    icon: (prod.icon as any) || "lucide:box",
    image: prod.image,
  });
  showToast(`Added ${prod.name} to studio cart`);
};

const reorderItems = (order: RequisitionOrder) => {
  for (const item of order.items) {
    cart.add({
      id: item.sku || `reorder-${Date.now()}`,
      sku: item.sku || "LP-REORDER",
      category: "lighting",
      dispatch: "in-stock",
      group: "lighting",
      badge: { label: "Re-order", tone: "info", icon: "lucide:refresh-cw" },
      brand: "Lumen & Press",
      name: item.name,
      blurb: "Re-ordered studio consumable",
      specs: ["Bench Tested"],
      rating: 5,
      reviews: 1,
      price: Math.round(order.amount / order.items.length),
      lease: 0,
      icon: (item.icon as any) || "lucide:zap",
      image: item.thumb,
    });
  }
  showToast(`Re-ordered consumables from ${order.id}`);
};

const crumbs = [
  { label: "Studio procurement", to: "/" },
  { label: "Atelier workspace", to: "/account" },
  { label: "Account dashboard" },
];

useSeoMeta({
  title: "Atelier Workspace & Dashboard — Lumen & Press",
  description:
    "Curatorial studio dashboard, live armored telemetry tracking, apparatus registry, and escrow management.",
});
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition:
    transform 0.25s ease-out,
    opacity 0.25s ease-out;
}

.toast-enter-from,
.toast-leave-to {
  transform: translateY(12px);
  opacity: 0;
}
</style>