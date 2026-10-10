<template>
  <section id="profile" class="scroll-mt-28 card-roomy" aria-labelledby="identity-title">
    <header class="mb-5 flex items-center gap-3 border-b border-line pb-4">
      <span class="grid h-12 w-12 place-items-center rounded-full bg-accent-soft font-display text-lg font-bold text-accent" aria-hidden="true">{{ initials }}</span>
      <div>
        <h2 id="identity-title" class="font-display text-lg font-bold text-paper">Studio identity</h2>
        <p class="text-xs text-mute">How you appear on orders, invoices and calibration certificates.</p>
      </div>
    </header>

    <form class="grid gap-4 sm:grid-cols-2" novalidate @submit.prevent="save">
      <LazyVInput v-model="name" name="profile-name" label="Full name" required autocomplete="name" :rules="requiredText('Enter your full name.')" />
      <LazyVInput v-model="title" name="profile-title" label="Job title" optional autocomplete="organization-title" />
      <LazyVInput v-model="studio" name="profile-studio" label="Studio / company" required autocomplete="organization" :rules="requiredText('Enter your studio or company name.')" />
      <LazyVInput v-model="phone" name="profile-phone" type="tel" label="Phone" optional autocomplete="tel" :rules="phoneOptional" hint="Used by the carrier for delivery." />
      <LazyVInput :model-value="auth.user?.email" name="profile-email" type="email" label="Email" disabled hint="Your sign-in email can't be changed here." class="sm:col-span-2" />

      <div class="flex flex-wrap items-center gap-3 sm:col-span-2">
        <LazyVButton type="submit" variant="primary" :loading="saving">Save changes</LazyVButton>
        <p v-if="saved" role="status" class="flex items-center gap-1.5 text-sm text-success"><Icon name="lucide:check-circle" size="16" aria-hidden="true" />Profile saved</p>
      </div>
    </form>
  </section>
</template>

<script lang="ts" setup>
const auth = useAuthStore();

const name = ref(auth.user?.name ?? "");
const title = ref(auth.user?.title ?? "");
const studio = ref(auth.user?.studio ?? "");
const phone = ref(auth.user?.phone ?? "");
const saving = ref(false);
const saved = ref(false);

// The saved account is read from this browser after mount, so fill the form once it arrives.
watch(
  () => auth.user,
  (u) => {
    if (!u) return;
    name.value ||= u.name;
    title.value ||= u.title ?? "";
    studio.value ||= u.studio;
    phone.value ||= u.phone ?? "";
  },
  { immediate: true },
);

const initials = computed(() =>
  (name.value || "?")
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join(""),
);

// A phone number is optional, but when given it has to be reachable.
const phoneOptional = (v: unknown) => (String(v ?? "").trim() ? phoneRule(v) : true);

const { validate } = useForm();
const { start: clearSaved } = useTimeoutFn(() => (saved.value = false), 3000, { immediate: false });

const save = async () => {
  const result = await validate();
  if (!result.valid) {
    await nextTick();
    document.querySelector<HTMLElement>('#profile [aria-invalid="true"]')?.focus();
    return;
  }
  saving.value = true;
  auth.updateProfile({ name: name.value.trim(), title: title.value.trim(), studio: studio.value.trim(), phone: phone.value.trim() });
  saving.value = false;
  saved.value = true;
  clearSaved();
};
</script>
