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

    <Transition name="toast">
      <p
        v-if="toast"
        role="status"
        class="fixed bottom-20 end-4 z-50 rounded-card border border-accent/40 bg-surface px-4 py-3 font-mono text-xs shadow-2xl lg:bottom-6"
      >
        {{ toast }}
      </p>
    </Transition>
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

const toast = ref("");
const { start: hideToast } = useTimeoutFn(() => (toast.value = ""), 3000, {
  immediate: false,
});
const notify = (msg: string) => {
  toast.value = msg;
  hideToast();
};

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

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition:
    transform 0.25s ease-out,
    opacity 0.25s ease-out;
}

.toast-enter-from,
.toast-leave-to {
  transform: translateY(12px);
  opacity: 0;
}
</style>