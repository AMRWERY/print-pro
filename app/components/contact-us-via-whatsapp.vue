<template>
  <a
    :href="href"
    target="_blank"
    rel="noopener noreferrer"
    class="group fixed bottom-5 end-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/30 outline-none transition-transform duration-200 hover:scale-105 focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-ink active:scale-95 motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100"
    :aria-label="t('layout_ui.whatsapp_aria')"
    :title="t('layout_ui.whatsapp_title')"
  >
    <Icon name="simple-icons:whatsapp" size="28" aria-hidden="true" />
  </a>
</template>

<script lang="ts" setup>
const { t } = useI18n();

const message = t("layout_ui.whatsapp_message");

const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
</script>
