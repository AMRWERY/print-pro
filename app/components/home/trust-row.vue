<template>
  <section class="border-t border-line py-12" :aria-label="t('home_ui.warranty_and_trust')">
    <div class="container-page">
      <icon-feature-row :items="trust" />
    </div>
  </section>
</template>

<script lang="ts" setup>
import { trust } from "~/data/home";

const { t } = useI18n();
</script>