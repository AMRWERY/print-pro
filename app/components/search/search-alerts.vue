<template>
  <section
    class="border-t border-line bg-surface py-12 md:py-16"
    aria-labelledby="alerts-title"
  >
    <div class="container-page space-y-8">
      <section-heading
        id="alerts-title"
        :eyebrow="t('search_ui.your_searches')"
        :title="t('search_ui.search_history_and_alerts')"
      >
        <LazyVButton
          variant="secondary"
          :disabled="!query.trim() || history.isSaved(query)"
          @click="history.save(query)"
        >
          <Icon
            :name="
              history.isSaved(query) ? 'lucide:bell-ring' : 'lucide:bell-plus'
            "
            size="16"
            class="icon-wiggle"
            aria-hidden="true"
          />
          {{
            history.isSaved(query)
              ? t("btn.search_saved")
              : t("btn.save_current_search")
          }}
        </LazyVButton>
      </section-heading>

      <ul class="grid gap-4 md:grid-cols-3">
        <li v-for="s in history.saved.value" :key="s.q" v-reveal>
          <article class="card flex h-full flex-col gap-2 p-5">
            <p class="eyebrow flex items-center justify-between text-accent">
              <span>{{ t("search_ui.alert_configured") }}</span>
              <LazyVButton
                variant="plain"
                class="text-mute hover:text-paper"
                :aria-label="t('search_ui.remove_saved_search', { query: s.q })"
                @click="history.remove(s.q)"
              >
                <Icon name="lucide:x" size="14" aria-hidden="true" />
              </LazyVButton>
            </p>
            <h3 class="text-xl">“{{ s.q }}”</h3>
            <p class="text-sm text-mute">
              {{ t("search_ui.alert_description") }}
            </p>
            <div class="mt-auto flex items-center justify-between pt-3 meta">
              <span>{{ t("search_ui.saved_on", { date: formatDate(s.at) }) }}</span>
              <nuxt-link-locale
                :to="{ path: '/search', query: { q: s.q } }"
                class="text-accent hover:underline"
                >{{ t("search_ui.re_execute") }}</nuxt-link-locale
              >
            </div>
          </article>
        </li>

        <li v-for="a in defaults" :key="a.title" v-reveal>
          <article
            class="card flex h-full flex-col gap-2 p-5"
            :class="a.highlight && 'border-accent/40 bg-raised'"
          >
            <p class="eyebrow" :class="a.highlight && 'text-accent'">
              {{ a.eyebrow }}
            </p>
            <h3 class="text-xl">{{ a.title }}</h3>
            <p class="text-sm text-mute">{{ a.body }}</p>
            <div class="mt-auto pt-3">
              <LazyVButton
                variant="plain"
                :class="
                  a.highlight
                    ? 'btn-accent'
                    : 'link-quiet font-mono text-xs tracking-wider'
                "
              >
                {{ a.action }}
              </LazyVButton>
            </div>
          </article>
        </li>
      </ul>
    </div>
  </section>
</template>

<script lang="ts" setup>
const { t } = useI18n();

defineProps<{ query: string }>();

const history = useSearchHistory();

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const defaults = computed(() => [
  {
    eyebrow: t("search_ui.supplies_reorder"),
    title: "Corex Toner Black 210",
    body: t("search_ui.reorder_reminder_body"),
    action: t("btn.set_reminder"),
    highlight: false,
  },
  {
    eyebrow: t("search_ui.installation_included"),
    title: t("search_ui.free_installation_title"),
    body: t("search_ui.free_installation_body"),
    action: t("btn.see_how_it_works"),
    highlight: true,
  },
]);
</script>