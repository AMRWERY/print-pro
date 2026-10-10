<template>
  <nav
    class="sticky top-0 z-30 -mx-4 border-y border-line bg-ink/90 px-4 backdrop-blur sm:mx-0 sm:rounded-card sm:border"
    aria-label="Configuration steps"
  >
    <ol class="flex gap-1 overflow-x-auto py-2 [scrollbar-width:none]">
      <li v-for="(s, i) in steps" :key="s.id" class="shrink-0 lg:flex-1">
        <LazyVButton
          variant="plain"
          :href="`#${s.id}`"
          :localize="false"
          class="flex w-full items-center gap-2 rounded-control px-3 py-2 text-start transition-colors duration-200"
          :class="
            active === s.id
              ? 'bg-surface text-paper shadow-sm'
              : 'text-mute hover:text-paper'
          "
          :aria-current="active === s.id ? 'step' : undefined"
          @click.prevent="go(s.id)"
        >
          <span
            class="grid h-6 w-6 shrink-0 place-items-center rounded-full border font-mono text-1xs font-bold"
            :class="
              done(s.id)
                ? 'border-success bg-success text-ink'
                : active === s.id
                  ? 'border-accent bg-accent text-onaccent'
                  : 'border-line'
            "
          >
            <Icon
              v-if="done(s.id)"
              name="lucide:check"
              size="12"
              aria-hidden="true"
            />
            <template v-else>{{ i + 1 }}</template>
          </span>
          <span class="min-w-0">
            <span class="block whitespace-nowrap text-xs font-semibold">{{
              s.label
            }}</span>
            <span
              class="hidden whitespace-nowrap font-mono text-2xs text-mute xl:block"
              >{{ s.hint }}</span
            >
          </span>
        </LazyVButton>
      </li>
    </ol>
  </nav>
</template>

<script lang="ts" setup>
const { file } = usePrintConfig();
const reduce = usePreferredReducedMotion();

const steps = [
  { id: "upload", label: "Asset upload", hint: "Preflight" },
  { id: "dimensions", label: "Dimensions & substrate", hint: "Size · paper" },
  { id: "engine", label: "Colour engine & duplex", hint: "Ink · sides" },
  { id: "finishing", label: "Binding & finishing", hint: "Edges · folio" },
  { id: "fulfilment", label: "Fulfilment", hint: "Courier · pickup" },
];

const active = ref("upload");
// Steps 2-5 have sensible defaults, so only the upload can be "not done yet".
const done = (id: string) => id === "upload" && !!file.value;

const go = (id: string) => {
  active.value = id;
  document
    .getElementById(id)
    ?.scrollIntoView({
      behavior: reduce.value === "reduce" ? "auto" : "smooth",
      block: "start",
    });
  history.replaceState(null, "", `#${id}`);
};

// Highlight the step that is currently crossing the top third of the screen.
onMounted(() => {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) if (e.isIntersecting) active.value = e.target.id;
    },
    { rootMargin: "-25% 0px -65% 0px" },
  );
  for (const s of steps) {
    const el = document.getElementById(s.id);
    if (el) io.observe(el);
  }
  onBeforeUnmount(() => io.disconnect());
});
</script>