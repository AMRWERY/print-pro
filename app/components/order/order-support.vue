<template>
  <section class="card space-y-4 p-5" aria-labelledby="support-title">
    <h2 id="support-title" class="flex items-center gap-2 font-display text-xl">
      <Icon
        name="lucide:headset"
        size="20"
        class="text-accent"
        aria-hidden="true"
      />{{ t("order_ui.customer_support") }}
    </h2>
    <i18n-t
      keypath="order_ui.support_body"
      tag="p"
      class="text-sm text-mute"
    >
      <template #id
        ><span class="font-mono text-paper">#{{ orderId }}</span></template
      >
    </i18n-t>

    <ul class="space-y-2">
      <li v-for="r in rows" :key="r.label">
        <LazyVButton
          variant="plain"
          :href="r.href"
          class="group flex w-full items-center gap-3 card p-3 text-start transition-colors duration-200 hover:border-accent"
          @click="r.action?.()"
        >
          <Icon
            :name="r.icon"
            size="18"
            class="shrink-0 text-accent"
            aria-hidden="true"
          />
          <span class="min-w-0 flex-1">
            <span class="eyebrow block">{{ r.label }}</span>
            <span class="block truncate text-sm">{{ r.value }}</span>
          </span>
          <Icon
            :name="r.end"
            size="14"
            class="icon-nudge shrink-0 text-mute rtl:-scale-x-100"
            aria-hidden="true"
          />
        </LazyVButton>
      </li>
    </ul>
  </section>
</template>

<script lang="ts" setup>
import { orderSupport } from "~/data/order";

defineProps<{ orderId: string }>();

const { t } = useI18n();

const rows = computed(() => [
  {
    label: t("order_ui.support_hotline"),
    value: orderSupport.phone,
    href: orderSupport.phoneHref,
    icon: "lucide:phone",
    end: "lucide:chevron-right",
  },
  {
    label: t("order_ui.dispatch_desk"),
    value: orderSupport.email,
    href: `mailto:${orderSupport.email}`,
    icon: "lucide:mail",
    end: "lucide:chevron-right",
  },
  {
    label: t("order_ui.delivery_note"),
    value: t("order_ui.order_document"),
    href: undefined,
    icon: "lucide:badge-check",
    end: "lucide:download",
    action: () => window.print(),
  },
]);
</script>