<template>
  <header v-reveal class="space-y-6">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div class="space-y-3">
        <p class="eyebrow-accent">
          <span class="pip" aria-hidden="true" />Wishlist · saved products
        </p>
        <h1 class="max-w-3xl text-4xl sm:text-5xl">Your wishlist</h1>
        <p class="max-w-2xl text-sm text-mute sm:text-base">
          Printers, photocopiers and supplies you saved for later. Group them by
          location, share the list with your team and move everything to the
          cart when you are ready.
        </p>
      </div>
    </div>

    <dl
      class="grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-3"
    >
      <div class="bg-surface p-4">
        <dt class="eyebrow flex items-center justify-between">
          Active registry
          <Icon name="lucide:folder-open" size="14" aria-hidden="true" />
        </dt>
        <dd class="mt-1">
          <LazyVInput
            :model-value="name"
            name="registryName"
            label="Registry name"
            hide-label
            variant="bare"
            maxlength="40"
            input-class="w-full bg-transparent font-display text-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
            @update:model-value="(v) => emit('update:name', String(v ?? ''))"
          />
        </dd>
        <dd class="meta">ID: REG-{{ registryId }}</dd>
      </div>
      <div class="bg-surface p-4">
        <dt class="eyebrow">Estimated asset total</dt>
        <dd class="mt-1 font-display text-2xl" aria-live="polite">
          {{ money.format(total) }}
          <span class="meta">EGP</span>
        </dd>
        <dd class="meta">Excl. VAT</dd>
      </div>
      <div class="bg-surface p-4">
        <dt class="eyebrow flex items-center justify-between">
          Availability
          <Icon
            name="lucide:circle-check"
            size="14"
            class="text-success"
            aria-hidden="true"
          />
        </dt>
        <dd class="mt-1 font-display text-2xl">
          {{ ready }} / {{ count }} <span class="text-base">Ready</span>
        </dd>
        <dd class="meta">{{ ready }}/{{ count }} items in stock</dd>
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
        <Icon name="lucide:plus" size="16" aria-hidden="true" />New registry
      </LazyVButton>
      <span
        v-else
        class="flex items-center gap-2 rounded-control border border-accent/40 bg-accent-soft py-1 pe-1 ps-3 text-sm"
        role="alert"
      >
        Clear this registry and start over?
        <LazyVButton variant="primary" size="sm" @click="startNew">
          {{ t("btn.yes_clear") }}
        </LazyVButton>

        <LazyVButton variant="secondary" size="sm" @click="confirmNew = false">
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