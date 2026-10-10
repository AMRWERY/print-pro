<template>
  <aside
    class="card-compact text-sm"
    aria-label="Workspace navigation"
  >
    <h2 class="eyebrow mb-3 flex items-center gap-2 text-mute">
      <Icon name="lucide:layout-grid" size="14" aria-hidden="true" />Workspace
      navigation
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
              class="rounded-full px-1.5 font-mono text-2xs font-bold"
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
</script>
