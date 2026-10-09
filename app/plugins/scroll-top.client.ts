// A new page should open at the top. Nuxt does this by default, but it can be skipped
// when the layout changes (e.g. default -> checkout) while a page transition is running,
// leaving the visitor halfway down the new page.
//
// Back/forward navigation is left alone: Nuxt restores the saved position for those.
export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter();
  let pending = false;

  router.afterEach((to, from) => {
    // Same page with a different query (search, filters) or a #hash should keep its scroll.
    pending = to.path !== from.path && !to.hash;
  });

  nuxtApp.hook("page:finish", () => {
    if (!pending) return;
    pending = false;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, left: 0, behavior: reduce ? "auto" : "instant" });
  });
});
