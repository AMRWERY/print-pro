<template>
  <!-- Checkout is a focused flow: no catalog navigation, nothing to wander off to. -->
  <div class="flex min-h-screen flex-col">
    <a
      href="#main"
      class="sr-only z-50 rounded-control bg-accent px-4 py-2 text-onaccent focus:not-sr-only focus:absolute focus:start-4 focus:top-4"
      >Skip to checkout</a
    >

    <header class="border-b border-line bg-surface">
      <div class="container-page flex items-center justify-between gap-4 py-3">
        <VBrandMark />
        <div class="flex items-center gap-2">
          <p class="hidden items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-mute sm:flex">
            <Icon name="lucide:lock" size="14" class="text-success" aria-hidden="true" />Secure checkout
          </p>
          <LazyVLocaleSwitcher compact />
          <LazyVThemeToggle />
        </div>
      </div>
    </header>

    <main id="main" class="flex-1">
      <slot />
    </main>

    <footer class="border-t border-line">
      <div class="container-page flex flex-col gap-2 py-5 font-mono text-xs uppercase tracking-wider text-mute sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 Lumen &amp; Press. All rights reserved.</p>
        <ul class="flex gap-5">
          <li><nuxt-link-locale to="/" class="hover:text-paper">Terms</nuxt-link-locale></li>
          <li><nuxt-link-locale to="/" class="hover:text-paper">Privacy</nuxt-link-locale></li>
          <li><nuxt-link-locale to="/" class="hover:text-paper">Returns</nuxt-link-locale></li>
        </ul>
      </div>
    </footer>
  </div>
</template>
