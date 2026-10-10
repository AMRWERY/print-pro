<template>
  <section class="card-roomy" aria-labelledby="docks-section-title">
    <header class="flex items-start justify-between gap-3 border-b border-line pb-3">
      <div>
        <div class="flex items-center gap-2">
          <span class="h-2 w-2 rounded-full bg-cyan" aria-hidden="true" />
          <h2 id="docks-section-title" class="title-sm sm:text-lg">
            Receiving Docks &amp; Ports
          </h2>
        </div>
        <p class="mt-0.5 text-xs text-mute">
          Cleared customs routing and cleanroom RECEIVING ZONES
        </p>
      </div>

      <span class="rounded-control bg-raised p-1.5 text-mute">
        <Icon name="lucide:shield-check" size="16" aria-hidden="true" />
      </span>
    </header>

    <div class="mt-4 space-y-3">
      <article v-for="dock in docks" :key="dock.id"
        class="rounded-control border border-line bg-ink/30 p-3.5 space-y-2 transition hover:border-accent/30">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div class="flex flex-wrap items-center gap-1.5 font-mono text-2xs">
            <span class="rounded-control px-2 py-0.5 font-bold tracking-wider" :class="dock.isPrimary
                ? 'bg-accent-soft text-accent'
                : 'bg-raised text-mute'
              ">
              {{ dock.typeBadge }}
            </span>
            <span class="rounded-control border border-line bg-surface px-1.5 py-0.5 text-mute">
              {{ dock.clearanceBadge }}
            </span>
          </div>

          <LazyVButton variant="plain" class="font-mono text-xs text-accent transition hover:underline"
            @click="$emit('edit-dock', dock)">
            EDIT DOCK
          </LazyVButton>
        </div>

        <div>
          <h3 class="font-display text-sm font-semibold text-paper">
            {{ dock.name }}
          </h3>
          <p class="mt-0.5 text-xs text-mute leading-relaxed">
            {{ dock.address }}
          </p>
        </div>

        <div
          class="flex flex-wrap items-center justify-between gap-2 border-t border-line/60 pt-2 font-mono text-1xs">
          <span class="text-mute">
            Clearance: <span class="text-paper font-semibold">{{ dock.securityClearance }}</span>
          </span>
          <span class="text-cyan">
            Telemetry: {{ dock.telemetry }}
          </span>
        </div>
      </article>
    </div>

    <!-- Deploy button -->
    <div class="mt-4 border-t border-line pt-3">
      <LazyVButton variant="plain"
        class="flex w-full items-center justify-center gap-2 rounded-control border border-dashed border-line bg-ink/20 py-2.5 meta font-semibold transition hover:border-accent hover:text-paper"
        @click="$emit('deploy-dock')">
        <Icon name="lucide:plus" size="14" />
        <span>+ DEPLOY NEW RECEIVING PORT / DOCK</span>
      </LazyVButton>
    </div>
  </section>
</template>

<script lang="ts" setup>
import type { ReceivingDock } from "~/types/account";

defineProps<{
  docks: ReceivingDock[];
}>();

defineEmits<{
  (e: "edit-dock", dock: ReceivingDock): void;
  (e: "deploy-dock"): void;
}>();
</script>