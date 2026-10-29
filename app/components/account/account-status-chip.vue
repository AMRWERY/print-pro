<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-control border px-2 py-0.5 font-mono text-2xs font-semibold tracking-wider"
    :class="tone.cls"
  >
    <Icon :name="tone.icon" size="11" aria-hidden="true" />
    {{ label || tone.text }}
  </span>
</template>

<script lang="ts" setup>
import type { RequisitionOrder } from "~/types/account";

const { t } = useI18n();

// Colour is never the only signal: every status also carries an icon and text.
const props = defineProps<{
  status: RequisitionOrder["status"];
  label?: string;
}>();

const tones: Record<
  RequisitionOrder["status"],
  { cls: string; icon: string; text: string }
> = {
  "in-transit": {
    cls: "border-accent/40 bg-accent-soft text-accent",
    icon: "lucide:plane",
    text: t("account.in_transit"),
  },
  processing: {
    cls: "border-yellow/40 bg-yellow-soft text-yellow",
    icon: "lucide:loader",
    text: t("account.processing"),
  },
  delivered: {
    cls: "border-success/40 bg-success-soft text-success",
    icon: "lucide:check-circle",
    text: t("account.delivered"),
  },
  archived: {
    cls: "border-line bg-raised text-mute",
    icon: "lucide:archive",
    text: t("account.completed"),
  },
  recalled: {
    cls: "border-magenta/40 bg-magenta-soft text-magenta",
    icon: "lucide:undo-2",
    text: t("account.refunded"),
  },
};

const tone = computed(() => tones[props.status]);
</script>