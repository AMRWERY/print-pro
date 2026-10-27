<template>
  <footer class="card p-6 meta space-y-6" aria-label="Support and policies">
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="sec in sections"
        :key="sec.title"
        class="space-y-1.5 border-s border-line ps-3"
      >
        <h3
          class="flex items-center gap-1.5 font-bold tracking-wider text-paper text-1xs"
        >
          <span class="pip" aria-hidden="true" />
          {{ sec.title }}
        </h3>
        <p class="font-sans text-xs leading-relaxed text-mute">
          {{ sec.body }}
        </p>
        <p class="text-2xs text-accent font-semibold pt-1">
          {{ sec.code }}
        </p>
      </div>
    </div>

    <div
      class="flex flex-wrap items-center justify-between gap-3 border-t border-line/60 pt-4 text-1xs"
    >
      <span> &copy; {{ t("account.all_rights_reserved") }} </span>
      <span class="flex items-center gap-1.5 text-success">
        <span class="status-dot" />
        {{ t("account.all_services_online") }}
      </span>
    </div>
  </footer>
</template>

<script lang="ts" setup>
import { complianceSections } from "~/data/account";

const { t } = useI18n();

const sections = complianceSections;
</script>