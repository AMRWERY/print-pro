<template>
  <auth-shell>
    <template #aside>
      <auth-aside
        eyebrow="Form 1984-PrintPro"
        tag="Business account"
        title="Create your PrintPro account."
        body="Register your business, school or home office to order printers, photocopiers, ink and toner with tracked delivery."
        icon="lucide:printer"
        :points="[
          {
            icon: 'lucide:shield-check',
            title: t('auth.service_and_maintenance'),
            body: 'Book technician visits and manage maintenance contracts online.',
          },
          {
            icon: 'lucide:package-check',
            title: t('auth.supplies_on_repeat'),
            body: 'Reorder the right ink and toner for your machines in one click.',
          },
        ]"
        :stats="[
          { label: t('auth.genuine_supplies'), value: '100%' },
          { label: t('auth.dispatch'), value: 'Same day' },
          { label: t('auth.transit'), value: 'Insured' },
        ]"
      />
    </template>

    <section class="card space-y-5 p-6 sm:p-8" aria-labelledby="register-title">
      <div class="space-y-2">
        <p class="eyebrow flex items-center gap-2">
          <span class="pip" aria-hidden="true" />{{ t("auth.create_account") }}
        </p>
        <h1 id="register-title" class="font-display text-3xl sm:text-4xl">
          {{ t("auth.create_your_account") }}
        </h1>
        <p class="text-sm text-mute">
          {{
            t(
              "auth.create_an_account_to_save_products_place_orders_and_track_delivery",
            )
          }}
        </p>
      </div>

      <form class="space-y-6" novalidate @submit.prevent="submit">
        <fieldset class="grid gap-4 sm:grid-cols-2">
          <legend class="eyebrow mb-3 sm:col-span-2">
            01 · {{ t("auth.identity_organisation") }}
          </legend>

          <LazyVInput
            v-model="form.name"
            name="name"
            label="Full name"
            required
            :rules="requiredText('Enter your full name.')"
            autocomplete="name"
            placeholder="e.g. Elena Rostova"
          />

          <LazyVInput
            v-model="form.studio"
            name="studio"
            label="Company or organisation"
            required
            :rules="requiredText('Enter your company or organisation name.')"
            autocomplete="organization"
            placeholder="e.g. Delta Architects"
          />

          <LazyVInput
            v-model="form.email"
            class="sm:col-span-2"
            name="email"
            type="email"
            label="Email"
            required
            rules="required|email"
            autocomplete="email"
            inputmode="email"
            placeholder="name@company.com"
          />
        </fieldset>

        <fieldset class="space-y-3">
          <legend class="eyebrow mb-1">{{ t("auth.account_type") }}</legend>
          <div class="grid gap-2 sm:grid-cols-3">
            <LazyVRadioInput
              v-for="t in tiers"
              :key="t.id"
              v-model="form.tier"
              name="tier"
              :value="t.id"
              boxed
              dense
              label-class="h-full"
            >
              <span class="block">
                <span class="eyebrow block">{{ t.tag }}</span>
                <span class="label">{{ t.title }}</span>
                <span class="block text-xs text-mute">{{ t.body }}</span>
              </span>
            </LazyVRadioInput>
          </div>
        </fieldset>

        <fieldset class="space-y-4">
          <legend class="eyebrow mb-3">02 · {{ t("auth.password") }}</legend>
          <div class="grid gap-4 sm:grid-cols-2">
            <LazyVInput
              v-model="form.password"
              name="password"
              type="password"
              label="Password"
              required
              revealable
              :rules="strongPasswordRule"
              autocomplete="new-password"
            />

            <LazyVInput
              v-model="form.confirm"
              name="confirm"
              type="password"
              label="Confirm password"
              required
              revealable
              :rules="matchesRule(() => form.password)"
              autocomplete="new-password"
            />
          </div>

          <password-strength :password="form.password" />
        </fieldset>

        <fieldset class="space-y-3">
          <legend class="eyebrow mb-1">03 · {{ t("auth.agreements") }}</legend>
          <LazyVCheckboxInput
            v-model="form.terms"
            name="terms"
            :rules="mustAccept('Accept the terms to create your account.')"
          >
            {{ t("auth.agree_to_the") }}
            <LazyVButton variant="tertiary" to="/" class="!text-accent">{{
              t("btn.terms_of_sale")
            }}</LazyVButton>
            {{ t("auth.and_the_delivery_and_returns_conditions") }}
          </LazyVCheckboxInput>
        </fieldset>

        <p v-if="error" class="callout-accent" role="alert">
          <Icon
            name="lucide:circle-alert"
            size="16"
            class="bullet-icon"
            aria-hidden="true"
          />
          <span
            >{{ error }}
            <LazyVButton
              v-if="exists"
              variant="tertiary"
              to="/auth"
              class="!text-accent"
              >{{ t("btn.sign_in_instead") }}</LazyVButton
            ></span
          >
        </p>

        <LazyVButton
          type="submit"
          variant="primary"
          size="lg"
          block
          :loading="loading"
          icon-end="lucide:arrow-right"
          icon-end-class="icon-nudge rtl:-scale-x-100"
          >{{ t("btn.create_account") }}</LazyVButton
        >
      </form>

      <p class="text-center text-sm text-mute">
        {{ t("auth.already_have_an_account") }}
        <LazyVButton variant="tertiary" to="/auth" class="!text-accent">{{
          t("btn.sign_in")
        }}</LazyVButton>
      </p>
    </section>
  </auth-shell>
</template>

<script lang="ts" setup>
import { tiers } from "~/data/auth";
import type { Tier } from "~/types/auth";

const { t } = useI18n();
const localePath = useLocalePath();

const auth = useAuthStore();

const form = reactive({
  name: "",
  studio: "",
  email: "",
  tier: "business" as Tier,
  password: "",
  confirm: "",
  terms: false,
  newsletter: false,
});

// Cross-field rules need every field registered with one form.
const { validate } = useForm();

const loading = ref(false);
const error = ref("");
const exists = ref(false);

const submit = async () => {
  const result = await validate();
  if (!result.valid) {
    await nextTick();
    document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
    return;
  }

  loading.value = true;
  error.value = "";
  exists.value = false;

  const created = await auth.register({ ...form });
  if (!created.ok) {
    exists.value = created.reason === "exists";
    error.value = exists.value
      ? "An account with that email already exists."
      : created.message ||
        "We couldn't create the account. Check your details and try again.";
    loading.value = false;
    return;
  }

  await auth.login(form.email, form.password, false);
  loading.value = false;
  await navigateTo(localePath("/"));
};

useSeoMeta({
  title: "Create Account",
  description: "Create a PrintPro account.",
  robots: "noindex",
});
</script>