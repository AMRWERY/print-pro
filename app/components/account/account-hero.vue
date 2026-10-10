<template>
  <header class="rounded-card border border-line bg-surface p-5 sm:p-7 shadow-sm transition-colors duration-200"
    aria-labelledby="atelier-greeting">
    <div class="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
      <!-- Left side: Identity & Greeting -->
      <div class="space-y-3">
        <!-- Top Metadata & Verification Badges -->
        <div class="flex flex-wrap items-center gap-2 font-mono text-xs">
          <span
            class="inline-flex items-center gap-1.5 rounded-control border border-line bg-raised px-2.5 py-1 text-mute">
            <span class="h-1.5 w-1.5 rounded-full bg-accent" />
            {{ profile.tierTag }}
          </span>

          <span
            class="inline-flex items-center gap-1.5 rounded-control border border-success/30 bg-success-soft px-2.5 py-1 text-success">
            <Icon name="lucide:check-circle" size="13" aria-hidden="true" />
            ISO 12647-7 Spec Verified
          </span>

          <span
            class="hidden items-center gap-1.5 rounded-control border border-line bg-raised px-2.5 py-1 text-mute sm:inline-flex">
            SWISS METROLOGY ID: <span class="text-paper font-semibold">{{ profile.metrologyId }}</span>
          </span>
        </div>

        <div>
          <h1 id="atelier-greeting"
            class="font-display text-2xl font-bold tracking-tight text-paper sm:text-3xl lg:text-4xl">
            Good Morning, {{ profile.name }}.
          </h1>
          <p class="mt-1 text-sm text-mute">
            {{ profile.title }} —
            <span class="text-paper font-medium">{{ profile.affiliation }}</span>
          </p>
        </div>
      </div>

      <!-- Right side: Escrow Vault & Radial Graphic Widget -->
      <div
        class="flex items-center gap-4 rounded-card border border-line bg-ink/40 p-4 transition duration-200 hover:border-accent/40">
        <div class="space-y-1">
          <p class="eyebrow flex items-center gap-1.5 text-mute">
            <Icon name="lucide:shield-check" size="13" class="text-accent" />
            ESCROW VAULT AVAILABLE
          </p>
          <div class="font-display text-2xl font-bold tracking-tight text-paper sm:text-3xl">
            {{ money.format(profile.escrowAvailable) }}
          </div>
          <p class="flex items-center gap-1.5 font-mono text-[11px] text-success">
            <Icon name="lucide:zap" size="11" aria-hidden="true" />
            100% Instant Clearance
          </p>
        </div>

        <!-- Decorative Technical Escrow Radial Ring -->
        <div class="relative hidden h-16 w-16 shrink-0 place-items-center sm:grid">
          <svg class="h-full w-full -rotate-90" viewBox="0 0 36 36">
            <path class="text-line" stroke-width="3" stroke="currentColor" fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <path class="text-accent" stroke-dasharray="72, 100" stroke-width="3" stroke-linecap="round"
              stroke="currentColor" fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
          </svg>
          <Icon name="lucide:vault" size="20" class="absolute text-accent" aria-hidden="true" />
        </div>
      </div>
    </div>

    <!-- Quick Action Buttons Row -->
    <div class="mt-6 flex flex-wrap items-center gap-2.5">
      <LazyVButton variant="primary" class="!bg-accent !text-onaccent font-medium shadow-sm hover:brightness-110"
        @click="$emit('initiate-calibration')">
        <span class="h-2 w-2 rounded-full bg-white animate-pulse" aria-hidden="true" />
        INITIATE CALIBRATION ORDER
      </LazyVButton>

      <LazyVButton variant="secondary" icon="lucide:box" @click="$emit('book-cleanroom')">
        BOOK CLEANROOM QA BENCH
      </LazyVButton>

      <LazyVButton variant="secondary" icon="lucide:truck" @click="$emit('request-courier')">
        REQUEST CONSIGNMENT COURIER
      </LazyVButton>

      <LazyVButton variant="secondary" icon="lucide:file-text" @click="$emit('view-vat-dossier')">
        TAX VAT DOSSIER (Q3)
      </LazyVButton>
    </div>

    <!-- Atelier Specs / Status Grid (4 items) -->
    <div
      class="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-control border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
      <div class="bg-surface p-3.5 space-y-1">
        <dt class="eyebrow flex items-center gap-1.5 text-mute">
          <Icon name="lucide:credit-card" size="12" class="text-accent" />
          ESCROW CLEARANCE LINE
        </dt>
        <dd class="font-display text-base font-semibold text-paper">
          {{ money.format(profile.escrowLimit) }} ACTIVE
        </dd>
        <dd class="font-mono text-[11px] text-accent">
          Prime Tier Requisitioning
        </dd>
      </div>

      <div class="bg-surface p-3.5 space-y-1">
        <dt class="eyebrow flex items-center gap-1.5 text-mute">
          <Icon name="lucide:refresh-cw" size="12" class="text-cyan" />
          METROLOGY AUDIT SYNC
        </dt>
        <dd class="font-display text-base font-semibold text-paper">
          {{ profile.auditSyncTime }}
        </dd>
        <dd class="font-mono text-[11px] text-success">
          {{ profile.proofDrift }}
        </dd>
      </div>

      <div class="bg-surface p-3.5 space-y-1">
        <dt class="eyebrow flex items-center gap-1.5 text-mute">
          <Icon name="lucide:map-pin" size="12" class="text-yellow" />
          ALLOCATED CLEANROOM DOCK
        </dt>
        <dd class="font-display text-base font-semibold text-paper truncate">
          {{ profile.cleanroomDock }}
        </dd>
        <dd class="font-mono text-[11px] text-mute">
          {{ profile.cleanroomSpecs }}
        </dd>
      </div>

      <div class="bg-surface p-3.5 space-y-1">
        <dt class="eyebrow flex items-center gap-1.5 text-mute">
          <Icon name="lucide:key" size="12" class="text-success" />
          SECURITY AUTHORIZATION
        </dt>
        <dd class="font-display text-base font-semibold text-paper truncate">
          {{ profile.securityAuth }}
        </dd>
        <dd class="font-mono text-[11px] text-success flex items-center gap-1">
          <Icon name="lucide:shield-check" size="11" />
          {{ profile.securityStatus }}
        </dd>
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
import type { AtelierProfile } from "~/types/account";

defineProps<{
  profile: AtelierProfile;
}>();

defineEmits<{
  (e: "initiate-calibration"): void;
  (e: "book-cleanroom"): void;
  (e: "request-courier"): void;
  (e: "view-vat-dossier"): void;
}>();

const money = useMoney();
</script>