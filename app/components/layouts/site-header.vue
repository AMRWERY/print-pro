<template>
  <header
    class="sticky top-0 z-40 border-b border-line bg-ink/90 backdrop-blur transition-shadow duration-300"
    :class="scrolled && 'shadow-lg shadow-black/20'"
  >
    <div class="container-page flex items-center gap-3 py-3 lg:gap-6">
      <LazyVButton variant="icon"
        class="lg:hidden"
        aria-label="Open menu"
        aria-haspopup="dialog"
        @click="menuOpen = true"
      >
        <Icon name="lucide:menu" size="20" aria-hidden="true" />
      </LazyVButton>

      <LazyVBrandMark />

      <div class="hidden max-w-xl flex-1 md:block lg:mx-6">
        <LazyVSearchInput />
      </div>

      <div class="ms-auto flex items-center gap-2">
        <LazyVButton variant="tertiary"
          to="/"
          class="hidden items-center gap-1.5 px-2 font-mono text-xs uppercase tracking-wider xl:inline-flex"
        >
          <Icon
            name="lucide:sliders-horizontal"
            size="16"
            class="icon-wiggle"
            aria-hidden="true"
          />
          Calibration services
        </LazyVButton>

        <LazyVLocaleSwitcher class="hidden lg:inline-flex" />

        <LazyVThemeToggle class="hidden lg:inline-flex" />

        <LazyVButton variant="icon"
          to="/wishlist"
          class="relative hidden lg:inline-flex"
          :aria-label="`Studio registry, ${wishlist.ids.length} saved`"
          active-class="!border-accent !text-accent"
        >
          <Icon
            name="lucide:bookmark"
            size="18"
            class="icon-lift"
            aria-hidden="true"
          />
          <span
            v-if="wishlist.ids.length"
            class="absolute -end-1.5 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 font-mono text-[10px] font-bold text-onaccent"
            >{{ wishlist.ids.length }}</span
          >
        </LazyVButton>

        <account-menu class="hidden lg:inline-flex" />

        <LazyVButton variant="secondary"
          aria-haspopup="dialog"
          @click="openCart"
          class="hidden h-10 !px-3 lg:inline-flex"
          :aria-label="`Cart, ${cart.count} items, ${money.format(cart.total)}`"
        >
          <span class="relative">
            <Icon
              name="lucide:shopping-cart"
              size="18"
              class="icon-bob"
              aria-hidden="true"
            />
            <Transition name="pop" mode="out-in">
              <span
                v-if="cart.count"
                :key="cart.count"
                class="absolute -end-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 font-mono text-[10px] font-bold text-onaccent"
                >{{ cart.count }}</span
              >
            </Transition>
          </span>
          <span class="hidden font-mono sm:inline">{{
            money.format(cart.total)
          }}</span>
        </LazyVButton>
      </div>
    </div>

    <div class="container-page pb-3 md:hidden">
      <LazyVSearchInput />
    </div>

    <category-nav />

    <LazyVScrollProgress />

    <mobile-menu :open="menuOpen" @close="menuOpen = false" />
  </header>
</template>

<script lang="ts" setup>
const cart = useCartStore();
const wishlist = useWishlistStore();
const money = useMoney();
const route = useRoute();

const openCart = () => {
  // The cart page already shows the full cart.
  if (/\/cart\/?$/.test(route.path)) return;
  cart.openDrawer();
};

const menuOpen = ref(false);

const { y } = useWindowScroll();
const scrolled = computed(() => y.value > 8);
</script>

<style scoped>
.pop-enter-active {
  transition:
    transform 0.2s ease-out,
    opacity 0.2s ease-out;
}

.pop-enter-from {
  transform: scale(0.4);
  opacity: 0;
}
</style>