// https://nuxt.com/docs/api/configuration/nuxt-config

// Pages from before the store became printers, photocopiers and inks. Old links go to the nearest new page.
const movedPages: Record<string, string> = {
  "/products/cameras": "/products",
  "/products/lenses": "/products",
  "/products/lighting": "/products",
  "/products/audio": "/products",
  "/products/tripods": "/products",
  "/products/accessories": "/products",
  "/products/paper-ink": "/products/inks-toner",
  "/services/bench-calibration": "/services/maintenance-contracts",
  "/services/studio-financing": "/services/financing",
  "/services/shipping-freight": "/services/shipping-delivery",
  "/guides/icc-profiling": "/guides/choosing-a-printer",
  "/guides/medium-format-film": "/guides/choosing-a-printer",
  "/guides/calibration": "/guides/choosing-a-printer",
};

const redirects = Object.fromEntries(
  ["en", "ar"].flatMap((locale) =>
    Object.entries(movedPages).map(([from, to]) => [
      `/${locale}${from}`,
      { redirect: { to: `/${locale}${to}`, statusCode: 301 } },
    ]),
  ),
);

export default defineNuxtConfig({
  runtimeConfig: {
    // Where the PrintPro API lives (server-only). Override with NUXT_API_BASE.
    apiBase: "http://localhost:4000",
  },
  routeRules: redirects,
  modules: [
    "@pinia/nuxt",
    "@vee-validate/nuxt",
    "@nuxtjs/i18n",
    "@vueuse/nuxt",
    "@nuxt/icon",
  ],
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  pinia: {
    storesDirs: ["./stores/**", "./custom-folder/stores/**"],
  },
  i18n: {
    vueI18n: "app/config/i18n/i18n.config.ts",
    restructureDir: "",
    langDir: "app/config/i18n/locales",
    locales: [
      {
        code: "en",
        iso: "en-US",
        file: "en.json",
        name: "EN",
        dir: "ltr",
      },
      { code: "ar", iso: "ar-EG", file: "ar.json", name: "ع", dir: "rtl" },
    ],
    defaultLocale: "ar",
    strategy: "prefix",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      fallbackLocale: "ar",
      redirectOn: "root",
    },
    bundle: {},
  },
  veeValidate: {
    autoImports: true,
  },
  nitro: {
    // Workaround for nuxt/nuxt#36467 (Windows path separators in Nitro externals)
    externals: {
      inline: [/[\\/]node_modules[\\/]nuxt[\\/]dist[\\/]/],
    },
  },
  vite: {
    optimizeDeps: {
      // Vite 8's dep scan can't resolve "#components" inside @nuxtjs/i18n
      noDiscovery: true,
      include: [
        "vue",
        "vue-router",
        "pinia",
        "@vueuse/core",
        "vee-validate",
        "qrcode",
      ],
    },
  },
  css: ["~/assets/css/main.css"],
  components: [
    {
      path: "components",
      // path: resolve(layerDir, "components"),
      pathPrefix: false,
    },
  ],
  app: {
    head: {
      title: "PrintPro",
      link: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;700&family=Reem+Kufi:wght@600;700&display=swap",
        },
      ],
      meta: [
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        {
          charset: "utf-8",
        },
      ],
    },
    pageTransition: { name: "page", mode: "out-in" },
  },
});