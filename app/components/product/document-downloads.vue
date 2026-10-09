<template>
  <section
    class="border-y border-line bg-surface py-12 md:py-16"
    aria-labelledby="docs-title"
  >
    <div class="container-page space-y-8">
      <section-heading
        id="docs-title"
        eyebrow="Digital lab assets"
        title="Calibrated ICC profiles & technical manuals"
      >
        <LazyVButton variant="secondary">
          <Icon
            name="lucide:download"
            size="16"
            class="icon-bob"
            aria-hidden="true"
          />
          Download all certified archives
        </LazyVButton>
      </section-heading>

      <ul class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <li v-for="(d, i) in items" :key="d.title" v-reveal="{ delay: i * 70 }">
          <a
            href="#"
            class="group card flex h-full items-start gap-3 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-accent"
            @click.prevent
          >
            <span
              class="grid h-10 w-10 shrink-0 place-items-center rounded-control border border-line text-accent"
              aria-hidden="true"
            >
              <Icon :name="d.icon" size="20" class="icon-lift" />
            </span>
            <span class="min-w-0">
              <span class="block text-sm font-medium">{{ d.title }}</span>
              <span class="block font-mono text-xs text-mute">{{
                d.meta
              }}</span>
              <span
                class="mt-1 inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-accent"
              >
                Download
                <Icon
                  name="lucide:arrow-down"
                  size="12"
                  class="icon-bob"
                  aria-hidden="true"
                />
              </span>
            </span>
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>

<script lang="ts" setup>
import type { DocumentLink } from "~/types/product";

defineProps<{ items: DocumentLink[] }>();
</script>