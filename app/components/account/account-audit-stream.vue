<template>
  <section class="card-roomy" aria-labelledby="audit-stream-title">
    <header class="flex items-start justify-between gap-3 border-b border-line pb-3">
      <div>
        <div class="flex items-center gap-2">
          <span class="pip rounded-full animate-pulse" aria-hidden="true" />
          <h2 id="audit-stream-title" class="title-sm sm:text-lg">
            Cryptographic Audit Stream
          </h2>
        </div>
        <p class="mt-0.5 text-xs text-mute">
          Live telemetry ledger of studio actions
        </p>
      </div>

      <span
        class="inline-flex items-center gap-1.5 rounded-control bg-accent/20 px-2 py-0.5 font-mono text-2xs font-bold text-accent">
        <span class="h-1.5 w-1.5 rounded-full bg-accent animate-ping" />
        LIVE
      </span>
    </header>

    <div class="mt-4 space-y-3 font-mono text-xs">
      <article v-for="log in logs" :key="log.id"
        class="rounded-control border border-line bg-ink/40 p-3 space-y-1.5 transition hover:border-accent/40">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <span class="font-bold text-paper tracking-wider">
            {{ log.title }}
          </span>
          <span class="text-mute text-1xs">{{ log.timestamp }}</span>
        </div>

        <p class="font-sans text-xs text-mute leading-relaxed">
          {{ log.summary }}
        </p>

        <div class="flex items-center justify-between gap-2 border-t border-line/40 pt-1.5 text-2xs">
          <span class="text-accent truncate">
            {{ log.hash }}
          </span>
          <LazyVButton variant="plain" class="shrink-0 text-mute hover:text-paper" title="Copy verification hash"
            @click="copyHash(log.hash)">
            <Icon name="lucide:copy" size="12" />
          </LazyVButton>
        </div>
      </article>
    </div>
  </section>
</template>

<script lang="ts" setup>
import type { AuditLogEntry } from "~/types/account";

defineProps<{
  logs: AuditLogEntry[];
}>();

const copied = ref(false);

const copyHash = async (hash: string) => {
  try {
    await navigator.clipboard.writeText(hash);
    copied.value = true;
    setTimeout(() => (copied.value = false), 2000);
  } catch { }
};
</script>