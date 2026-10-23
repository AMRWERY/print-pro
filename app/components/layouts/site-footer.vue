<template>
  <footer class="border-t border-line bg-surface">
    <div
      v-reveal:fade
      class="container-page grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)_1fr]"
    >
      <div class="space-y-4">
        <LazyVBrandMark />

        <p class="max-w-xs text-sm text-mute">
          Printers, photocopiers and genuine ink and toner for homes, offices
          and print rooms, delivered and installed by our technicians.
        </p>
      </div>

      <nav
        v-for="col in footerColumns"
        :key="col.title"
        :aria-label="col.title"
      >
        <h2 class="eyebrow mb-4 !font-sans !font-semibold">{{ col.title }}</h2>
        <ul class="space-y-2.5 text-sm">
          <li v-for="l in col.links" :key="l.label">
            <LazyVButton variant="tertiary" :to="l.to">{{ l.label }}</LazyVButton>
          </li>
        </ul>
      </nav>

      <div>
        <h2 class="eyebrow mb-4 !font-sans !font-semibold">
          Support
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
            />support@printpro.com
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
          © 2026 PrintPro. All rights reserved.
        </p>
        <ul class="flex gap-5">
          <li v-for="l in legalLinks" :key="l.label">
            <nuxt-link-locale :to="l.to" class="hover:text-paper">{{
              l.label
            }}</nuxt-link-locale>
          </li>
        </ul>
      </div>
    </div>
  </footer>
</template>

<script lang="ts" setup>
import { footerColumns } from "~/data/home";

const legalLinks = [
  { label: "Equipment terms", to: "/legal/equipment-terms" },
  { label: "Privacy", to: "/legal/privacy" },
  { label: "Shipping & delivery", to: "/services/shipping-delivery" },
];

const toast = useToast();
const { validate, resetForm } = useForm();
const subscribing = ref(false);

const subscribe = async () => {
  if (!(await validate()).valid) return;
  subscribing.value = true;
  await simulateRequest(600);
  subscribing.value = false;
  resetForm();
  toast.success("You’re on the list", { description: "Our monthly newsletter will arrive by email." });
};
</script>