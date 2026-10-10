<template>
  <section class="space-y-3 card-compact" aria-label="Filter orders">
    <div class="grid gap-3 md:grid-cols-[minmax(0,1fr)_180px_220px]">
      <LazyVInput v-model="search" name="order-search" type="search" label="Search orders" hide-label icon="lucide:search" placeholder="Search by order #, item or waybill" />
      <LazyVSelectInput v-model="quarter" name="order-quarter" label="Quarter" hide-label :options="quarterOptions" />
      <LazyVSelectInput v-model="port" name="order-port" label="Receiving port" hide-label :options="portOptions" />
    </div>

    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex flex-wrap gap-1.5" role="group" aria-label="Order status">
        <LazyVButton
          v-for="t in tabs"
          :key="t.key"
          variant="plain"
          class="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-xs font-semibold transition-colors duration-150"
          :class="status === t.key ? 'border-accent bg-accent text-onaccent' : 'border-line bg-raised text-mute hover:border-accent/50 hover:text-paper'"
          :aria-pressed="status === t.key"
          @click="status = t.key"
        >
          {{ t.label }}
          <span class="rounded-full px-1.5 text-2xs" :class="status === t.key ? 'bg-black/20' : 'bg-line'">{{ counts[t.key] ?? 0 }}</span>
        </LazyVButton>
      </div>

      <LazyVButton v-if="active" variant="tertiary" size="sm" icon="lucide:x" @click="$emit('reset')">Clear filters</LazyVButton>
    </div>
  </section>
</template>

<script lang="ts" setup>
defineProps<{
  quarterOptions: { value: string; label: string }[];
  portOptions: { value: string; label: string }[];
  counts: Record<string, number>;
  active: boolean;
}>();
defineEmits<{ reset: [] }>();

const search = defineModel<string>("search", { required: true });
const status = defineModel<string>("status", { required: true });
const quarter = defineModel<string>("quarter", { required: true });
const port = defineModel<string>("port", { required: true });

const tabs = [
  { key: "all", label: "All" },
  { key: "in-transit", label: "In transit" },
  { key: "processing", label: "Processing" },
  { key: "delivered", label: "Delivered" },
  { key: "archived", label: "Archived" },
];
</script>
