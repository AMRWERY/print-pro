<template>
  <div class="text-paper">
    <!-- Atelier Simulation Harness (Top sticky mode bar) -->
    <account-sim-harness v-model="operatingMode" />

    <div class="space-y-6">
      <LazyVBreadcrumb :items="crumbs" />

      <!-- DESKTOP EXPERIENCE (Large Screens) -->
      <div class="hidden lg:block">
        <div class="min-w-0 space-y-6">
          <!-- Hero Header -->
          <account-hero
            :profile="currentProfile"
            @initiate-calibration="openCalibrationModal = true"
            @book-cleanroom="openCleanroomModal = true"
            @request-courier="
              showToast(
                'Bonded courier request dispatched to DHL Global Forwarding Aviation',
              )
            "
            @view-vat-dossier="openDossier('TAX VAT DOSSIER // FISCAL Q3')"
          />

          <!-- 4 Stat Metric Cards -->
          <account-metrics
            :order-count="metricValues.orderCount"
            :settled-total="metricValues.settledTotal"
            :active-transit-count="metricValues.transitCount"
            :active-crate-code="metricValues.crateCode"
            :apparatus-count="metricValues.apparatusCount"
            :registry-valuation="metricValues.registryValuation"
            :escrow-amount="metricValues.escrowAmount"
          />

          <!-- Tab: Overview or Orders -->
          <div class="space-y-6">
            <!-- Empty state for New Member Mode -->
            <LazyVEmptyState
              v-if="operatingMode === 'new-member'"
              icon="lucide:sparkles"
              eyebrow="ATELIER :: NEW_MEMBER"
              tag="0 ORDERS"
              tag-tone="success"
              title="Welcome to the Metrology Atelier Network"
              description="Your studio credentials are confirmed. Link your designated receiving port, reserve apparatus, or initiate your first bench calibration."
            >
              <LazyVButton variant="primary" @click="openCalibrationModal = true"
                >Initiate first calibration</LazyVButton
              >
              <LazyVButton variant="secondary" to="/products"
                >Explore apparatus catalog</LazyVButton
              >
            </LazyVEmptyState>

            <!-- Orders Manifest -->
            <account-orders-manifest
              v-else
              :orders="currentOrders"
              @open-telemetry="openTelemetry"
              @view-waybill="
                openDossier(`AIR WAYBILL // ${$event.waybill || $event.id}`)
              "
              @view-calibration-cert="
                openDossier(`CALIBRATION CERTIFICATE // ${$event.id}`)
              "
              @reorder-consumables="reorderItems($event)"
              @view-dossier="viewOrder($event)"
              @view-fiscal-archive="navigateTo(localePath('/account/orders'))"
            />
          </div>

          <!-- Tab: Overview or Registry -->
          <div class="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <!-- Studio Registry & Reserved Apparatus -->
            <account-registry-section
              :items="registryItems"
              @add-to-manifest="addToCartItem($event)"
            />

            <!-- Receiving Docks & Ports -->
            <account-docks-section
              :docks="receivingDocks"
              @edit-dock="editDock($event)"
              @deploy-dock="deployNewDock"
            />
          </div>

          <!-- Tab: Overview or Vault -->
          <div class="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_1.9fr]">
            <!-- Cryptographic Audit Stream -->
            <account-audit-stream :logs="auditLogs" />

            <!-- Curated Companion Apparatus & Consumables -->
            <account-curated-companions
              :products="companionProducts"
              @add-companion="addCompanionItem($event)"
            />
          </div>

          <!-- Compliance & Technical Accreditation Footer -->
          <account-compliance-footer />
        </div>
      </div>

      <!-- MOBILE EXPERIENCE (Small Screens) -->
      <div class="lg:hidden">
        <account-mobile-view
          :profile="currentProfile"
          :orders="currentOrders"
          :registry-items="registryItems"
          @new-order="openCalibrationModal = true"
          @open-crate="openTelemetry($event)"
          @open-escrow="
            showToast(
              `Escrow Pool Liquidity: ${money.format(currentProfile.escrowAvailable)} Instant Clearance`,
            )
          "
          @open-telemetry="openTelemetry($event)"
          @add-registry="addToCartItem($event)"
          @change-dock="deployNewDock"
        />
      </div>
    </div>

    <!-- Modals -->
    <telemetry-modal
      :open="openTelemetryModal"
      :order="selectedOrder"
      @close="openTelemetryModal = false"
    />

    <calibration-modal
      :open="openCalibrationModal"
      @close="openCalibrationModal = false"
      @submitted="onCalibrationSubmitted"
    />

    <cleanroom-modal
      :open="openCleanroomModal"
      @close="openCleanroomModal = false"
      @booked="onCleanroomBooked"
    />

    <dock-modal
      :open="openDockModal"
      :dock="editingDock"
      @close="openDockModal = false"
      @saved="onDockSaved"
    />

    <dossier-modal
      :open="openDossierModal"
      :title="dossierTitle"
      @close="openDossierModal = false"
    />
  </div>
</template>

<script lang="ts" setup>
import {
  defaultAuditLogs,
  defaultCompanionProducts,
  defaultRegistryItems,
  highVolumeExtraOrders,
} from "~/data/account";
import { allProducts } from "~/data/product-details";
import type {
  AtelierProfile,
  CompanionProduct,
  OperatingMode,
  ReceivingDock,
  RegistryItem,
  RequisitionOrder,
} from "~/types/account";

const cart = useCartStore();
const docks = useDockStore();
const money = useMoney();
const localePath = useLocalePath();
const { profile, orders: ownOrders } = useAccount();

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

const toast = useToast();
const showToast = (msg: string) => toast.success(msg);

const registryItems = ref<RegistryItem[]>([...defaultRegistryItems]);
const receivingDocks = computed(() => docks.list);
const auditLogs = ref([...defaultAuditLogs]);
const companionProducts = ref<CompanionProduct[]>([
  ...defaultCompanionProducts,
]);

const currentProfile = computed<AtelierProfile>(() => {
  const base = { ...profile.value };
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
  if (operatingMode.value === "new-member") return [];
  const own = ownOrders.value;
  // The dashboard shows the latest few; the full ledger lives on /account/orders.
  return (
    operatingMode.value === "high-volume"
      ? [...own, ...highVolumeExtraOrders]
      : own
  ).slice(0, 3);
});

const metricValues = computed(() => {
  switch (operatingMode.value) {
    case "new-member":
      return {
        orderCount: 0,
        settledTotal: 0,
        transitCount: 0,
        crateCode: "NO ACTIVE CRATE",
        apparatusCount: 3,
        registryValuation: 4593,
        escrowAmount: 5000,
      };
    case "high-volume":
      return {
        orderCount: 44,
        settledTotal: 189450,
        transitCount: 3,
        crateCode: "#LP-948201",
        apparatusCount: 18,
        registryValuation: 94500,
        escrowAmount: 38500,
      };
    case "vip-escrow":
      return {
        orderCount: 24,
        settledTotal: 78500,
        transitCount: 1,
        crateCode: "#LP-948201",
        apparatusCount: 8,
        registryValuation: 34150,
        escrowAmount: 45000,
      };
    default:
      return {
        orderCount: 24,
        settledTotal: 45000,
        transitCount: 1,
        crateCode: "#LP-948201",
        apparatusCount: 8,
        registryValuation: 34150,
        escrowAmount: 12450,
      };
  }
});

// Modal Handlers
const openTelemetry = (order?: RequisitionOrder | null) => {
  selectedOrder.value =
    order || currentOrders.value.find((o) => o.status === "in-transit") || null;
  openTelemetryModal.value = true;
};

const openDossier = (title: string) => {
  dossierTitle.value = title;
  openDossierModal.value = true;
};

const viewOrder = (order: RequisitionOrder) =>
  navigateTo(localePath(`/account/orders/${orderSlug(order.id)}`));

const editDock = (dock: ReceivingDock) => {
  editingDock.value = dock;
  openDockModal.value = true;
};

const deployNewDock = () => {
  editingDock.value = null;
  openDockModal.value = true;
};

const onDockSaved = (dock: ReceivingDock) => {
  const isNew = !docks.list.some((d) => d.id === dock.id);
  docks.save(dock);
  showToast(
    isNew
      ? `Deployed new receiving port: ${dock.name}`
      : `Updated receiving port: ${dock.name}`,
  );
};

const onCalibrationSubmitted = (details: {
  standard: string;
  tolerance: string;
  substrate: string;
  station: string;
}) => {
  showToast(
    `Calibration order submitted for ${details.standard.toUpperCase()} (Tolerance: ${details.tolerance})`,
  );
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

const onCleanroomBooked = (details: {
  location: string;
  date: string;
  slot: string;
}) => {
  showToast(
    `Cleanroom bench reserved at ${details.location} on ${details.date} (${details.slot})`,
  );
};

// Cart integrations: items resolve through the shared product lookup
const addToCartItem = (item: RegistryItem) => {
  cart.add(item.id, item.price);
  showToast(`Added ${item.name} to requisition manifest`);
};

const addCompanionItem = (prod: CompanionProduct) => {
  cart.add(prod.id, prod.price);
  showToast(`Added ${prod.name} to studio cart`);
};

const reorderItems = (order: RequisitionOrder) => {
  let added = 0;
  for (const item of order.items) {
    const product = allProducts.find(
      (p) => p.id === item.sku || p.sku === item.sku || p.name === item.name,
    );
    if (!product) continue;
    cart.add(product.id, product.price, { qty: item.quantity ?? 1 });
    added++;
  }
  showToast(
    added
      ? `Re-ordered items from ${order.id}`
      : `Items from ${order.id} are no longer available`,
  );
};

const crumbs = [
  { label: "Studio procurement", to: "/" },
  { label: "Atelier workspace", to: "/account" },
  { label: "Account dashboard" },
];

definePageMeta({
  layout: "account",
});

useSeoMeta({
  title: "Atelier Workspace & Dashboard — Lumen & Press",
  description:
    "Curatorial studio dashboard, live armored telemetry tracking, apparatus registry, and escrow management.",
});
</script>
