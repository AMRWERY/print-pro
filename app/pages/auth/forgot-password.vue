<template>
  <auth-shell>
    <section class="card space-y-5 p-6 sm:p-8" aria-labelledby="forgot-title">
      <!-- Sent -->
      <template v-if="sent">
        <div class="space-y-2">
          <p class="eyebrow flex items-center gap-2 text-success">
            <Icon name="lucide:mail-check" size="14" aria-hidden="true" />{{
              t("auth.check_your_inbox")
            }}
          </p>
          <h1
            id="forgot-title"
            ref="heading"
            tabindex="-1"
            class="font-display text-3xl focus:outline-none"
          >
            {{ t("auth.recovery_link_sent") }}
          </h1>
          <p class="text-sm text-mute">
            {{ t("auth.if") }} <span class="text-paper">{{ email }}</span>
            {{
              t(
                "auth.belongs_to_an_account_you_receive_one_time_link_valid_for_minutes_check_your_spam_folder_if_it_does_not_arrive",
              )
            }}
          </p>
        </div>

        <!-- Only outside production, where no mail service is connected and the API returns the link's token. -->
        <div
          v-if="sent.token"
          class="space-y-3 rounded-card border border-yellow/40 bg-yellow-soft p-4 text-sm"
          role="note"
        >
          <p class="flex items-center gap-2 font-medium">
            <Icon name="lucide:flask-conical" size="16" aria-hidden="true" />{{
              t("auth.demo_mode")
            }}
          </p>
          <p class="text-mute">
            {{
              t(
                "auth.no_email_is_sent_from_this_demo_use_the_link_below_to_continue",
              )
            }}
          </p>
          <LazyVButton
            variant="primary"
            size="sm"
            :to="{ path: '/auth/reset-password', query: { token: sent.token } }"
            icon-end="lucide:arrow-right"
            icon-end-class="icon-nudge rtl:-scale-x-100"
            >{{ t("btn.open_reset_link") }}</LazyVButton
          >
        </div>

        <LazyVButton
          variant="tertiary"
          to="/auth"
          icon="lucide:arrow-left"
          icon-class="rtl:-scale-x-100"
          >{{ t("btn.back_to_sign_in") }}</LazyVButton
        >
      </template>

      <!-- Ask -->
      <template v-else>
        <div class="space-y-2">
          <p class="eyebrow flex items-center gap-2">
            <span class="pip" aria-hidden="true" />{{
              t("auth.account_recovery")
            }}
          </p>
          <h1 id="forgot-title" class="font-display text-3xl sm:text-4xl">
            {{ t("auth.reset_your_password") }}
          </h1>
          <p class="text-sm text-mute">
            {{
              t(
                "auth.belongs_to_an_account_you_receive_one_time_link_valid_for_minutes_check_your_spam_folder_if_it_does_not_arrive",
              )
            }}
          </p>
        </div>

        <form class="space-y-4" novalidate @submit.prevent="submit">
          <LazyVInput
            ref="emailField"
            v-model="email"
            name="email"
            type="email"
            label="Email"
            required
            rules="required|email"
            autocomplete="email"
            inputmode="email"
            icon="lucide:mail"
          />

          <LazyVButton
            type="submit"
            variant="primary"
            size="lg"
            block
            :loading="loading"
            icon-end="lucide:arrow-right"
            icon-end-class="icon-nudge rtl:-scale-x-100"
            >{{ t("btn.send_recovery_link") }}</LazyVButton
          >
        </form>

        <div
          class="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4 text-sm"
        >
          <LazyVButton
            variant="tertiary"
            to="/auth"
            icon="lucide:arrow-left"
            icon-class="rtl:-scale-x-100"
            >{{ t("btn.back_to_sign_in") }}</LazyVButton
          >

          <LazyVButton
            variant="tertiary"
            href="tel:+18004925866"
            icon="lucide:headset"
            >{{ t("btn.need_help") }} +1 (800) 492-5866</LazyVButton
          >
        </div>
      </template>
    </section>
  </auth-shell>
</template>

<script lang="ts" setup>
import type { Validatable } from "~/types/auth";

const { t } = useI18n();
const auth = useAuthStore();

const email = ref("");
const emailField = ref<Validatable>();
const loading = ref(false);
const sent = ref<{ token?: string; expires: number } | null>(null);
const heading = ref<HTMLElement>();

const submit = async () => {
  const check = await emailField.value?.validate();
  if (!check?.valid) return;

  loading.value = true;
  // The same answer whether or not the email is registered, so this form can't be used to find accounts.
  sent.value = await auth.requestReset(email.value);
  loading.value = false;

  await nextTick();
  heading.value?.focus();
};

useSeoMeta({
  title: "Reset Password",
  description: "Reset your account password.",
  robots: "noindex",
});
</script>