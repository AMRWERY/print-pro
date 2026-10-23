<template>
  <info-page :key="page.slug" :page="page" />
</template>

<script lang="ts" setup>
import { findInfoPage } from "~/data/info-pages";

const route = useRoute();

const page = computed(() => findInfoPage("guides", String(route.params.slug))!);
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page not found",
    fatal: true,
  });
}

useSeoMeta({
  title: "Trade In",
  description: "Check where your order is and what happens next.",
  robots: "noindex",
});
</script>