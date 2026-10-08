<template>
  <nuxt-link-locale
    v-if="target"
    :to="switchLocalePath(target.code)"
    :hreflang="target.code"
    :lang="target.code"
    :class="compact ? 'btn-icon' : 'btn-ghost h-10 !px-3'"
    :aria-label="`Switch language to ${target.name}`"
    @click.prevent="switchTo"
  >
    <Icon name="lucide:globe" size="18" class="icon-spin" aria-hidden="true" />
    <span :class="compact && 'sr-only'">{{ target.name }}</span>
  </nuxt-link-locale>
</template>

<script lang="ts" setup>
const { locale, locales } = useI18n();
const switchLocalePath = useSwitchLocalePath();

defineProps<{ compact?: boolean }>();

const { run } = useViewTransition();

// Cross-fade between the two languages (and their text directions).
const switchTo = () => {
  if (!target.value) return;
  const path = switchLocalePath(target.value.code);
  return run(
    async () => {
      await navigateTo(path);
    },
    { kind: "locale" },
  );
};

const target = computed(() =>
  (locales.value as { code: string; name: string }[]).find(
    (l) => l.code !== locale.value,
  ),
);
</script>