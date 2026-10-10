<template>
  <section class="section" aria-labelledby="digest-title">
    <div v-reveal class="container-page max-w-2xl space-y-5 text-center">
      <p class="eyebrow text-accent">Bi-weekly technical dispatch</p>
      <h2 id="digest-title" class="text-3xl">The Lens &amp; Sheet Digest</h2>
      <p class="text-sm text-mute">
        Curated bench teardowns, custom ICC profiles for rare Japanese washi
        papers and priority notifications for limited Hasselblad and Leica
        allocations.
      </p>

      <form
        class="mx-auto flex max-w-lg flex-col gap-2 sm:flex-row sm:items-start"
        novalidate
        @submit.prevent="submit"
      >
        <LazyVInput
          ref="emailInput"
          v-model="email"
          class="flex-1 text-start"
          name="digestEmail"
          type="email"
          label="Email address"
          hide-label
          rules="required|email"
          autocomplete="email"
          placeholder="Enter your studio email"
          :disabled="status === 'loading' || status === 'done'"
        />
        <LazyVButton
          variant="primary"
          type="submit"
          class="h-[42px]"
          :disabled="status === 'loading' || status === 'done'"
        >
          <Icon
            v-if="status === 'loading'"
            name="lucide:loader-circle"
            size="16"
            class="animate-spin"
            aria-hidden="true"
          />
          <Icon
            v-else-if="status === 'done'"
            name="lucide:check"
            size="16"
            class="animate-icon-pop"
            aria-hidden="true"
          />
          {{ status === "done" ? "Subscribed" : "Join dispatch" }}
        </LazyVButton>
      </form>

      <p v-if="status === 'done'" class="text-sm text-success" role="status">
        You're on the list. Watch your inbox for the next dispatch.
      </p>
      <p v-else class="meta tracking-wider">
        Strictly pro-spec. Unsubscribe anytime.
      </p>
    </div>
  </section>
</template>

<script lang="ts" setup>
const email = ref("");
const status = ref<"idle" | "loading" | "done">("idle");

const emailInput = ref<{ validate: () => Promise<{ valid: boolean }> }>();

const submit = async () => {
  const result = await emailInput.value?.validate();
  if (!result?.valid) return;
  status.value = "loading";
  // No newsletter backend yet; simulate the request.
  await new Promise((r) => setTimeout(r, 600));
  status.value = "done";
};
</script>