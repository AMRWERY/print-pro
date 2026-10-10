<template>
  <LazyVButton v-if="!auth.isSignedIn" variant="icon" to="/auth" aria-label="Sign in">
    <Icon name="lucide:user" size="18" class="icon-wiggle" aria-hidden="true" />
  </LazyVButton>

  <div v-else ref="root" class="relative">
    <VButton variant="icon" class="font-mono text-xs font-bold" aria-haspopup="menu" :aria-expanded="open"
      :aria-label="`Account menu for ${auth.user?.name}`" @click="open = !open">
      {{ initials }}
    </VButton>

    <Transition name="menu">
      <div v-if="open" role="menu" aria-label="Account"
        class="absolute end-0 top-full z-50 mt-2 w-64 space-y-3 rounded-card border border-line bg-surface p-3 shadow-xl shadow-black/30">
        <div class="space-y-0.5 border-b border-line pb-3">
          <p class="truncate font-medium">{{ auth.user?.name }}</p>
          <p class="truncate text-xs text-mute">{{ auth.user?.studio }}</p>
          <p class="truncate font-mono text-xs text-mute">
            {{ auth.user?.email }}
          </p>
        </div>
        <div class="space-y-1">
          <LazyVButton variant="ghost" size="sm" block to="/account" icon="lucide:layout-dashboard" role="menuitem"
            @click="open = false">Atelier Dashboard</LazyVButton>
          <LazyVButton variant="secondary" size="sm" block icon="lucide:log-out" role="menuitem" @click="signOut">Sign
            out</LazyVButton>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
const auth = useAuthStore();
const localePath = useLocalePath();

const root = ref<HTMLElement>();
const open = ref(false);

const initials = computed(() =>
  (auth.user?.name ?? "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join(""),
);

const signOut = () => {
  open.value = false;
  auth.logout();
  navigateTo(localePath("/"));
};

onClickOutside(root, () => (open.value = false));

onKeyStroke("Escape", () => (open.value = false));
</script>

<style scoped>
.menu-enter-active,
.menu-leave-active {
  transition:
    opacity 0.2s ease-out,
    transform 0.2s ease-out;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>