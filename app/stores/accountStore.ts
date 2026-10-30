import type { RequisitionOrder } from "~/types/account";
import type { LoadStatus } from "~/stores/catalogStore";

/**
 * The signed-in customer's order history (/api/account/orders). Only signed-in customers have any: a
 * signed-out visitor never triggers the request, and signing out (or in as someone else) empties it.
 */
export const useAccountStore = defineStore("account", () => {
  const auth = useAuthStore();

  const orders = ref<RequisitionOrder[]>([]);
  const status = ref<LoadStatus>("idle");
  const error = ref("");
  let inflight: Promise<void> | null = null;
  // Bumped when the account changes, so a slow answer for the previous customer is ignored.
  let generation = 0;

  const reset = () => {
    generation++;
    inflight = null;
    orders.value = [];
    status.value = "idle";
    error.value = "";
  };

  /** (Re)loads the history, showing the current list while it refreshes. Never rejects. */
  const refresh = (): Promise<void> => {
    if (!auth.isSignedIn) {
      reset();
      return Promise.resolve();
    }
    if (inflight) return inflight;
    const mine = generation;
    if (status.value !== "ready") status.value = "pending";
    error.value = "";
    const p: Promise<void> = api<RequisitionOrder[]>("/api/account/orders")
      .then((list) => {
        if (mine !== generation) return;
        orders.value = list;
        status.value = "ready";
      })
      .catch((e: unknown) => {
        if (mine !== generation) return;
        error.value = messageOf(e) || "Your orders could not be loaded.";
        if (status.value !== "ready") status.value = "error";
      })
      .finally(() => {
        if (inflight === p) inflight = null;
      });
    inflight = p;
    return p;
  };

  /** Loads the history the first time it is needed (and retries after a failure). */
  const ensureOrders = (): Promise<void> =>
    inflight ?? (status.value === "idle" || status.value === "error" ? refresh() : Promise.resolve());

  // Another account (or none) means another history.
  watch(
    () => auth.user?.id ?? "",
    (id, before) => {
      if (id !== before) reset();
    },
  );

  return { orders, status, error, refresh, ensureOrders, clear: reset };
});
