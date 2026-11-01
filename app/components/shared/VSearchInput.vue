<template>
  <form role="search" class="relative w-full" @submit.prevent="submit">
    <LazyVInput
      v-model="query"
      name="headerSearch"
      type="search"
      :label="t('inputs.search_printers_photocopiers_ink_and_toner')"
      hide-label
      icon="lucide:search"
      autocomplete="off"
      placeholder="Search printers, photocopiers, ink, toner…"
      input-class="!pe-4"
    />
  </form>
</template>

<script lang="ts" setup>
const { t } = useI18n();

const localePath = useLocalePath();

const query = ref("");

const submit = () => {
  const q = query.value.trim();
  if (q) navigateTo(localePath({ path: "/search", query: { q } }));
};
</script>