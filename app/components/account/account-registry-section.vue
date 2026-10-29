<template>
  <section class="card-roomy" aria-labelledby="registry-section-title">
    <header
      class="flex items-start justify-between gap-3 border-b border-line pb-3"
    >
      <div>
        <div class="flex items-center gap-2">
          <span class="h-2 w-2 rounded-full bg-yellow" aria-hidden="true" />
          <h2 id="registry-section-title" class="title-sm sm:text-lg">
            {{ t("account.saved_items") }}
          </h2>
        </div>
        <p class="mt-0.5 text-xs text-mute">
          {{ t("account.products_you_saved_for_later") }}
        </p>
      </div>

      <span
        class="rounded-control border border-line bg-raised px-2 py-0.5 font-mono text-2xs text-mute"
      >
        {{ items.length }} {{ t("account.present_items") }}
      </span>
    </header>

    <div class="mt-4 space-y-3">
      <article
        v-for="item in items"
        :key="item.id"
        class="flex flex-col gap-3 rounded-control border border-line bg-ink/30 p-3 sm:flex-row sm:items-center sm:justify-between transition hover:border-accent/30"
      >
        <div class="flex items-center gap-3">
          <div
            class="h-12 w-12 shrink-0 overflow-hidden rounded-control border border-line bg-surface"
          >
            <img
              v-if="item.image"
              :src="item.image"
              :alt="item.name"
              class="h-full w-full object-cover"
            />
            <div v-else class="grid h-full w-full place-items-center text-mute">
              <Icon :name="item.icon || 'lucide:box'" size="20" />
            </div>
          </div>

          <div class="space-y-0.5">
            <p class="eyebrow flex items-center gap-1.5 text-accent">
              {{ item.category }} • {{ item.statusBadge }}
            </p>
            <h3 class="font-display text-sm font-semibold text-paper">
              {{ item.name }}
            </h3>
            <p class="font-mono text-1xs text-mute">
              {{ item.specNotes }}
            </p>
          </div>
        </div>

        <div
          class="flex items-center justify-between gap-4 border-t border-line/60 pt-2 sm:border-0 sm:pt-0"
        >
          <span class="title-sm">
            {{ money.format(item.price) }}
          </span>

          <LazyVButton
            variant="plain"
            class="inline-flex items-center gap-1 rounded-control bg-accent px-2.5 py-1 font-mono text-xs font-semibold text-onaccent shadow-sm transition hover:brightness-110 active:scale-95"
            @click="$emit('add-to-manifest', item)"
          >
            <Icon name="lucide:plus" size="12" />
            <span>{{ t("btn.add_to_cart") }}</span>
          </LazyVButton>
        </div>
      </article>
    </div>

    <footer class="mt-4 border-t border-line pt-3 text-end font-mono text-xs">
      <nuxt-link-locale
        to="/wishlist"
        class="inline-flex items-center gap-1 text-accent transition hover:underline"
      >
        <span>{{ t("account.open_registry_ledger") }}</span>
        <Icon name="lucide:arrow-right" size="13" />
      </nuxt-link-locale>
    </footer>
  </section>
</template>

<script lang="ts" setup>
import type { RegistryItem } from "~/types/account";

const { t } = useI18n();

defineProps<{
  items: RegistryItem[];
}>();

defineEmits<{
  (e: "add-to-manifest", item: RegistryItem): void;
}>();

const money = useMoney();
</script>