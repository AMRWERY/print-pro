<template>
  <header class="space-y-6">
    <div class="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
      <div class="max-w-3xl space-y-3">
        <p class="eyebrow-accent">
          <span class="pip" aria-hidden="true" />{{ t("printing_ui.eyebrow") }}
        </p>
        <h1
          class="font-display text-3xl font-bold tracking-tight text-paper sm:text-4xl lg:text-5xl"
        >
          {{ t("printing_ui.hero_title") }}
        </h1>
        <p class="max-w-2xl text-sm leading-relaxed text-mute sm:text-base">
          {{ t("printing_ui.hero_body") }}
        </p>
      </div>
      <dl class="shrink-0 space-y-1 font-mono text-xs lg:text-end">
        <div class="flex gap-2 lg:justify-end">
          <dt class="text-mute">{{ t("printing_ui.turnaround") }}</dt>
          <dd class="font-semibold text-paper">
            {{ t("printing_ui.turnaround_value") }}
          </dd>
        </div>
        <div class="flex gap-2 lg:justify-end">
          <dt class="text-mute">{{ t("printing_ui.sizes") }}</dt>
          <dd class="font-semibold text-paper">
            {{ t("printing_ui.sizes_value") }}
          </dd>
        </div>
      </dl>
    </div>

    <ul class="grid gap-3 md:grid-cols-3">
      <li
        v-for="item in trust"
        :key="item.title"
        class="flex items-start gap-3 card-compact"
      >
        <Icon
          :name="item.icon"
          size="18"
          class="bullet-icon"
          aria-hidden="true"
        />
        <div>
          <p class="font-mono text-2xs tracking-wider text-mute">
            {{ item.title }}
          </p>
          <p class="mt-0.5 text-sm text-paper">{{ item.body }}</p>
        </div>
      </li>
    </ul>
  </header>
</template>

<script lang="ts" setup>
const { t } = useI18n();

const trust = computed(() => [
  {
    icon: "lucide:shield-check",
    title: t("printing_ui.trust_files_title"),
    body: t("printing_ui.trust_files_body"),
  },
  {
    icon: "lucide:sun",
    title: t("printing_ui.trust_colour_title"),
    body: t("printing_ui.trust_colour_body"),
  },
  {
    icon: "lucide:target",
    title: t("printing_ui.trust_delivery_title"),
    body: t("printing_ui.trust_delivery_body"),
  },
]);
</script>