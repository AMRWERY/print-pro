<template>
  <div class="space-y-6">
    <LazyVBreadcrumb :items="crumbs" />

    <header>
      <h1
        class="title-lg"
      >
        Profile &amp; addresses
      </h1>
      <p class="mt-1 text-sm text-mute">
        Your studio details, sign-in security and delivery ports.
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

const docks = useDockStore();

const modalOpen = ref(false);
const editing = ref<ReceivingDock | null>(null);

const crumbs = [
  { label: "Atelier workspace", to: "/account" },
  { label: "Profile & addresses" },
];

const toast = useToast();
const notify = (msg: string) => toast.success(msg);

const openDock = (dock?: ReceivingDock) => {
  editing.value = dock ?? null;
  modalOpen.value = true;
};

const onSaved = (dock: ReceivingDock) => {
  const isNew = !docks.list.some((d) => d.id === dock.id);
  docks.save(dock);
  notify(isNew ? `Added ${dock.name}` : `Updated ${dock.name}`);
};

const makePrimary = (dock: ReceivingDock) => {
  docks.makePrimary(dock.id);
  notify(`${dock.name} is now your primary port`);
};

const remove = (id: string) => {
  const gone = docks.list.find((d) => d.id === id);
  docks.remove(id);
  if (gone) notify(`Removed ${gone.name}`);
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
  title: "Profile & addresses — Lumen & Press",
  description: "Manage your studio details, password and receiving ports.",
  robots: "noindex",
});
</script>
