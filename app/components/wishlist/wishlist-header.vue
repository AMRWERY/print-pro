<template>
  <header v-reveal class="space-y-6">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div class="space-y-3">
        <p class="eyebrow-accent">
          <span class="pip" aria-hidden="true" />{{ t("wishlist_ui.eyebrow") }}
        </p>
        <h1 class="max-w-3xl text-4xl sm:text-5xl">
          {{ t("wishlist_ui.title") }}
        </h1>
        <p class="max-w-2xl text-sm text-mute sm:text-base">
          {{ t("wishlist_ui.description") }}
        </p>
      </div>
    </div>

    <dl
      class="grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-3"
    >
      <div class="bg-surface p-4">
        <dt class="eyebrow flex items-center justify-between">
          {{ t("wishlist_ui.active_registry") }}
          <Icon name="lucide:folder-open" size="14" aria-hidden="true" />
        </dt>
        <dd class="mt-1">
          <LazyVInput
            :model-value="name"
            name="registryName"
            :label="t('inputs.registry_name')"
            hide-label
            variant="bare"
            maxlength="40"
            input-class="w-full bg-transparent font-display text-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
            @update:model-value="(v) => emit('update:name', String(v ?? ''))"
          />
        </dd>
        <dd class="meta">{{ t("wishlist_ui.registry_id", { id: registryId }) }}</dd>
      </div>
      <div class="bg-surface p-4">
        <dt class="eyebrow">{{ t("wishlist_ui.estimated_total") }}</dt>
        <dd class="mt-1 font-display text-2xl" aria-live="polite">
          {{ money.format(total) }}
          <span class="meta">{{ t("cart_ui.egp") }}</span>
        </dd>
        <dd class="meta">{{ t("wishlist_ui.excl_vat") }}</dd>
      </div>
      <div class="bg-surface p-4">
        <dt class="eyebrow flex items-center justify-between">
          {{ t("catalog_ui.availability") }}
          <Icon
            name="lucide:circle-check"
            size="14"
            class="text-success"
            aria-hidden="true"
          />
        </dt>
        <dd class="mt-1 font-display text-2xl">
          {{ ready }} / {{ count }}
          <span class="text-base">{{ t("wishlist_ui.ready") }}</span>
        </dd>
        <dd class="meta">
          {{ t("wishlist_ui.items_in_stock", { ready, count }) }}
        </dd>
      </div>
    </dl>

    <div class="flex flex-wrap items-center gap-3">
      <LazyVButton
        variant="primary"
        :disabled="!selectedCount"
        @click="emit('move-selected')"
      >
        <Icon
          name="lucide:shopping-cart"
          size="16"
          class="icon-bob"
          aria-hidden="true"
        />
        {{ t("btn.move_selected_to_cart") }} ({{ selectedCount }})
      </LazyVButton>

      <LazyVButton
        variant="secondary"
        :disabled="!count"
        @click="emit('share')"
      >
        <Icon
          :key="`s-${copied}`"
          :name="copied ? 'lucide:check' : 'lucide:share-2'"
          size="16"
          :class="copied && 'animate-icon-pop'"
          aria-hidden="true"
        />
        {{ copied ? t("btn.link_copied") : t("btn.share_wishlist") }}
      </LazyVButton>

      <LazyVButton
        variant="secondary"
        v-if="!confirmNew"
        :disabled="!count"
        @click="confirmNew = true"
      >
        <Icon name="lucide:plus" size="16" aria-hidden="true" />{{
          t("wishlist_ui.new_registry")
        }}
      </LazyVButton>
      <span
        v-else
        class="flex items-center gap-2 rounded-control border border-accent/40 bg-accent-soft py-1 pe-1 ps-3 text-sm"
        role="alert"
      >
        {{ t("wishlist_ui.clear_registry_confirm") }}
        <LazyVButton variant="primary" size="sm" @click="startNew">
          {{ t("btn.yes_clear") }}
        </LazyVButton>

        <LazyVButton variant="secondary" size="sm" @click="confirmNew = false">
          {{ t("btn.cancel") }}
        </LazyVButton>
      </span>
    </div>
  </header>
</template>

<script lang="ts" setup>
const { t } = useI18n();

const props = defineProps<{
  name: string;
  count: number;
  ready: number;
  total: number;
  selectedCount: number;
  copied: boolean;
  preview: boolean;
  registryId: string;
}>();

const emit = defineEmits<{
  "update:name": [value: string];
  "update:preview": [value: boolean];
  "move-selected": [];
  share: [];
  "new-registry": [];
}>();

const money = useMoney();

const confirmNew = ref(false);
const startNew = () => {
  confirmNew.value = false;
  emit("new-registry");
};

// Collapse the confirmation if the list changes underneath it.
watch(
  () => props.count,
  () => (confirmNew.value = false),
);
</script>