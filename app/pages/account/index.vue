<template>
  <div class="text-paper">
    <!-- Demo account switcher (top sticky bar) -->
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
                'Courier request sent. We will confirm the pick-up time by phone.',
              )
            "
            @view-vat-dossier="openDossier('VAT INVOICE SUMMARY // Q3')"
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
              v-if="showWelcome"
              icon="lucide:sparkles"
              eyebrow="ACCOUNT :: NEW_CUSTOMER"
              tag="0 ORDERS"
              tag-tone="success"
              title="Welcome to PrintPro"
              description="Your account is ready. Add a delivery address, save products for later, or place your first order for supplies."
            >
              <LazyVButton
                variant="primary"
                @click="openCalibrationModal = true"
                >{{ t("btn.order_supplies") }}</LazyVButton
              >

              <LazyVButton variant="secondary" to="/products">{{
                t("btn.browse_the_catalog")
              }}</LazyVButton>
            </LazyVEmptyState>

            <!-- Orders -->
            <account-orders-manifest
              v-else
              :orders="currentOrders"
              @open-telemetry="openTelemetry"
              @view-waybill="
                openDossier(`DELIVERY NOTE // ${$event.waybill || $event.id}`)
              "
              @view-calibration-cert="
                openDossier(`SERVICE REPORT // ${$event.id}`)
              "
              @reorder-consumables="reorderItems($event)"
              @view-dossier="viewOrder($event)"
              @view-fiscal-archive="navigateTo(localePath('/account/orders'))"
            />
          </div>

          <!-- Tab: Overview or Registry -->
          <div class="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <!-- Saved items -->
            <account-registry-section
              :items="registryItems"
              @add-to-manifest="addToCartItem($event)"
            />

            <!-- Delivery addresses -->
            <account-docks-section
              :docks="receivingDocks"
              @edit-dock="editDock($event)"
              @deploy-dock="deployNewDock"
            />
          </div>

          <!-- Tab: Overview or Addresses -->
          <div class="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_1.9fr]">
            <!-- Cryptographic Audit Stream -->
            <account-audit-stream :logs="auditLogs" />

            <!-- Suggested supplies -->
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
              `Account credit available: ${money.format(currentProfile.escrowAvailable)}`,
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
import type {
  AtelierProfile,
  CompanionProduct,
  OperatingMode,
  ReceivingDock,
  RegistryItem,
  RequisitionOrder,
} from "~/types/account";

const catalog = useCatalogStore();
onMounted(() => catalog.ensureCatalog());
const { t } = useI18n();
const localePath = useLocalePath();

const cart = useCartStore();
const docks = useDockStore();
const money = useMoney();
const { profile, orders: ownOrders, pending: ordersPending, error: ordersError } = useAccount();

const operatingMode = ref<OperatingMode>("standard");

// Modals State
const openTelemetryModal = ref(false);
const openCalibrationModal = ref(false);
const openCleanroomModal = ref(false);
const openDockModal = ref(false);
const openDossierModal = ref(false);
const dossierTitle = ref("ORDER DOCUMENT");
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

// A new customer (or the "new member" demo mode) has nothing to list yet.
const showWelcome = computed(
  () =>
    operatingMode.value === "new-member" ||
    (operatingMode.value === "standard" &&
      !ordersPending.value &&
      !ordersError.value &&
      !ownOrders.value.length),
);

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
        crateCode: "NO ACTIVE DELIVERY",
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
      ? `Added delivery address: ${dock.name}`
      : `Updated delivery address: ${dock.name}`,
  );
};

const supplyLabel: Record<string, string> = {
  toner: "toner",
  ink: "ink",
  drum: "drum unit",
};
const modelLabel: Record<string, string> = {
  "corex-laser-210": "Corex Laser 210",
  "corex-laser-450c": "Corex Laser 450 Colour",
  "kopira-pro-a3-35": "Kopira Pro A3 35 ppm",
  "printa-tank-500": "Printa Tank 500",
  "nordjet-lf-44": 'Nordjet Large-Format 44"',
};
const addressLabel: Record<string, string> = {
  "head-office": "your head office",
  branch: "your branch office",
};

const onCalibrationSubmitted = (details: {
  standard: string;
  tolerance: string;
  substrate: string;
  station: string;
}) => {
  showToast(
    `Supplies order placed: ${details.tolerance} × ${supplyLabel[details.standard] ?? details.standard}`,
  );
  auditLogs.value.unshift({
    id: `audit-${Date.now()}`,
    title: "SUPPLIES ORDER PLACED",
    timestamp: "JUST NOW",
    summary: `Supplies for ${modelLabel[details.substrate] ?? details.substrate} ordered for delivery to ${addressLabel[details.station] ?? details.station}.`,
    hash: `ORDER REF: PP-${Date.now().toString(16).slice(-5).toUpperCase()}`,
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
    `Service visit booked at ${details.location} on ${details.date} (${details.slot})`,
  );
};

// Cart integrations: items resolve through the shared product lookup
const addToCartItem = (item: RegistryItem) => {
  cart.add(item.id, item.price);
  showToast(`Added ${item.name} to your cart`);
};

const addCompanionItem = (prod: CompanionProduct) => {
  cart.add(prod.id, prod.price);
  showToast(`Added ${prod.name} to your cart`);
};

const reorderItems = (order: RequisitionOrder) => {
  let added = 0;
  for (const item of order.items) {
    const product = catalog.all.find(
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
  { label: "Account", to: "/account" },
  { label: "Dashboard" },
  { label: "Account dashboard" },
];

definePageMeta({
  layout: "account",
});

useSeoMeta({
  title: "Account dashboard — PrintPro",
  description:
    "Your orders, delivery tracking, saved items and delivery addresses.",
});
</script>