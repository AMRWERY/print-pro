<template>
  <section class="card space-y-4 p-5" aria-labelledby="consignee-title">
    <h2
      id="consignee-title"
      class="flex items-center gap-2 font-display text-xl"
    >
      <Icon
        name="lucide:truck"
        size="20"
        class="text-accent"
        aria-hidden="true"
      />Delivery details
    </h2>

    <dl class="space-y-4 text-sm">
      <div class="space-y-1 card p-3">
        <dt class="eyebrow">Recipient</dt>
        <dd class="font-medium">{{ order.name }}</dd>
        <dd v-if="order.company" class="text-mute">{{ order.company }}</dd>
        <dd class="meta">
          {{ order.address.line1
          }}<span v-if="order.address.line2">, {{ order.address.line2 }}</span>
        </dd>
        <dd class="meta">
          {{ order.address.city }}, {{ order.address.region }}
          {{ order.address.postal }}
        </dd>
        <dd class="meta">
          {{ countryName(order.address.country) }}
        </dd>
        <dd class="pt-1 meta">
          {{ order.phone }} · {{ order.email }}
        </dd>
      </div>

      <div class="space-y-1 card p-3">
        <dt class="eyebrow">Delivery method</dt>
        <dd class="flex items-center gap-1.5 font-medium">
          <Icon
            name="lucide:shield-check"
            size="14"
            class="text-accent"
            aria-hidden="true"
          />{{ order.delivery.label }}
        </dd>
        <dd class="text-xs text-mute">{{ order.delivery.note }}</dd>
      </div>

      <div
        v-if="order.notes"
        class="space-y-1 card p-3"
      >
        <dt class="eyebrow">Delivery notes</dt>
        <dd class="text-xs text-mute">{{ order.notes }}</dd>
      </div>
    </dl>
  </section>
</template>

<script lang="ts" setup>
import { countryName } from "~/data/order";
import type { Order } from "~/types/order";

defineProps<{ order: Order }>();
</script>