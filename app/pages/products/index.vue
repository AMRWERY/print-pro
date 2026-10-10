<template>
  <catalog-page :products="catalogProducts" />
</template>

<script lang="ts" setup>
import { catalogProducts } from "~/data/catalog";

useSeoMeta({
  title: "All Instruments & Archival Substrates — PrintPro",
  description:
    "Browse bench-verified medium-format cameras, cinema lenses, pigment printers and archival papers.",
});
</script>
