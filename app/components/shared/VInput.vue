<template>
  <div class="space-y-1.5">
    <label :for="fieldId" class="block text-sm font-medium">
      {{ label }}
      <span v-if="required" class="text-accent" aria-hidden="true">*</span>

      <span v-else class="font-normal text-mute">(optional)</span>
    </label>

    <!-- The control goes here; spread `aria` onto it so the label, hint and error are announced. -->
    <slot :id="fieldId" :invalid="!!error" :aria="aria" />

    <p v-if="hint && !error" :id="`${fieldId}-hint`" class="text-xs text-mute">
      {{ hint }}
    </p>
    <p
      v-if="error"
      :id="`${fieldId}-error`"
      class="flex items-start gap-1.5 text-xs text-accent"
      role="alert"
    >
      <Icon
        name="lucide:circle-alert"
        size="14"
        class="mt-px shrink-0"
        aria-hidden="true"
      />{{ error }}
    </p>
  </div>
</template>

<script lang="ts" setup>
// Label + control + hint/error, wired for assistive tech:
//
//   <LazyVInput label="Email" :error="errors.email" v-slot="{ id, aria }">
//     <input :id="id" v-bind="aria" v-model="form.email" class="field" />
//   </LazyVInput>

const props = withDefaults(
  defineProps<{
    label: string;
    error?: string;
    hint?: string;
    required?: boolean;
  }>(),
  { required: true },
);

const fieldId = useId();

const aria = computed(() => ({
  "aria-invalid": props.error ? "true" : undefined,
  "aria-describedby": props.error
    ? `${fieldId}-error`
    : props.hint
      ? `${fieldId}-hint`
      : undefined,
  "aria-required": props.required || undefined,
}));
</script>