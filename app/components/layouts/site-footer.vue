<template>
  <footer class="border-t border-line bg-surface">
    <div
      v-reveal:fade
      class="container-page grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)_1fr]"
    >
      <div class="space-y-4">
        <LazyVBrandMark />

        <p class="max-w-xs text-sm text-mute">
          Precision optical instruments, large-format fine-art printing
          machinery and archival media for working studios.
        </p>
        <form class="flex max-w-xs gap-2" novalidate @submit.prevent="subscribe">
          <LazyVInput
            name="footerEmail"
            type="email"
            label="Email for studio bulletins"
            hide-label
            rules="email"
            autocomplete="email"
            placeholder="Join optical dispatch"
            class="flex-1"
          />
          <LazyVButton variant="primary" type="submit" class="shrink-0" :loading="subscribing"
            >Subscribe</LazyVButton
          >
        </form>
      </div>

      <nav
        v-for="col in footerColumns"
        :key="col.title"
        :aria-label="col.title"
      >
        <h2 class="eyebrow mb-4 !font-sans !font-semibold">{{ col.title }}</h2>
        <ul class="space-y-2.5 text-sm">
          <li v-for="l in col.links" :key="l">
            <LazyVButton variant="tertiary" to="/">{{ l }}</LazyVButton>
          </li>
        </ul>
      </nav>

      <div>
        <h2 class="eyebrow mb-4 !font-sans !font-semibold">
          Support &amp; Spec
        </h2>
        <ul class="space-y-2.5 text-sm text-mute">
          <li class="flex items-center gap-2">
            <Icon
              name="lucide:phone"
              size="16"
              class="icon-wiggle"
              aria-hidden="true"
            /><span dir="ltr">+1 (800) 412-5866</span>
          </li>
          <li class="flex items-center gap-2">
            <Icon
              name="lucide:mail"
              size="16"
              class="icon-wiggle"
              aria-hidden="true"
            />bench@printpro.com
          </li>
          <li class="flex items-center gap-2">
            <Icon
              name="lucide:clock"
              size="16"
              class="icon-spin"
              aria-hidden="true"
            />Mon–Fri · 08:00–18:00
          </li>
        </ul>
      </div>
    </div>

    <div class="border-t border-line">
      <div
        class="container-page flex flex-col gap-2 py-5 meta tracking-wider sm:flex-row sm:items-center sm:justify-between"
      >
        <p>
          © 2026 PrintPro Optical Instruments &amp; Fine Art Printworks Ltd. All
          rights reserved.
        </p>
        <ul class="flex gap-5">
          <li>
            <nuxt-link-locale to="/" class="hover:text-paper"
              >Equipment terms</nuxt-link-locale
            >
          </li>
          <li>
            <nuxt-link-locale to="/" class="hover:text-paper"
              >Privacy</nuxt-link-locale
            >
          </li>
          <li>
            <nuxt-link-locale to="/" class="hover:text-paper"
              >Calibration</nuxt-link-locale
            >
          </li>
        </ul>
      </div>
    </div>
  </footer>
</template>

<script lang="ts" setup>
import { footerColumns } from "~/data/home";

const toast = useToast();
const { validate, resetForm } = useForm();
const subscribing = ref(false);

const subscribe = async () => {
  if (!(await validate()).valid) return;
  subscribing.value = true;
  await simulateRequest(600);
  subscribing.value = false;
  resetForm();
  toast.success("You’re on the list", { description: "Optical dispatch bulletins will arrive by email." });
};
</script>