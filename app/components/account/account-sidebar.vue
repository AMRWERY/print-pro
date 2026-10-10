<template>
  <aside
    class="flex flex-col justify-between rounded-card border border-line bg-surface p-4 text-sm"
    aria-label="Workspace navigation"
  >
    <div class="space-y-6">
      <div>
        <h2 class="eyebrow mb-3 flex items-center gap-2 text-mute">
          <Icon
            name="lucide:layout-grid"
            size="14"
            aria-hidden="true"
          />Workspace navigation
        </h2>
        <nav aria-label="Account sections">
          <ul class="space-y-1">
            <li v-for="item in navItems" :key="item.key">
              <LazyVButton
                variant="plain"
                :to="item.to"
                class="group relative flex w-full items-center gap-2.5 rounded-control px-3 py-2 text-start font-medium transition duration-150"
                :class="
                  isActive(item.key)
                    ? 'bg-accent text-onaccent shadow-sm'
                    : 'text-mute hover:bg-raised hover:text-paper'
                "
                :aria-current="isActive(item.key) ? 'page' : undefined"
              >
                <Icon
                  :name="item.icon"
                  size="16"
                  class="shrink-0 transition-transform group-hover:scale-110"
                  :class="isActive(item.key) ? 'text-onaccent' : 'text-accent'"
                  aria-hidden="true"
                />
                <span class="flex-1 truncate">{{ item.label }}</span>
                <span
                  v-if="item.badge !== undefined"
                  class="rounded-full px-1.5 font-mono text-[10px] font-bold"
                  :class="
                    isActive(item.key)
                      ? 'bg-black/20 text-white'
                      : 'bg-raised text-mute'
                  "
                  >{{ item.badge }}</span
                >
              </LazyVButton>
            </li>
          </ul>
        </nav>
      </div>

      <div class="border-t border-line pt-5">
        <h2 class="eyebrow mb-3 flex items-center gap-2 text-mute">
          <Icon name="lucide:box" size="14" aria-hidden="true" />Studio
          inventory
        </h2>
        <ul class="space-y-1">
          <li v-for="inv in inventoryLinks" :key="inv.label">
            <LazyVButton
              variant="plain"
              :to="inv.to"
              class="group flex items-center gap-2.5 rounded-control px-3 py-2 text-mute transition duration-150 hover:bg-raised hover:text-paper"
            >
              <Icon
                :name="inv.icon"
                size="15"
                class="shrink-0 transition-transform group-hover:scale-110 group-hover:text-accent"
                aria-hidden="true"
              />
              <span class="truncate">{{ inv.label }}</span>
            </LazyVButton>
          </li>
        </ul>
      </div>
    </div>

    <div class="mt-8 space-y-3 border-t border-line pt-5 font-mono text-xs">
      <div class="space-y-1.5 rounded-card border border-line bg-ink/50 p-3">
        <div class="flex items-center justify-between text-[11px]">
          <span class="text-mute">SPECTRO DELTA-E</span
          ><span class="font-bold text-accent">&lt; 0.45 AVG</span>
        </div>
        <div class="h-1.5 w-full overflow-hidden rounded-full bg-line">
          <div class="h-full rounded-full bg-accent" style="width: 28%" />
        </div>
      </div>
      <div class="space-y-1.5 rounded-card border border-line bg-ink/50 p-3">
        <div class="flex items-center justify-between text-[11px]">
          <span class="text-mute">CLEANROOM</span
          ><span class="font-bold text-success">100% RH 45%</span>
        </div>
        <div class="flex items-center gap-1.5 text-[10px] text-mute">
          <span
            class="h-1.5 w-1.5 animate-pulse rounded-full bg-success"
          /><span>Laminar ISO 5 airflow OK</span>
        </div>
      </div>
    </div>
  </aside>
</template>

<script lang="ts" setup>
import { accountNav, isAccountNavActive } from "~/data/account-nav";

const route = useRoute();

const props = defineProps<{ orderCount?: number; registryCount?: number }>();

const navItems = computed(() =>
  accountNav.map((n) => ({
    ...n,
    badge:
      n.key === "orders"
        ? props.orderCount
        : n.key === "registry"
          ? props.registryCount
          : undefined,
  })),
);

const isActive = (key: string) =>
  isAccountNavActive(key, route.path, route.hash);

const inventoryLinks = [
  {
    label: "Optical instruments",
    to: "/products/cameras",
    icon: "lucide:aperture",
  },
  {
    label: "Archival media & rag",
    to: "/products/paper-ink",
    icon: "lucide:scroll-text",
  },
  { label: "Spectral proofing", to: "/products", icon: "lucide:swatch-book" },
];
</script>