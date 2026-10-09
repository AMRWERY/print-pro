<template>
  <nav aria-label="Checkout progress">
    <ol class="flex items-center">
      <li
        v-for="(s, i) in checkoutSteps"
        :key="s.n"
        class="flex flex-1 items-center last:flex-none"
      >
        <LazyVButton variant="plain"
          class="flex items-center gap-2 rounded-control py-1 text-start transition-colors duration-200 disabled:cursor-default"
          :disabled="!state.canOpen(s.n)"
          :aria-current="state.step === s.n ? 'step' : undefined"
          :aria-label="`Step ${s.n}: ${s.title}${state.completed.includes(s.n) ? ' (completed)' : ''}`"
          @click="state.edit(s.n)"
        >
          <span
            class="grid h-8 w-8 shrink-0 place-items-center rounded-full border font-mono text-xs transition-colors duration-200"
            :class="
              state.completed.includes(s.n)
                ? 'border-success bg-success text-onprimary'
                : state.step === s.n
                  ? 'border-accent bg-accent text-onaccent'
                  : 'border-line text-mute'
            "
          >
            <Icon
              v-if="state.completed.includes(s.n)"
              name="lucide:check"
              size="14"
              class="animate-icon-pop"
              aria-hidden="true"
            />

            <template v-else>{{ s.n }}</template>
          </span>

          <span
            class="hidden text-sm sm:block"
            :class="state.step === s.n ? 'font-medium text-paper' : 'text-mute'"
            >{{ s.short }}</span
          >
        </LazyVButton>
        <span
          v-if="i < checkoutSteps.length - 1"
          class="mx-2 h-px flex-1 transition-colors duration-300"
          :class="state.completed.includes(s.n) ? 'bg-success' : 'bg-line'"
          aria-hidden="true"
        />
      </li>
    </ol>
  </nav>
</template>

<script lang="ts" setup>
import { checkoutSteps } from "~/data/checkout";

const state = useCheckoutState();
</script>