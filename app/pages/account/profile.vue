<template>
  <div class="space-y-6">
    <LazyVBreadcrumb :items="crumbs" />

    <header>
      <h1
        class="title-lg"
      >
        {{ t("acct_profile.page_title") }}
      </h1>
      <p class="mt-1 text-sm text-mute">
        {{ t("acct_profile.page_desc") }}
      </p>
    </header>

    <div class="space-y-6">
      <profile-identity />

      <profile-ports
        :docks="docks.list"
        @add="openDock()"
        @edit="openDock($event)"
        @primary="makePrimary"
        @remove="remove"
      />

      <profile-security />
    </div>

    <dock-modal
      :open="modalOpen"
      :dock="editing"
      @close="modalOpen = false"
      @saved="onSaved"
    />

  </div>
</template>

<script lang="ts" setup>
import type { ReceivingDock } from "~/types/account";

const { t } = useI18n();
const docks = useDockStore();

const modalOpen = ref(false);
const editing = ref<ReceivingDock | null>(null);

const crumbs = computed(() => [
  { label: t("acct_ui.crumb_account"), to: "/account" },
  { label: t("acct_profile.page_title") },
]);

const toast = useToast();
const notify = (msg: string) => toast.success(msg);

const openDock = (dock?: ReceivingDock) => {
  editing.value = dock ?? null;
  modalOpen.value = true;
};

const onSaved = (dock: ReceivingDock) => {
  const isNew = !docks.list.some((d) => d.id === dock.id);
  docks.save(dock);
  notify(isNew ? t("acct_profile.added", { name: dock.name }) : t("acct_profile.updated", { name: dock.name }));
};

const makePrimary = (dock: ReceivingDock) => {
  docks.makePrimary(dock.id);
  notify(t("acct_profile.now_default", { name: dock.name }));
};

const remove = (id: string) => {
  const gone = docks.list.find((d) => d.id === id);
  docks.remove(id);
  if (gone) notify(t("acct_profile.removed", { name: gone.name }));
};

// "#addresses" in the sidebar scrolls to the ports once the page is in.
const route = useRoute();
onMounted(() => {
  if (route.hash)
    nextTick(() =>
      document
        .querySelector(route.hash)
        ?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
});
watch(
  () => route.hash,
  (hash) =>
    hash &&
    document
      .querySelector(hash)
      ?.scrollIntoView({ behavior: "smooth", block: "start" }),
);

definePageMeta({
  layout: "account",
});

useSeoMeta({
  title: () => `${t("acct_profile.page_title")} — PrintPro`,
  description: () => t("acct_profile.seo_desc"),
  robots: "noindex",
});
</script>
