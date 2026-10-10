<template>
  <aside class="flex flex-col justify-between rounded-card border border-line bg-surface p-4 text-sm"
    aria-label="Workspace navigation">
    <div class="space-y-6">
      <!-- Section 1: Workspace Navigation -->
      <div>
        <h2 class="eyebrow mb-3 flex items-center gap-2 text-mute">
          <Icon name="lucide:layout-grid" size="14" aria-hidden="true" />
          WORKSPACE NAVIGATION
        </h2>
        <nav aria-label="Atelier sections">
          <ul class="space-y-1">
            <li v-for="item in navItems" :key="item.id">
              <button type="button"
                class="group relative flex w-full items-center gap-2.5 rounded-control px-3 py-2 text-start font-medium transition duration-150"
                :class="activeTab === item.id
                    ? 'bg-accent text-onaccent shadow-sm'
                    : 'text-mute hover:bg-raised hover:text-paper'
                  " @click="$emit('select-tab', item.id)">
                <!-- Active bar on the edge -->
                <span v-if="activeTab === item.id"
                  class="absolute start-0 top-1/2 h-4 w-1 -translate-y-1/2 rounded-full bg-white" aria-hidden="true" />
                <Icon :name="item.icon" size="16" class="shrink-0 transition-transform group-hover:scale-110"
                  :class="activeTab === item.id ? 'text-onaccent' : 'text-accent'" aria-hidden="true" />
                <span class="flex-1 truncate">{{ item.label }}</span>
                <span v-if="item.badge" class="rounded-full px-1.5 py-0.2 font-mono text-[10px] font-bold" :class="activeTab === item.id
                    ? 'bg-black/20 text-white'
                    : 'bg-raised text-mute'
                  ">
                  {{ item.badge }}
                </span>
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <!-- Section 2: Studio Inventory -->
      <div class="border-t border-line pt-5">
        <h2 class="eyebrow mb-3 flex items-center gap-2 text-mute">
          <Icon name="lucide:box" size="14" aria-hidden="true" />
          STUDIO INVENTORY
        </h2>
        <ul class="space-y-1">
          <li v-for="inv in inventoryLinks" :key="inv.label">
            <NuxtLinkLocale :to="inv.to"
              class="group flex items-center gap-2.5 rounded-control px-3 py-2 text-mute transition duration-150 hover:bg-raised hover:text-paper">
              <Icon :name="inv.icon" size="15"
                class="shrink-0 text-mute transition-transform group-hover:scale-110 group-hover:text-accent"
                aria-hidden="true" />
              <span class="truncate">{{ inv.label }}</span>
            </NuxtLinkLocale>
          </li>
        </ul>
      </div>
    </div>

    <!-- Section 3: Telemetry & Quality Gauges -->
    <div class="mt-8 space-y-3 border-t border-line pt-5 font-mono text-xs">
      <div class="rounded-card border border-line bg-ink/50 p-3 space-y-1.5">
        <div class="flex items-center justify-between text-[11px]">
          <span class="text-mute">SPECTRO DELTA-E</span>
          <span class="font-bold text-accent">&lt; 0.45 AVG</span>
        </div>
        <div class="h-1.5 w-full overflow-hidden rounded-full bg-line">
          <div class="h-full rounded-full bg-accent transition-all duration-500" style="width: 28%" />
        </div>
      </div>

      <div class="rounded-card border border-line bg-ink/50 p-3 space-y-1.5">
        <div class="flex items-center justify-between text-[11px]">
          <span class="text-mute">CLEANROOM PRESSUR</span>
          <span class="font-bold text-success">100% RH 45%</span>
        </div>
        <div class="flex items-center gap-1.5 text-[10px] text-mute">
          <span class="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          <span>Laminar ISO 5 Airflow OK</span>
        </div>
      </div>
    </div>
  </aside>
</template>

<script lang="ts" setup>
import type { AtelierTab } from "~/types/account";

defineProps<{
  activeTab: AtelierTab;
  orderCount?: number;
  registryCount?: number;
}>();

defineEmits<{
  (e: "select-tab", tab: AtelierTab): void;
}>();

const navItems: { id: AtelierTab; label: string; icon: string; badge?: string }[] = [
  { id: "overview", label: "Dashboard", icon: "lucide:layout-dashboard" },
  { id: "orders", label: "Orders & Calibrations", icon: "lucide:receipt-text" },
  { id: "registry", label: "Wishlist / Registry", icon: "lucide:bookmark" },
  { id: "vault", label: "Vault & Addresses", icon: "lucide:shield-check" },
  { id: "settings", label: "Account Settings", icon: "lucide:settings" },
];

const inventoryLinks = [
  {
    label: "Optical Instruments",
    to: "/products/cameras",
    icon: "lucide:aperture",
  },
  {
    label: "Archival Media & Rag",
    to: "/products/paper-ink",
    icon: "lucide:scroll-text",
  },
  {
    label: "Spectral Proofing",
    to: "/products",
    icon: "lucide:swatch-book",
  },
];
</script>