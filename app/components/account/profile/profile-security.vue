<template>
  <section id="security" class="scroll-mt-28 card-roomy" aria-labelledby="security-title">
    <header class="mb-5 border-b border-line pb-4">
      <h2 id="security-title" class="flex items-center gap-2 font-display text-lg font-bold text-paper"><Icon name="lucide:key-round" size="18" class="text-accent" aria-hidden="true" />Passkey &amp; password</h2>
      <p class="text-xs text-mute">Demo build: your password is hashed (PBKDF2) and stored only in this browser.</p>
    </header>

    <form class="max-w-xl space-y-4" novalidate @submit.prevent="submit">
      <LazyVInput v-model="current" name="current-password" type="password" label="Current password" required revealable autocomplete="current-password" :rules="currentRule" />
      <div>
        <LazyVInput v-model="next" name="new-password" type="password" label="New password" required revealable autocomplete="new-password" :rules="strongPasswordRule" />
        <password-strength :password="next" class="mt-2" />
      </div>
      <LazyVInput v-model="confirm" name="confirm-new-password" type="password" label="Confirm new password" required revealable autocomplete="new-password" :rules="matchesRule(() => next)" />

      <div class="flex flex-wrap items-center gap-3">
        <LazyVButton type="submit" variant="primary" :loading="saving" icon="lucide:shield-check">Update password</LazyVButton>
        <p v-if="done" role="status" class="flex items-center gap-1.5 text-sm text-success"><Icon name="lucide:check-circle" size="16" aria-hidden="true" />Password updated</p>
      </div>
    </form>
  </section>
</template>

<script lang="ts" setup>
const auth = useAuthStore();

const current = ref("");
const next = ref("");
const confirm = ref("");
const saving = ref(false);
const done = ref(false);
const wrong = ref(false);

const { validate, resetForm } = useForm();
const { start: clearDone } = useTimeoutFn(() => (done.value = false), 4000, { immediate: false });

// The store checks the real password; this rule just surfaces its answer next to the field.
const currentRule = (v: unknown) =>
  !String(v ?? "") ? "Enter your current password." : wrong.value ? "That isn’t your current password. Check it and try again." : true;

watch(current, () => (wrong.value = false));

const submit = async () => {
  done.value = false;
  const result = await validate();
  if (!result.valid) {
    await nextTick();
    document.querySelector<HTMLElement>('#security [aria-invalid="true"]')?.focus();
    return;
  }
  saving.value = true;
  const res = await auth.changePassword(current.value, next.value);
  saving.value = false;
  if (!res.ok) {
    wrong.value = true;
    await validate();
    await nextTick();
    document.querySelector<HTMLElement>('#security [aria-invalid="true"]')?.focus();
    return;
  }
  current.value = next.value = confirm.value = "";
  await nextTick();
  resetForm();
  done.value = true;
  clearDone();
};
</script>
