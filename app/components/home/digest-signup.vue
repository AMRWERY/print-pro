<template>
  <section class="section" aria-labelledby="digest-title">
    <div class="container-page max-w-2xl space-y-5 text-center">
      <p class="eyebrow text-accent">Bi-weekly technical dispatch</p>
      <h2 id="digest-title" class="text-3xl">The Lens &amp; Sheet Digest</h2>
      <p class="text-sm text-mute">Curated bench teardowns, custom ICC profiles for rare Japanese washi papers and priority notifications for limited Hasselblad and Leica allocations.</p>

      <form class="mx-auto flex max-w-lg flex-col gap-2 sm:flex-row sm:items-start" novalidate @submit.prevent="submit">
        <div class="flex-1 text-start">
          <label for="digest-email" class="sr-only">Email address</label>
          <input
            id="digest-email"
            v-model="email"
            type="email"
            autocomplete="email"
            placeholder="Enter your studio email"
            class="field"
            :aria-invalid="!!error"
            :aria-describedby="error ? 'digest-error' : undefined"
            :disabled="status === 'loading' || status === 'done'"
          >
          <p v-if="error" id="digest-error" class="mt-1.5 flex items-center gap-1.5 text-sm text-accent" role="alert">
            <Icon name="lucide:circle-alert" size="14" aria-hidden="true" />{{ error }}
          </p>
        </div>
        <button type="submit" class="btn-accent h-[42px]" :disabled="status === 'loading' || status === 'done'">
          <Icon v-if="status === 'loading'" name="lucide:loader-circle" size="16" class="animate-spin" aria-hidden="true" />
          <Icon v-else-if="status === 'done'" name="lucide:check" size="16" class="animate-icon-pop" aria-hidden="true" />
          {{ status === 'done' ? 'Subscribed' : 'Join dispatch' }}
        </button>
      </form>

      <p v-if="status === 'done'" class="text-sm text-success" role="status">You're on the list. Watch your inbox for the next dispatch.</p>
      <p v-else class="font-mono text-xs uppercase tracking-wider text-mute">Strictly pro-spec. Unsubscribe anytime.</p>
    </div>
  </section>
</template>

<script lang="ts" setup>
const email = ref('')
const error = ref('')
const status = ref<'idle' | 'loading' | 'done'>('idle')

const submit = async () => {
  error.value = /^\S+@\S+\.\S+$/.test(email.value) ? '' : 'Enter a valid email address, for example studio@example.com.'
  if (error.value) return
  status.value = 'loading'
  // No newsletter backend yet; simulate the request.
  await new Promise((r) => setTimeout(r, 600))
  status.value = 'done'
}
</script>
