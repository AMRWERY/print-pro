// Finds out who is signed in before the first page renders (on the server too, from the visitor's cookie),
// so pages can read the account synchronously and server-rendered HTML already matches it.
export default defineNuxtPlugin(async () => {
  await useAuthStore().ensureLoaded();
});
