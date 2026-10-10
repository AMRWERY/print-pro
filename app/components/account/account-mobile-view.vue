<template>
  <div class="space-y-4 pb-20 font-sans text-paper">
    <!-- Top Mobile App Header Bar -->
    <header
      class="flex items-center justify-between rounded-control border border-line bg-surface p-3 font-mono text-xs">
      <div class="flex items-center gap-2">
        <span class="relative flex h-2 w-2">
          <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
          <span class="relative inline-flex h-2 w-2 rounded-full bg-success" />
        </span>
        <span class="font-bold text-success">STUDIO ONLINE</span>
        <span class="text-line">|</span>
        <span class="flex items-center gap-1 text-mute">
          <Icon name="lucide:lock" size="12" />
          256-BIT
        </span>
      </div>

      <div class="flex items-center gap-3">
        <button type="button" class="relative text-mute hover:text-paper" aria-label="Studio notifications"
          @click="showNotifications = !showNotifications">
          <Icon name="lucide:bell" size="18" />
          <span class="absolute -top-1 -end-1 h-2 w-2 rounded-full bg-accent" />
        </button>

        <img :src="profile.avatarUrl" :alt="profile.name"
          class="h-8 w-8 rounded-full border border-line object-cover" />
      </div>
    </header>

    <!-- Subnav Segmented Pill Tabs -->
    <div
      class="grid grid-cols-3 gap-1 rounded-control border border-line bg-surface p-1 font-mono text-xs font-semibold"
      role="tablist" aria-label="Mobile sections">
      <button type="button" role="tab" :aria-selected="mobileTab === 'overview'"
        class="flex items-center justify-center gap-1.5 rounded-[4px] py-2 transition" :class="mobileTab === 'overview'
            ? 'bg-ink text-accent shadow-sm'
            : 'text-mute hover:text-paper'
          " @click="mobileTab = 'overview'">
        <span class="h-1.5 w-1.5 rounded-full bg-accent" />
        OVERVIEW
      </button>

      <button type="button" role="tab" :aria-selected="mobileTab === 'active'"
        class="flex items-center justify-center gap-1.5 rounded-[4px] py-2 transition" :class="mobileTab === 'active'
            ? 'bg-ink text-accent shadow-sm'
            : 'text-mute hover:text-paper'
          " @click="mobileTab = 'active'">
        ACTIVE ({{ activeOrderCount }})
      </button>

      <button type="button" role="tab" :aria-selected="mobileTab === 'registry'"
        class="flex items-center justify-center gap-1.5 rounded-[4px] py-2 transition" :class="mobileTab === 'registry'
            ? 'bg-ink text-accent shadow-sm'
            : 'text-mute hover:text-paper'
          " @click="mobileTab = 'registry'">
        REGISTRY ({{ registryItems.length }})
      </button>
    </div>

    <!-- Doctor Profile Card -->
    <section class="rounded-card border border-line bg-surface p-4">
      <div class="flex items-start justify-between gap-3">
        <div class="flex items-center gap-3">
          <div class="relative h-14 w-14 shrink-0 overflow-hidden rounded-control border border-line">
            <img :src="profile.avatarUrl" :alt="profile.name" class="h-full w-full object-cover" />
            <span class="absolute bottom-1 end-1 h-2.5 w-2.5 rounded-full border-2 border-surface bg-accent" />
          </div>

          <div class="space-y-0.5">
            <h2 class="font-display text-lg font-bold text-paper">
              {{ profile.name }}
            </h2>
            <p class="font-mono text-[11px] text-mute uppercase tracking-wider truncate max-w-[200px]">
              {{ profile.affiliation }}
            </p>
            <div class="flex items-center gap-2 font-mono text-[10px]">
              <span class="text-accent font-semibold">LEAD CONSERVATOR</span>
              <span class="text-mute">•</span>
              <span class="text-mute">BER ⇄ JFK OK</span>
            </div>
          </div>
        </div>

        <span class="rounded-control bg-raised p-2 text-mute">
          <Icon name="lucide:briefcase" size="18" />
        </span>
      </div>

      <!-- Quick Action Buttons -->
      <div class="mt-4 grid grid-cols-3 gap-2 font-mono text-xs font-semibold">
        <button type="button"
          class="flex items-center justify-center gap-1.5 rounded-control bg-accent py-2 text-onaccent shadow-sm transition hover:brightness-110 active:scale-95"
          @click="$emit('new-order')">
          <Icon name="lucide:plus" size="14" />
          <span>NEW ORDER</span>
        </button>

        <button type="button"
          class="flex items-center justify-center gap-1.5 rounded-control border border-line bg-raised py-2 text-mute transition hover:border-accent hover:text-paper active:scale-95"
          @click="$emit('open-crate', inTransitOrder)">
          <Icon name="lucide:plane" size="14" />
          <span>#948201</span>
        </button>

        <button type="button"
          class="flex items-center justify-center gap-1.5 rounded-control border border-line bg-raised py-2 text-mute transition hover:border-accent hover:text-paper active:scale-95"
          @click="$emit('open-escrow')">
          <Icon name="lucide:vault" size="14" />
          <span>ESCROW</span>
        </button>
      </div>
    </section>

    <!-- Key Metrics 3-Column Grid -->
    <div class="grid grid-cols-3 gap-2 font-mono text-xs">
      <div class="rounded-card border border-line bg-surface p-2.5 space-y-1">
        <div class="flex items-center justify-between text-mute text-[10px]">
          <span>TRANSIT</span>
          <span class="h-1.5 w-1.5 rounded-full bg-accent" />
        </div>
        <p class="font-display text-base font-bold text-paper">$18.2K</p>
        <p class="text-[10px] text-mute leading-tight">LH-400 • 1 SEAL</p>
      </div>

      <div class="rounded-card border border-line bg-surface p-2.5 space-y-1">
        <div class="flex items-center justify-between text-mute text-[10px]">
          <span>ESCROW</span>
          <Icon name="lucide:shield-check" size="10" class="text-cyan" />
        </div>
        <p class="font-display text-base font-bold text-paper">$32.5K</p>
        <p class="text-[10px] text-success leading-tight">AUTO-CLEAR ON</p>
      </div>

      <div class="rounded-card border border-line bg-surface p-2.5 space-y-1">
        <div class="flex items-center justify-between text-mute text-[10px]">
          <span>REGISTRY</span>
          <Icon name="lucide:bookmark" size="10" class="text-mute" />
        </div>
        <p class="font-display text-base font-bold text-paper">8 Units</p>
        <p class="text-[10px] text-accent leading-tight">2 ALLOCATED</p>
      </div>
    </div>

    <!-- Active In-Transit Shipment Card -->
    <article v-if="inTransitOrder" class="rounded-card border border-line bg-surface p-4 space-y-3">
      <div class="flex items-center justify-between border-b border-line pb-2.5">
        <div class="flex items-center gap-1.5 font-mono text-xs">
          <span class="rounded-control bg-accent/20 px-2 py-0.5 font-bold text-accent">
            {{ inTransitOrder.crateId || 'CRATE #LP-948201' }}
          </span>
          <span class="flex items-center gap-1 text-[11px] text-accent">
            <span class="h-1.5 w-1.5 rounded-full bg-accent animate-ping" />
            LIVE
          </span>
        </div>

        <span class="font-display text-base font-bold text-paper">
          {{ money.format(inTransitOrder.amount) }}
        </span>
      </div>

      <div>
        <h3 class="font-display text-base font-bold text-paper">
          Medium Format Optics &amp; Print Master
        </h3>
        <p class="font-mono text-[10px] text-mute uppercase tracking-wider mt-0.5">
          CARRIER: LUFTHANSA CARGO FLIGHT LH-400 (PALLET #88)
        </p>
      </div>

      <!-- Equipment Thumbnails -->
      <div class="flex items-center gap-2">
        <div class="flex items-center gap-2 rounded-control border border-line bg-ink/40 p-1.5">
          <img src="/img/prod-01.png" alt="Hasselblad" class="h-8 w-8 object-contain" />
          <span class="font-mono text-[10px] text-paper">Hasselblad 907X 50C</span>
        </div>
        <div class="flex items-center gap-2 rounded-control border border-line bg-ink/40 p-1.5">
          <img src="/img/prod-03.png" alt="Epson" class="h-8 w-8 object-contain" />
          <span class="font-mono text-[10px] text-paper">Epson Ultra...</span>
        </div>
      </div>

      <!-- Stepper / Route Progress -->
      <div class="space-y-1.5 pt-1">
        <div class="grid grid-cols-4 gap-1">
          <div class="h-1.5 rounded-full bg-accent" />
          <div class="h-1.5 rounded-full bg-accent" />
          <div class="h-1.5 rounded-full bg-accent animate-pulse" />
          <div class="h-1.5 rounded-full bg-line" />
        </div>

        <div class="grid grid-cols-4 text-center font-mono text-[9px]">
          <span class="text-mute">BER Cleared</span>
          <span class="text-mute">TXL Customs</span>
          <span class="font-bold text-accent">In Flight</span>
          <span class="text-mute">JFK Dock 4B</span>
        </div>
      </div>

      <!-- Live Sensor telemetry strip -->
      <div class="flex items-center justify-between border-t border-line pt-2.5 font-mono text-xs">
        <div class="flex items-center gap-3 text-[11px] text-mute">
          <span>🌡 19.4°C / 42% RH</span>
          <span class="text-success font-semibold">👁 0.02G Safe</span>
        </div>

        <button type="button" class="inline-flex items-center gap-1 text-accent font-semibold hover:underline"
          @click="$emit('open-telemetry', inTransitOrder)">
          <Icon name="lucide:activity" size="12" />
          <span>TELEMETRY</span>
        </button>
      </div>
    </article>

    <!-- Studio Registry Horizontal Scroll Carousel -->
    <section class="rounded-card border border-line bg-surface p-4 space-y-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2 font-mono text-xs">
          <span class="font-bold text-paper">STUDIO REGISTRY</span>
          <span class="rounded-control bg-raised px-1.5 py-0.2 text-[10px] text-mute">
            {{ registryItems.length }} RESERVED
          </span>
        </div>

        <NuxtLinkLocale to="/wishlist" class="font-mono text-xs text-accent font-semibold hover:underline">
          VIEW ALL &rarr;
        </NuxtLinkLocale>
      </div>

      <div class="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
        <article v-for="item in registryItems" :key="item.id"
          class="w-64 shrink-0 rounded-control border border-line bg-ink/30 p-3 space-y-2">
          <div class="relative aspect-video w-full overflow-hidden rounded-control border border-line bg-surface">
            <img v-if="item.image" :src="item.image" :alt="item.name" class="h-full w-full object-cover" />
            <span
              class="absolute top-1 start-1 rounded bg-black/70 px-1.5 py-0.5 font-mono text-[9px] font-bold text-yellow">
              {{ item.category }}
            </span>
          </div>

          <div>
            <h4 class="font-display text-sm font-semibold text-paper truncate">
              {{ item.name }}
            </h4>
            <p class="font-mono text-[10px] text-mute truncate">
              {{ item.specNotes }}
            </p>
          </div>

          <div class="flex items-center justify-between pt-1">
            <span class="font-display text-sm font-bold text-paper">
              {{ money.format(item.price) }}
            </span>

            <button type="button"
              class="inline-flex items-center gap-1 rounded-control bg-surface border border-line px-2 py-1 font-mono text-[10px] font-bold text-paper hover:border-accent hover:text-accent"
              @click="$emit('add-registry', item)">
              <Icon name="lucide:shopping-bag" size="11" />
              <span>REQUISITION</span>
            </button>
          </div>
        </article>
      </div>
    </section>

    <!-- Designated Receiving Dock Card -->
    <section class="rounded-card border border-line bg-surface p-4 space-y-2">
      <div class="flex items-center justify-between font-mono text-xs">
        <span class="flex items-center gap-1.5 text-mute">
          <Icon name="lucide:map-pin" size="13" class="text-accent" />
          DESIGNATED RECEIVING DOCK
        </span>
        <span class="text-cyan text-[11px] font-bold">SECURITY TIER IV</span>
      </div>

      <h3 class="font-display text-base font-bold text-paper">
        Dock 4B — Archival Freight Terminal
      </h3>
      <p class="text-xs text-mute leading-relaxed">
        Metropolitan Archival Wing, 1000 5th Avenue, NYC, NY 10028<br />
        Direct Climate Airlock Access (Bay 12)
      </p>

      <div class="pt-2">
        <button type="button"
          class="w-full rounded-control border border-line bg-raised py-2 font-mono text-xs font-semibold text-mute transition hover:border-accent hover:text-paper"
          @click="$emit('change-dock')">
          CHANGE DOCK
        </button>
      </div>
    </section>

    <!-- Collapsible Archived Requisitions -->
    <section class="rounded-card border border-line bg-surface p-4 space-y-3">
      <div class="flex items-center justify-between font-mono text-xs">
        <span class="font-bold text-paper">ARCHIVED REQUISITIONS</span>
        <span class="text-mute">2024 VENDOR REGISTRY</span>
      </div>

      <div class="space-y-2">
        <div v-for="arc in archivedOrders" :key="arc.id" class="rounded-control border border-line bg-ink/30 p-3">
          <div class="flex items-center justify-between font-mono text-xs cursor-pointer"
            @click="toggleArchive(arc.id)">
            <div>
              <p class="font-bold text-paper">{{ arc.id }} • {{ arc.title.split('+')[0]?.trim() }}</p>
              <p class="text-[10px] text-mute">{{ arc.date }} • {{ arc.items.length }} ITEMS</p>
            </div>
            <div class="flex items-center gap-2">
              <span class="font-display font-semibold text-paper">{{ money.format(arc.amount) }}</span>
              <Icon name="lucide:chevron-down" size="14" class="transition-transform text-mute"
                :class="openArchives[arc.id] && 'rotate-180'" />
            </div>
          </div>

          <div v-if="openArchives[arc.id]" class="mt-2 border-t border-line/60 pt-2 text-xs text-mute space-y-1">
            <p>{{ arc.title }}</p>
            <p v-if="arc.benchVerified" class="text-success">{{ arc.benchVerified }}</p>
            <p v-if="arc.calibrationLog" class="font-mono text-[10px]">{{ arc.calibrationLog }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Real-Time Activity Log Stream -->
    <section class="rounded-card border border-line bg-surface p-4 space-y-3">
      <div class="flex items-center justify-between font-mono text-xs">
        <span class="font-bold text-paper">REAL-TIME ACTIVITY LOG</span>
        <span class="text-success flex items-center gap-1 text-[10px]">
          <span class="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          LIVE SECURE STREAM
        </span>
      </div>

      <div class="space-y-2.5 font-mono text-xs">
        <div class="flex items-start gap-2.5 rounded-control border border-line bg-ink/20 p-2.5">
          <Icon name="lucide:activity" size="14" class="text-accent shrink-0 mt-0.5" />
          <div class="space-y-0.5">
            <div class="flex items-center justify-between gap-2">
              <span class="font-bold text-paper">Cargo Seal Telemetry Ping</span>
              <span class="text-mute text-[10px]">08:42 EDT</span>
            </div>
            <p class="font-sans text-[11px] text-mute">
              Flight LH-400 automated health report passed. Sensor array indicates optimal atmosphere.
            </p>
          </div>
        </div>

        <div class="flex items-start gap-2.5 rounded-control border border-line bg-ink/20 p-2.5">
          <Icon name="lucide:credit-card" size="14" class="text-cyan shrink-0 mt-0.5" />
          <div class="space-y-0.5">
            <div class="flex items-center justify-between gap-2">
              <span class="font-bold text-paper">Escrow Allocation Verified</span>
              <span class="text-mute text-[10px]">YESTERDAY</span>
            </div>
            <p class="font-sans text-[11px] text-mute">
              Wire clearance $12,450.00 confirmed for Requisition #LP-948201.
            </p>
          </div>
        </div>

        <div class="flex items-start gap-2.5 rounded-control border border-line bg-ink/20 p-2.5">
          <Icon name="lucide:bookmark" size="14" class="text-yellow shrink-0 mt-0.5" />
          <div class="space-y-0.5">
            <div class="flex items-center justify-between gap-2">
              <span class="font-bold text-paper">Registry Item Reserved</span>
              <span class="text-mute text-[10px]">NOV 02</span>
            </div>
            <p class="font-sans text-[11px] text-mute">
              Calibrite ColorChecker Studio held in conservation inventory for Vance Lab.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Fixed Mobile Bottom Navigation Bar -->
    <nav
      class="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-line bg-ink/95 py-2 backdrop-blur font-mono text-[10px] font-semibold"
      aria-label="Mobile navigation bar">
      <button type="button" class="flex flex-col items-center gap-1 transition"
        :class="mobileNav === 'overview' ? 'text-accent' : 'text-mute hover:text-paper'"
        @click="mobileNav = 'overview'">
        <Icon name="lucide:layout-dashboard" size="18" />
        <span>OVERVIEW</span>
      </button>

      <button type="button" class="flex flex-col items-center gap-1 transition"
        :class="mobileNav === 'orders' ? 'text-accent' : 'text-mute hover:text-paper'" @click="mobileNav = 'orders'">
        <Icon name="lucide:receipt" size="18" />
        <span>ORDERS</span>
      </button>

      <button type="button" class="flex flex-col items-center gap-1 transition"
        :class="mobileNav === 'registry' ? 'text-accent' : 'text-mute hover:text-paper'"
        @click="mobileNav = 'registry'">
        <Icon name="lucide:bookmark" size="18" />
        <span>REGISTRY</span>
      </button>

      <button type="button" class="flex flex-col items-center gap-1 transition"
        :class="mobileNav === 'settings' ? 'text-accent' : 'text-mute hover:text-paper'"
        @click="mobileNav = 'settings'">
        <Icon name="lucide:settings" size="18" />
        <span>SETTINGS</span>
      </button>
    </nav>
  </div>
</template>

<script lang="ts" setup>
import type {
  AtelierProfile,
  RegistryItem,
  RequisitionOrder,
} from "~/types/account";

const props = defineProps<{
  profile: AtelierProfile;
  orders: RequisitionOrder[];
  registryItems: RegistryItem[];
}>();

defineEmits<{
  (e: "new-order"): void;
  (e: "open-crate", order?: RequisitionOrder): void;
  (e: "open-escrow"): void;
  (e: "open-telemetry", order: RequisitionOrder): void;
  (e: "add-registry", item: RegistryItem): void;
  (e: "change-dock"): void;
}>();

const money = useMoney();

const showNotifications = ref(false);

const mobileTab = ref<"overview" | "active" | "registry">("overview");
const mobileNav = ref<"overview" | "orders" | "registry" | "settings">("overview");

const openArchives = reactive<Record<string, boolean>>({});
const toggleArchive = (id: string) => {
  openArchives[id] = !openArchives[id];
};

const inTransitOrder = computed(() =>
  props.orders.find((o) => o.status === "in-transit"),
);

const activeOrderCount = computed(
  () => props.orders.filter((o) => o.status === "in-transit").length,
);

const archivedOrders = computed(() =>
  props.orders.filter((o) => o.status !== "in-transit"),
);
</script>