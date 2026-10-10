<template>
  <div class="flex min-h-screen flex-col">
    <a
      href="#main"
      class="sr-only z-50 rounded-control bg-accent px-4 py-2 text-onaccent focus:not-sr-only focus:absolute focus:start-4 focus:top-4"
      >Skip to content</a
    >
    <announcement-bar />
    <site-header />

    <main id="main" class="flex-1">
      <div class="container-page py-6 lg:py-8">
        <!-- Accounts live in this browser, so wait until the session is read -->
        <div v-if="!ready" class="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]" aria-busy="true" aria-label="Loading your account">
          <div class="hidden h-96 animate-pulse rounded-card bg-raised lg:block" />
          <div class="space-y-4"><div class="h-48 animate-pulse rounded-card bg-raised" /><div class="h-64 animate-pulse rounded-card bg-raised" /></div>
        </div>

        <div v-else-if="auth.isSignedIn" class="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start">
          <account-sidebar class="hidden lg:flex lg:sticky lg:top-28" :order-count="orders.length" :registry-count="registryCount" />
          <div class="min-w-0 pb-20 lg:pb-0"><slot /></div>
        </div>

        <!-- Signed out: send them to sign in, and bring them back here afterwards -->
        <LazyVEmptyState v-else icon="lucide:lock" title="Sign in to see your account" description="Your orders, registry and delivery addresses are tied to your studio account.">
          <LazyVButton variant="primary" :to="signInTo">Sign in</LazyVButton>
        </LazyVEmptyState>
      </div>
    </main>

    <site-footer />
    <account-bottom-nav v-if="ready && auth.isSignedIn" />
    <cart-drawer />
  </div>
</template>

<script lang="ts" setup>
const { auth, orders, registryCount } = useAccount();
const route = useRoute();
const localePath = useLocalePath();

const ready = ref(false);
onMounted(async () => {
  await nextTick(); // let the store read this browser's saved session
  ready.value = true;
});

// The sign-in page adds the locale itself, so hand it the path without one.
const here = computed(() => (route.path.replace(/^\/(en|ar)(?=\/|$)/, "") || "/") + (route.hash || ""));
const signInTo = computed(() => ({ path: "/auth", query: { redirect: here.value } }));

watch(
  () => [ready.value, auth.isSignedIn] as const,
  ([isReady, signedIn]) => {
    if (isReady && !signedIn) navigateTo(localePath(signInTo.value), { replace: true });
  },
  { immediate: true },
);
</script>