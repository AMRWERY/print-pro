<template>
  <section
    class="border-t border-line bg-surface py-12 md:py-16"
    aria-labelledby="alerts-title"
  >
    <div class="container-page space-y-8">
      <section-heading
        id="alerts-title"
        eyebrow="Active studio session"
        title="Substrate history & monitored search alerts"
      >
        <LazyVButton variant="secondary"
         
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
          {{ history.isSaved(query) ? "Search saved" : "Save current search" }}
        </LazyVButton>
      </section-heading>

      <ul class="grid gap-4 md:grid-cols-3">
        <li v-for="s in history.saved.value" :key="s.q" v-reveal>
          <article class="card flex h-full flex-col gap-2 p-5">
            <p class="eyebrow flex items-center justify-between text-accent">
              <span>Alert configured</span>
              <LazyVButton variant="plain"
                class="text-mute hover:text-paper"
                :aria-label="`Remove saved search ${s.q}`"
                @click="history.remove(s.q)"
              >
                <Icon name="lucide:x" size="14" aria-hidden="true" />
              </LazyVButton>
            </p>
            <h3 class="text-xl">“{{ s.q }}”</h3>
            <p class="text-sm text-mute">
              We’ll flag new lots and price changes that match this search.
            </p>
            <div
              class="mt-auto flex items-center justify-between pt-3 font-mono text-xs text-mute"
            >
              <span>Saved {{ formatDate(s.at) }}</span>
              <nuxt-link-locale
                :to="{ path: '/search', query: { q: s.q } }"
                class="text-accent hover:underline"
                >Re-execute +</nuxt-link-locale
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
              <LazyVButton variant="plain"
                :class="
                  a.highlight
                    ? 'btn-accent'
                    : 'link-quiet font-mono text-xs uppercase tracking-wider'
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
defineProps<{ query: string }>();

const history = useSearchHistory();

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const defaults = [
  {
    eyebrow: "Printer profiles · sync",
    title: "Epson UltraChrome PRO12 700 ml",
    body: "Automated reorder triggers set for Photo Black (PK) and Gray (GY) cartridges.",
    action: "Inspect levels +",
    highlight: false,
  },
  {
    eyebrow: "Laboratory profile guarantee",
    title: "Custom ICC profiles included",
    body: "Every 44-inch roll purchased from Lumen & Press includes a free spectrophotometric target reading for your exact printer engine.",
    action: "Request spectro target",
    highlight: true,
  },
];
</script>