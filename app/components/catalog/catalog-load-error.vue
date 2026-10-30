<template>
  <div class="container-page py-10" role="alert">
    <LazyVEmptyState
      icon="lucide:cloud-off"
      eyebrow="CATALOG :: UNAVAILABLE"
      tag="OFFLINE"
      tag-tone="warning"
      :title="t('catalog.load_error_title', 'We couldn\'t load the catalog')"
      :description="
        t(
          'catalog.load_error_description',
          'The product list is temporarily unavailable. Check your connection and try again.',
        )
      "
    >
      <LazyVButton variant="primary" @click="$emit('retry')">{{
        t("catalog.load_error_retry", "Try again")
      }}</LazyVButton>
    </LazyVEmptyState>
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n();

defineEmits<{ retry: [] }>();
</script>
