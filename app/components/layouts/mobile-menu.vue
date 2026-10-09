<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div
        v-if="open"
        class="fixed inset-0 z-50 lg:hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Main menu"
      >
        <div
          class="absolute inset-0 bg-ink/70 backdrop-blur-sm"
          @click="emit('close')"
        />
        <div
          class="drawer-panel absolute inset-y-0 start-0 flex w-[85%] max-w-sm flex-col border-e border-line bg-surface"
        >
          <div
            class="flex items-center justify-between border-b border-line p-4"
          >
            <LazyVBrandMark />

            <LazyVButton variant="icon"
             
              aria-label="Close menu"
              @click="emit('close')"
            >
              <Icon name="lucide:x" size="18" aria-hidden="true" />
            </LazyVButton>
          </div>
          <div
            class="flex items-center justify-around gap-2 border-b border-line p-3"
            role="group"
            aria-label="Account and preferences"
          >
            <LazyVButton variant="icon"
              aria-haspopup="dialog"
              @click="openCart"
              class="relative"
              :aria-label="`Cart, ${cart.count} items, ${money.format(cart.total)}`"
              
            >
              <Icon name="lucide:shopping-cart" size="18" class="icon-bob" aria-hidden="true" />
              <span
                v-if="cart.count"
                class="absolute -end-1.5 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 font-mono text-[10px] font-bold text-onaccent"
                >{{ cart.count }}</span
              >
            </LazyVButton>
            <LazyVButton variant="icon"
              to="/wishlist"
              class="relative"
              :aria-label="`Studio registry, ${wishlist.ids.length} saved`"
              @click="emit('close')"
            >
              <Icon name="lucide:bookmark" size="18" class="icon-lift" aria-hidden="true" />
              <span
                v-if="wishlist.ids.length"
                class="absolute -end-1.5 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 font-mono text-[10px] font-bold text-onaccent"
                >{{ wishlist.ids.length }}</span
              >
            </LazyVButton>
            
            <LazyVButton variant="icon"
              to="/"
             
              aria-label="Account"
              @click="emit('close')"
            >
              <Icon name="lucide:user" size="18" class="icon-wiggle" aria-hidden="true" />
            </LazyVButton>
            <LazyVThemeToggle />
            <LazyVLocaleSwitcher compact />
          </div>
          <nav
            aria-label="Product categories"
            class="flex-1 overflow-y-auto p-2"
          >
            <ul>
              <li v-for="c in categories" :key="c.label">
                <nuxt-link-locale
                  :to="c.to"
                  active-class="!text-accent bg-raised"
                  :class="matchesSearch(c) && '!text-accent bg-raised'"
                  class="flex min-h-12 items-center gap-3 rounded-control px-3 text-sm transition duration-200 hover:bg-raised"
                  @click="emit('close')"
                >
                  <Icon
                    :name="c.icon"
                    size="20"
                    class="icon-lift text-accent"
                    aria-hidden="true"
                  />
                  <span class="flex-1">{{ c.label }}</span>
                  <Icon
                    name="lucide:chevron-right"
                    size="16"
                    class="icon-nudge text-mute rtl:-scale-x-100"
                    aria-hidden="true"
                  />
                </nuxt-link-locale>
              </li>
            </ul>
          </nav>
          <div class="grid gap-2 border-t border-line p-4">
            <LazyVButton variant="primary"
              to="/"
             
              @click="emit('close')"
              >Trade-in evaluation</LazyVButton>
            <LazyVButton variant="secondary"
              to="/"
             
              @click="emit('close')"
              >ICC custom profile</LazyVButton>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
import { categories } from "~/data/home";

const props = defineProps<{ open: boolean }>();
const emit = defineEmits<{ close: [] }>();
const cart = useCartStore();
const wishlist = useWishlistStore();

const openCart = () => {
  emit("close");
  cart.openDrawer();
};
const matchesSearch = useCategorySearchMatch();
const money = useMoney();

onKeyStroke("Escape", () => {
  if (props.open) emit("close");
});
watch(
  () => props.open,
  (v) => {
    if (import.meta.client) document.body.style.overflow = v ? "hidden" : "";
  },
);
</script>

<style scoped>
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.25s ease-out;
}

.drawer-enter-active .drawer-panel,
.drawer-leave-active .drawer-panel {
  transition: transform 0.3s cubic-bezier(0.22, 0.8, 0.3, 1);
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

.drawer-enter-from .drawer-panel,
.drawer-leave-to .drawer-panel {
  transform: translateX(-100%);
}

[dir="rtl"] .drawer-enter-from .drawer-panel,
[dir="rtl"] .drawer-leave-to .drawer-panel {
  transform: translateX(100%);
}
</style>