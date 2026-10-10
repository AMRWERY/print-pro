<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script lang="ts" setup>
const { locale } = useI18n();
const { theme } = useTheme();

useHead({
  htmlAttrs: {
    lang: computed(() => locale.value),
    dir: computed(() => (locale.value === "ar" ? "rtl" : "ltr")),
    "data-theme": computed(() => theme.value),
  },
});

useSeoMeta({
  title: 'PrintPro',
  ogTitle: 'PrintPro',
  description: 'This is printpro, let me tell you all about it.',
  ogDescription: 'This is printpro, let me tell you all about it.',
  // ogImage: 'https://example.com/image.png',
  // twitterCard: 'summary_large_image',
})
</script>
