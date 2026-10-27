<template>
  <div class="space-y-4 font-sans text-paper">
    <!-- Top Mobile App Header Bar -->
    <header
      class="flex items-center justify-between rounded-control border border-line bg-surface p-3 font-mono text-xs"
    >
      <div class="flex items-center gap-2">
        <span class="relative flex h-2 w-2">
          <span
            class="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75"
          />
          <span class="relative inline-flex h-2 w-2 rounded-full bg-success" />
        </span>
        <span class="font-bold text-success">{{
          t("account.account_online")
        }}</span>
        <span class="text-line">|</span>
        <span class="flex items-center gap-1 text-mute">
          <Icon name="lucide:lock" size="12" />
          {{ t("account.bit") }}
        </span>
      </div>

      <div class="flex items-center gap-3">
        <LazyVButton
          variant="plain"
          class="relative text-mute hover:text-paper"
          aria-label="Notifications"
          @click="showNotifications = !showNotifications"
        >
          <Icon name="lucide:bell" size="18" />
          <span class="absolute -top-1 -end-1 pip rounded-full" />
        </LazyVButton>

        <img
          :src="profile.avatarUrl"
          :alt="profile.name"
          class="h-8 w-8 rounded-full border border-line object-cover"
        />
      </div>
    </header>

    <!-- Subnav Segmented Pill Tabs -->
    <div
      class="grid grid-cols-3 gap-1 rounded-control border border-line bg-surface p-1 font-mono text-xs font-semibold"
      role="tablist"
      aria-label="Mobile sections"
    >
      <LazyVButton
        variant="plain"
        role="tab"
        :aria-selected="mobileTab === 'overview'"
        class="flex items-center justify-center gap-1.5 rounded-tight py-2 transition"
        :class="
          mobileTab === 'overview'
            ? 'bg-ink text-accent shadow-sm'
            : 'text-mute hover:text-paper'
        "
        @click="mobileTab = 'overview'"
      >
        <span class="h-1.5 w-1.5 rounded-full bg-accent" />
        {{ t("btn.overview") }}
      </LazyVButton>

      <LazyVButton
        variant="plain"
        role="tab"
        :aria-selected="mobileTab === 'active'"
        class="flex items-center justify-center gap-1.5 rounded-tight py-2 transition"
        :class="
          mobileTab === 'active'
            ? 'bg-ink text-accent shadow-sm'
            : 'text-mute hover:text-paper'
        "
        @click="mobileTab = 'active'"
      >
        {{ t("btn.active") }} ({{ activeOrderCount }})
      </LazyVButton>

      <LazyVButton
        variant="plain"
        role="tab"
        :aria-selected="mobileTab === 'registry'"
        class="flex items-center justify-center gap-1.5 rounded-tight py-2 transition"
        :class="
          mobileTab === 'registry'
            ? 'bg-ink text-accent shadow-sm'
            : 'text-mute hover:text-paper'
        "
        @click="mobileTab = 'registry'"
      >
        {{ t("btn.registry") }} ({{ registryItems.length }})
      </LazyVButton>
    </div>

    <!-- Doctor Profile Card -->
    <section class="card-compact">
      <div class="flex items-start justify-between gap-3">
        <div class="flex items-center gap-3">
          <div
            class="relative h-14 w-14 shrink-0 overflow-hidden rounded-control border border-line"
          >
            <img
              :src="profile.avatarUrl"
              :alt="profile.name"
              class="h-full w-full object-cover"
            />
            <span
              class="absolute bottom-1 end-1 h-2.5 w-2.5 rounded-full border-2 border-surface bg-accent"
            />
          </div>

          <div class="space-y-0.5">
            <h2 class="font-display text-lg font-bold text-paper">
              {{ profile.name }}
            </h2>
            <p
              class="font-mono text-1xs text-mute tracking-wider truncate max-w-[200px]"
            >
              {{ profile.affiliation }}
            </p>
            <div class="flex items-center gap-2 font-mono text-2xs">
              <span class="text-accent font-semibold">{{
                t("account.operations_manager")
              }}</span>
              <span class="text-mute">•</span>
              <span class="text-mute">BER ⇄ JFK {{ t("account.ready") }}</span>
            </div>
          </div>
        </div>

        <span class="rounded-control bg-raised p-2 text-mute">
          <Icon name="lucide:briefcase" size="18" />
        </span>
      </div>

      <!-- Quick Action Buttons -->
      <div class="mt-4 grid grid-cols-3 gap-2 font-mono text-xs font-semibold">
        <LazyVButton
          variant="plain"
          class="flex items-center justify-center gap-1.5 rounded-control bg-accent py-2 text-onaccent shadow-sm transition hover:brightness-110 active:scale-95"
          @click="$emit('new-order')"
        >
          <Icon name="lucide:plus" size="14" />
          <span>{{ t("btn.new_order") }}</span>
        </LazyVButton>

        <LazyVButton
          variant="plain"
          class="flex items-center justify-center gap-1.5 rounded-control border border-line bg-raised py-2 text-mute transition hover:border-accent hover:text-paper active:scale-95"
          @click="$emit('open-crate', inTransitOrder)"
        >
          <Icon name="lucide:plane" size="14" />
          <span>#948201</span>
        </LazyVButton>

        <LazyVButton
          variant="plain"
          class="flex items-center justify-center gap-1.5 rounded-control border border-line bg-raised py-2 text-mute transition hover:border-accent hover:text-paper active:scale-95"
          @click="$emit('open-escrow')"
        >
          <Icon name="lucide:vault" size="14" />
          <span>{{ t("btn.credit") }}</span>
        </LazyVButton>
      </div>
    </section>

    <!-- Key Metrics 3-Column Grid -->
    <div class="grid grid-cols-3 gap-2 font-mono text-xs">
      <div class="card p-2.5 space-y-1">
        <div class="flex items-center justify-between text-mute text-2xs">
          <span>{{ t("account.transit") }}</span>
          <span class="h-1.5 w-1.5 rounded-full bg-accent" />
        </div>
        <p class="title-sm">EGP 18.2K</p>
        <p class="text-2xs text-mute leading-tight">{{ t("account.seal") }}</p>
      </div>

      <div class="card p-2.5 space-y-1">
        <div class="flex items-center justify-between text-mute text-2xs">
          <span>{{ t("account.credit") }}</span>
          <Icon name="lucide:shield-check" size="10" class="text-cyan" />
        </div>
        <p class="title-sm">EGP 32.5K</p>
        <p class="text-2xs text-success leading-tight">
          {{ t("account.auto_clear_on") }}
        </p>
      </div>

      <div class="card p-2.5 space-y-1">
        <div class="flex items-center justify-between text-mute text-2xs">
          <span>{{ t("account.registry") }}</span>
          <Icon name="lucide:bookmark" size="10" class="text-mute" />
        </div>
        <p class="title-sm">{{ t("account.units") }}</p>
        <p class="text-2xs text-accent leading-tight">
          {{ t("account.allocated") }}
        </p>
      </div>
    </div>

    <!-- Active In-Transit Shipment Card -->
    <article v-if="inTransitOrder" class="card-compact space-y-3">
      <div
        class="flex items-center justify-between border-b border-line pb-2.5"
      >
        <div class="flex items-center gap-1.5 font-mono text-xs">
          <span
            class="rounded-control bg-accent/20 px-2 py-0.5 font-bold text-accent"
          >
            {{ inTransitOrder.crateId || "ORDER #LP-948201" }}
          </span>
          <span class="flex items-center gap-1 text-1xs text-accent">
            <span class="h-1.5 w-1.5 rounded-full bg-accent animate-ping" />
            {{ t("account.live") }}
          </span>
        </div>

        <span class="title-sm">
          {{ money.format(inTransitOrder.amount) }}
        </span>
      </div>

      <div>
        <h3 class="title-sm">{{ t("account.photocopier_printer_order") }}</h3>
        <p class="font-mono text-2xs text-mute tracking-wider mt-0.5">
          {{ t("account.carrier_insured_courier_pallet") }}
        </p>
      </div>

      <!-- Equipment Thumbnails -->
      <div class="flex items-center gap-2">
        <div
          class="flex items-center gap-2 rounded-control border border-line bg-ink/40 p-1.5"
        >
          <img
            src="/img/prod-01.png"
            alt="Photocopier"
            class="h-8 w-8 object-contain"
          />
          <span class="font-mono text-2xs text-paper">Kopira Pro A3 35</span>
        </div>
        <div
          class="flex items-center gap-2 rounded-control border border-line bg-ink/40 p-1.5"
        >
          <img
            src="/img/prod-03.png"
            alt="Toner"
            class="h-8 w-8 object-contain"
          />
          <span class="font-mono text-2xs text-paper">Kopira Toner...</span>
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

        <div class="grid grid-cols-4 text-center font-mono text-3xs">
          <span class="text-mute">{{ t("account.confirmed") }}</span>
          <span class="text-mute">{{ t("account.packed") }}</span>
          <span class="font-bold text-accent">{{
            t("account.on_the_way")
          }}</span>
          <span class="text-mute">{{ t("account.delivered") }}</span>
        </div>
      </div>

      <!-- Delivery strip -->
      <div
        class="flex items-center justify-between border-t border-line pt-2.5 font-mono text-xs"
      >
        <div class="flex items-center gap-3 text-1xs text-mute">
          <span>🚚 Out for delivery</span>
          <span class="text-success font-semibold"
            >✔ {{ t("account.sealed") }}</span
          >
        </div>

        <LazyVButton
          variant="plain"
          class="inline-flex items-center gap-1 text-accent font-semibold hover:underline"
          @click="$emit('open-telemetry', inTransitOrder)"
        >
          <Icon name="lucide:activity" size="12" />
          <span>{{ t("btn.tracking") }}</span>
        </LazyVButton>
      </div>
    </article>

    <!-- Saved items carousel -->
    <section class="card-compact space-y-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2 font-mono text-xs">
          <span class="font-bold text-paper">{{
            t("account.saved_items")
          }}</span>
          <span
            class="rounded-control bg-raised px-1.5 py-0.2 text-2xs text-mute"
          >
            {{ registryItems.length }} {{ t("account.reserved") }}
          </span>
        </div>

        <nuxt-link-locale
          to="/wishlist"
          class="font-mono text-xs text-accent font-semibold hover:underline"
        >
          {{ t("account.view_all") }}
        </nuxt-link-locale>
      </div>

      <div class="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
        <article
          v-for="item in registryItems"
          :key="item.id"
          class="w-64 shrink-0 rounded-control border border-line bg-ink/30 p-3 space-y-2"
        >
          <div
            class="relative aspect-video w-full overflow-hidden rounded-control border border-line bg-surface"
          >
            <img
              v-if="item.image"
              :src="item.image"
              :alt="item.name"
              class="h-full w-full object-cover"
            />
            <span
              class="absolute top-1 start-1 rounded bg-black/70 px-1.5 py-0.5 font-mono text-3xs font-bold text-yellow"
            >
              {{ item.category }}
            </span>
          </div>

          <div>
            <h4 class="font-display text-sm font-semibold text-paper truncate">
              {{ item.name }}
            </h4>
            <p class="font-mono text-2xs text-mute truncate">
              {{ item.specNotes }}
            </p>
          </div>

          <div class="flex items-center justify-between pt-1">
            <span class="font-display text-sm font-bold text-paper">
              {{ money.format(item.price) }}
            </span>

            <LazyVButton
              variant="plain"
              class="inline-flex items-center gap-1 rounded-control bg-surface border border-line px-2 py-1 font-mono text-2xs font-bold text-paper hover:border-accent hover:text-accent"
              @click="$emit('add-registry', item)"
            >
              <Icon name="lucide:shopping-bag" size="11" />
              <span>{{ t("btn.add_to_cart") }}</span>
            </LazyVButton>
          </div>
        </article>
      </div>
    </section>

    <!-- Default delivery address card -->
    <section class="card-compact space-y-2">
      <div class="flex items-center justify-between font-mono text-xs">
        <span class="flex items-center gap-1.5 text-mute">
          <Icon name="lucide:map-pin" size="13" class="text-accent" />
          {{ t("account.default_delivery_address") }}
        </span>
        <span class="text-cyan text-1xs font-bold">{{
          t("account.signature_required")
        }}</span>
      </div>

      <h3 class="title-sm">{{ t("account.head_office_cairo") }}</h3>
      <p class="text-xs text-mute leading-relaxed">
        {{ t("account.imbaba") }}<br />
        {{ t("account.loading_bay_rear") }} 08:00 – 17:00
      </p>

      <div class="pt-2">
        <LazyVButton
          variant="plain"
          class="w-full rounded-control border border-line bg-raised py-2 meta font-semibold transition hover:border-accent hover:text-paper"
          @click="$emit('change-dock')"
        >
          {{ t("btn.change_address") }}
        </LazyVButton>
      </div>
    </section>

    <!-- Collapsible past orders -->
    <section class="card-compact space-y-3">
      <div class="flex items-center justify-between font-mono text-xs">
        <span class="font-bold text-paper">{{ t("account.past_orders") }}</span>
        <span class="text-mute">{{ t("account.order_history") }}</span>
      </div>

      <div class="space-y-2">
        <div
          v-for="arc in archivedOrders"
          :key="arc.id"
          class="rounded-control border border-line bg-ink/30 p-3"
        >
          <div
            class="flex items-center justify-between font-mono text-xs cursor-pointer"
            @click="toggleArchive(arc.id)"
          >
            <div>
              <p class="font-bold text-paper">
                {{ arc.id }} • {{ arc.title.split("+")[0]?.trim() }}
              </p>
              <p class="text-2xs text-mute">
                {{ arc.date }} • {{ arc.items.length }} {{ t("account.items") }}
              </p>
            </div>
            <div class="flex items-center gap-2">
              <span class="font-display font-semibold text-paper">{{
                money.format(arc.amount)
              }}</span>
              <Icon
                name="lucide:chevron-down"
                size="14"
                class="transition-transform text-mute"
                :class="openArchives[arc.id] && 'rotate-180'"
              />
            </div>
          </div>

          <div
            v-if="openArchives[arc.id]"
            class="mt-2 border-t border-line/60 pt-2 text-xs text-mute space-y-1"
          >
            <p>{{ arc.title }}</p>
            <p v-if="arc.benchVerified" class="text-success">
              {{ arc.benchVerified }}
            </p>
            <p v-if="arc.calibrationLog" class="font-mono text-2xs">
              {{ arc.calibrationLog }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Real-Time Activity Log Stream -->
    <section class="card-compact space-y-3">
      <div class="flex items-center justify-between font-mono text-xs">
        <span class="font-bold text-paper">{{
          t("account.real_time_activity_log")
        }}</span>
        <span class="text-success flex items-center gap-1 text-2xs">
          <span class="status-dot" />
          {{ t("account.live_updates") }}
        </span>
      </div>

      <div class="space-y-2.5 font-mono text-xs">
        <div
          class="flex items-start gap-2.5 rounded-control border border-line bg-ink/20 p-2.5"
        >
          <Icon name="lucide:activity" size="14" class="bullet-icon" />
          <div class="space-y-0.5">
            <div class="flex items-center justify-between gap-2">
              <span class="font-bold text-paper">{{
                t("account.delivery_update")
              }}</span>
              <span class="text-mute text-2xs">08:42 EDT</span>
            </div>
            <p class="font-sans text-1xs text-mute">
              {{
                t(
                  "account.your_order_left_the_warehouse_and_is_with_the_courier",
                )
              }}
            </p>
          </div>
        </div>

        <div
          class="flex items-start gap-2.5 rounded-control border border-line bg-ink/20 p-2.5"
        >
          <Icon
            name="lucide:credit-card"
            size="14"
            class="text-cyan shrink-0 mt-0.5"
          />
          <div class="space-y-0.5">
            <div class="flex items-center justify-between gap-2">
              <span class="font-bold text-paper">{{
                t("account.account_credit_applied")
              }}</span>
              <span class="text-mute text-2xs">{{
                t("account.yesterday")
              }}</span>
            </div>
            <p class="font-sans text-1xs text-mute">
              {{ t("account.payment_of") }} EGP 12,450.00
              {{ t("account.confirmed_for_order") }} #LP-948201.
            </p>
          </div>
        </div>

        <div
          class="flex items-start gap-2.5 rounded-control border border-line bg-ink/20 p-2.5"
        >
          <Icon
            name="lucide:bookmark"
            size="14"
            class="text-yellow shrink-0 mt-0.5"
          />
          <div class="space-y-0.5">
            <div class="flex items-center justify-between gap-2">
              <span class="font-bold text-paper">{{
                t("account.saved_item_back_in_stock")
              }}</span>
              <span class="text-mute text-2xs"
                >{{ t("account.november") }} 02</span
              >
            </div>
            <p class="font-sans text-1xs text-mute">
              Corex Toner Black 210
              {{ t("account.is_back_in_stock_and_ready_to_order") }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import type {
  AtelierProfile,
  RegistryItem,
  RequisitionOrder,
} from "~/types/account";

const { t } = useI18n();

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