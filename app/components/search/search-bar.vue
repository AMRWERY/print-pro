<template>
  <div ref="root" class="relative">
    <form
      role="search"
      class="flex items-center gap-2 rounded-card border bg-surface p-2 transition duration-200"
      :class="open ? 'border-accent' : 'border-line'"
      @submit.prevent="submit()"
    >
      <Icon name="lucide:search" size="22" class="ms-2 shrink-0 text-accent" aria-hidden="true" />
      <LazyVInput
        ref="input"
        v-model="draft"
        class="min-w-0 flex-1"
        name="siteSearch"
        label="Search the catalog"
        hide-label
        variant="bare"
        input-class="w-full bg-transparent px-1 py-2 text-base text-paper placeholder:text-mute focus:outline-none sm:text-lg"
        role="combobox"
        autocomplete="off"
        enterkeyhint="search"
        placeholder="Search cameras, lenses, printers, paper…"
        aria-autocomplete="list"
        :aria-expanded="open"
        :aria-controls="uid + '-panel'"
        :aria-activedescendant="activeIndex >= 0 ? uid + '-panel-opt-' + activeIndex : undefined"
        @focus="open = true"
        @input="onInput"
        @keydown.down.prevent="move(1)"
        @keydown.up.prevent="move(-1)"
        @keydown.enter="onEnter"
      />
      <LazyVButton variant="icon" size="sm" v-if="draft" class="border-transparent" aria-label="Clear search" @click="clear">
        <Icon name="lucide:x" size="16" aria-hidden="true" />
      </LazyVButton>
   
      <LazyVButton variant="primary" type="submit" class="shrink-0">
        <span class="hidden sm:inline">Search</span>
        <Icon name="lucide:arrow-right" size="16" class="icon-nudge rtl:-scale-x-100 sm:hidden" aria-hidden="true" />
      </LazyVButton>
    </form>

    <Transition name="drop">
      <div v-show="open" class="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-card border border-line bg-surface shadow-xl shadow-black/30">
        <search-suggestions
          :id="`${uid}-panel`"
          :matches="matches"
          :recent="history.recent.value"
          :active-index="activeIndex"
          @pick="pick"
          @clear-recent="history.clearRecent()"
        />
      </div>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
const catalog = useCatalog();
const history = useSearchHistory();
const uid = useId();

const root = ref<HTMLElement>();
const input = ref<{ focus: () => void; blur: () => void }>();
const open = ref(false);
const draft = ref(catalog.filters.query);
const activeIndex = ref(-1);

// The applied query (URL / chips) is the source of truth; keep the box in step.
watch(
  () => catalog.filters.query,
  (q) => (draft.value = q),
);

const matches = computed(() => catalog.suggest(draft.value, 4));

const onInput = () => {
  open.value = true;
  activeIndex.value = -1;
};

const move = (dir: 1 | -1) => {
  open.value = true;
  const n = matches.value.length;
  if (!n) return;
  activeIndex.value = (activeIndex.value + dir + n) % n;
};

const onEnter = (e: KeyboardEvent) => {
  const hit = matches.value[activeIndex.value];
  if (hit) {
    e.preventDefault();
    pick(hit.name);
  }
};

const submit = (term = draft.value) => {
  const q = term.trim();
  draft.value = q;
  catalog.filters.query = q;
  history.add(q);
  open.value = false;
  activeIndex.value = -1;
  input.value?.blur();
};

const pick = (term: string) => submit(term);

const clear = () => {
  draft.value = "";
  catalog.filters.query = "";
  input.value?.focus();
};

onClickOutside(root, () => (open.value = false));

onKeyStroke("Escape", () => {
  if (open.value) {
    open.value = false;
    input.value?.blur();
  }
});
</script>

<style scoped>
.drop-enter-active,
.drop-leave-active {
  transition:
    opacity 0.2s ease-out,
    transform 0.2s ease-out;
}

.drop-enter-from,
.drop-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
