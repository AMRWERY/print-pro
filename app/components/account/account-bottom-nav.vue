<template>
  <nav
    class="fixed inset-x-0 bottom-0 z-40 flex items-stretch justify-around border-t border-line bg-ink/95 py-1 font-mono text-[10px] font-semibold backdrop-blur lg:hidden"
    aria-label="Account navigation"
  >
    <LazyVButton
      v-for="item in items"
      :key="item.key"
      variant="plain"
      :to="item.to"
      class="flex min-w-16 flex-col items-center gap-1 rounded-control px-2 py-2 uppercase transition-colors duration-200"
      :class="
        isAccountNavActive(item.key, route.path, route.hash)
          ? 'text-accent'
          : 'text-mute hover:text-paper'
      "
      :aria-current="
        isAccountNavActive(item.key, route.path, route.hash)
          ? 'page'
          : undefined
      "
    >
      <Icon :name="item.icon" size="18" aria-hidden="true" />
      <span>{{ item.short }}</span>
    </LazyVButton>
  </nav>
</template>

<script lang="ts" setup>
import { accountNav, isAccountNavActive } from "~/data/account-nav";

const route = useRoute();

// The phone bar has four slots; "Vault & addresses" lives on the Settings page there.
const items = accountNav.filter((n) => n.key !== "vault");
</script>