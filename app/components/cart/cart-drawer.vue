<template>
  <Teleport to="body">
    <Transition name="cdrawer">
      <div
        v-if="open"
        class="fixed inset-0 z-[60]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
      >
        <div class="modal-backdrop" @click="close" />

        <aside
          ref="panel"
          class="cdrawer-panel absolute inset-y-0 end-0 flex w-full max-w-md flex-col border-s border-line bg-surface shadow-2xl shadow-black/40"
          @keydown.tab="trapTab"
        >
          <header class="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
            <h2 id="cart-drawer-title" class="font-display text-xl">
              Studio cart
              <span class="font-mono text-sm text-mute">({{ cart.count }} {{ cart.count === 1 ? "unit" : "units" }})</span>
            </h2>
            <LazyVButton variant="icon" ref="closeBtn" aria-label="Close cart" @click="close">
              <Icon name="lucide:x" size="18" aria-hidden="true" />
            </LazyVButton>
          </header>

          <!-- Empty -->
          <LazyVEmptyState
            v-if="!entries.length"
            bare
            as="p"
            class="flex-1"
            icon="lucide:shopping-cart"
            caption="0 UNITS"
            title="Your cart is empty"
            description="Add instruments from the catalog to start a procurement manifest."
          >
            <LazyVButton variant="primary" to="/products" @click="close">Browse the catalog</LazyVButton>
          </LazyVEmptyState>

          <template v-else>
            <ul class="flex-1 divide-y divide-line overflow-y-auto" aria-label="Items in your cart">
              <li v-for="e in visible" :key="e.line.key" class="flex gap-3 p-4">
                <div class="h-20 w-24 shrink-0 overflow-hidden rounded-control border border-line">
                  <img v-if="e.product.image" :src="e.product.image" :alt="e.product.imageAlt ?? e.product.name" class="thumb-contain" loading="lazy" decoding="async" />
               
                  <media-placeholder v-else :icon="e.product.icon" :label="`${e.product.name} image`" size="32" class="h-full w-full" />
                </div>

                <div class="flex min-w-0 flex-1 flex-col gap-2">
                  <div class="flex items-start justify-between gap-2">
                    <div class="min-w-0">
                      <p class="eyebrow">{{ e.product.brand }}</p>
                      <p class="line-clamp-2 text-sm font-medium leading-snug">
                        <nuxt-link-locale :to="`/product/${e.product.id}`" class="hover:text-accent" @click="close">{{ e.product.name }}</nuxt-link-locale>
                      </p>
                      <p v-if="e.line.option" class="truncate text-xs text-mute">{{ e.line.option }}</p>
                    </div>
                    <LazyVButton variant="icon" class="h-8 w-8 shrink-0" :aria-label="`Remove ${e.product.name} from cart`" @click="cart.remove([e.line.key])">
                      <Icon name="lucide:trash-2" size="14" aria-hidden="true" />
                    </LazyVButton>
                  </div>

                  <div class="mt-auto flex items-center justify-between gap-3">
                    <LazyVQuantityStepper :model-value="e.line.qty" :label="`Quantity of ${e.product.name}`" @update:model-value="(n) => cart.setQty(e.line.key, n)" />
                    <p class="font-mono text-sm font-medium">{{ money.format(e.line.qty * e.line.unitPrice) }}</p>
                  </div>
                </div>
              </li>
            </ul>

            <footer class="space-y-3 border-t border-line p-4">
              <!-- Free freight progress -->
              <div v-if="remaining > 0" class="space-y-1.5">
                <p class="text-xs text-mute">Add <span class="font-medium text-paper">{{ money.format(remaining) }}</span> more for free climate-crated freight.</p>
                <div class="h-1.5 overflow-hidden rounded-full bg-raised" role="progressbar" :aria-valuenow="Math.round(progress)" aria-valuemin="0" aria-valuemax="100" aria-label="Progress toward free freight">
                  <div class="h-full rounded-full bg-accent transition-[width] duration-300" :style="{ width: `${progress}%` }" />
                </div>
              </div>
              <p v-else class="flex items-center gap-1.5 text-xs text-success"><Icon name="lucide:circle-check" size="14" aria-hidden="true" />Free climate-crated freight unlocked.</p>

              <p class="flex items-end justify-between gap-3">
                <span class="eyebrow !text-paper">Subtotal</span>
                <span class="font-display text-2xl font-semibold" aria-live="polite">{{ money.format(cart.total) }}</span>
              </p>
              <p class="text-xs text-mute">Freight, discounts and tax are calculated on the cart page.</p>

              <!-- More than four lines: the full manifest lives on the cart page -->
              <template v-if="hiddenCount > 0">
                <p class="rounded-control border border-line bg-raised p-2 text-center text-xs text-mute" role="status">
                  Showing {{ MAX_VISIBLE }} of {{ entries.length }} items. {{ hiddenCount }} more in your cart.
                </p>
                <LazyVButton variant="primary" size="lg" block to="/cart" @click="close">
                  View all {{ entries.length }} items
                  <Icon name="lucide:arrow-right" size="16" class="icon-nudge rtl:-scale-x-100" aria-hidden="true" />
                </LazyVButton>
              </template>
              <template v-else>
                <LazyVButton variant="primary" size="lg" block @click="checkout">
                  <Icon name="lucide:lock" size="16" aria-hidden="true" />Secure studio checkout
                </LazyVButton>
                <p v-if="notice" class="rounded-control border border-line bg-raised p-2 text-xs text-mute" role="status">{{ notice }}</p>
              </template>
            </footer>
          </template>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
import { pricing } from "~/data/cart";
import { findProduct } from "~/data/product-details";
import type { CartEntry } from "~/composables/useCartTotals";

/** More lines than this and the drawer hands over to the cart page. */
const MAX_VISIBLE = 4;

const cart = useCartStore();
const money = useMoney();
const localePath = useLocalePath();
const route = useRoute();

// The cart page already shows everything, so the drawer stays closed there.
const onCartPage = computed(() => /\/cart\/?$/.test(route.path));
const open = computed(() => cart.drawerOpen && !onCartPage.value);

const entries = computed<CartEntry[]>(() =>
  cart.lines.flatMap((line) => {
    const product = findProduct(line.id);
    return product ? [{ line, product }] : [];
  }),
);
const visible = computed(() => entries.value.slice(0, MAX_VISIBLE));
const hiddenCount = computed(() => Math.max(0, entries.value.length - MAX_VISIBLE));

const remaining = computed(() => Math.max(0, pricing.freeFreightFrom - cart.total));
const progress = computed(() => Math.min(100, (cart.total / pricing.freeFreightFrom) * 100));

const notice = ref("");
const checkout = () => {
  cart.checkoutKeys = []; // everything in the cart
  cart.closeDrawer();
  navigateTo(localePath("/checkout"));
};

const close = () => cart.closeDrawer();

// ---- dialog behaviour: Esc, scroll lock, focus in / out, Tab trap ----
const panel = ref<HTMLElement>();
const closeBtn = ref<HTMLElement>();
let returnFocusTo: HTMLElement | null = null;

onKeyStroke("Escape", () => {
  if (open.value) close();
});

watch(open, async (isOpen) => {
  if (!import.meta.client) return;
  document.body.style.overflow = isOpen ? "hidden" : "";
  if (isOpen) {
    notice.value = "";
    returnFocusTo = document.activeElement as HTMLElement | null;
    await nextTick();
    closeBtn.value?.focus();
  } else {
    returnFocusTo?.focus?.();
    returnFocusTo = null;
  }
});

watch(() => route.fullPath, () => cart.closeDrawer());
onBeforeUnmount(() => {
  if (import.meta.client) document.body.style.overflow = "";
});

const trapTab = (e: KeyboardEvent) => {
  const nodes = panel.value?.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
  );
  if (!nodes?.length) return;
  const first = nodes[0]!;
  const last = nodes[nodes.length - 1]!;
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
};
</script>

<style scoped>
.cdrawer-enter-active,
.cdrawer-leave-active {
  transition: opacity 0.25s ease-out;
}
.cdrawer-enter-active .cdrawer-panel,
.cdrawer-leave-active .cdrawer-panel {
  transition: transform 0.3s cubic-bezier(0.22, 0.8, 0.3, 1);
}
.cdrawer-enter-from,
.cdrawer-leave-to {
  opacity: 0;
}
/* Slides in from the end side: right in LTR, left in RTL. */
.cdrawer-enter-from .cdrawer-panel,
.cdrawer-leave-to .cdrawer-panel {
  transform: translateX(100%);
}
[dir="rtl"] .cdrawer-enter-from .cdrawer-panel,
[dir="rtl"] .cdrawer-leave-to .cdrawer-panel {
  transform: translateX(-100%);
}
</style>
