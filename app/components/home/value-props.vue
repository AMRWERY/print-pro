<template>
  <section class="border-y border-line bg-surface py-12" aria-label="Why buy from us">
    <div class="container-page">
      <icon-feature-row :items="valueProps" />
    </div>
  </section>
</template>

<script lang="ts" setup>
import { valueProps } from '~/data/home'
</script>