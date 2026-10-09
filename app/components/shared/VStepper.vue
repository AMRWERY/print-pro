<template>
  <section class="card" :aria-labelledby="`${uid}-title`">
    <header class="flex items-center gap-3 p-4 sm:p-5">
      <span
        class="grid h-8 w-8 shrink-0 place-items-center rounded-full border font-mono text-xs"
        :class="
          done
            ? 'border-success bg-success text-onprimary'
            : current
              ? 'border-accent bg-accent text-onaccent'
              : 'border-line text-mute'
        "
        aria-hidden="true"
      >
        <Icon v-if="done" name="lucide:check" size="14" />

        <template v-else>{{ n }}</template>
      </span>

      <div class="min-w-0 flex-1">
        <h2
          :id="`${uid}-title`"
          class="font-display text-xl"
          :class="!current && !done && 'text-mute'"
        >
          {{ title }}
        </h2>
        <p
          v-if="done && !current && summary"
          class="truncate text-sm text-mute"
        >
          {{ summary }}
        </p>
      </div>

      <button
        v-if="done && !current"
        type="button"
        class="link-quiet text-sm underline-offset-4 hover:underline"
        :aria-label="`Edit ${title}`"
        @click="state.edit(n)"
      >
        Edit
      </button>
    </header>

    <!-- Only the current step is open; the others keep their summary. -->
    <div
      class="grid transition-[grid-template-rows] duration-300 ease-out"
      :class="current ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
      :inert="!current"
    >
      <div class="overflow-hidden">
        <div class="space-y-5 border-t border-line p-4 sm:p-5"><slot /></div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
const props = defineProps<{ n: number; title: string; summary?: string }>();

const state = useCheckoutState();
const uid = useId();

const current = computed(() => state.step === props.n);
const done = computed(() => state.completed.includes(props.n));
</script>