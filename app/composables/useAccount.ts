import { defaultAtelierProfile } from "~/data/account";
import type { AtelierProfile, RequisitionOrder } from "~/types/account";

/** What the signed-in customer sees across the account area: their profile and their orders from the API. */
export const useAccount = () => {
  const auth = useAuthStore();
  const orderStore = useOrderStore();
  const wishlist = useWishlistStore();
  const account = useAccountStore();

  // Re-evaluated every minute so an order's status moves on while a page is open.
  const now = ref(new Date());
  useIntervalFn(() => (now.value = new Date()), 60_000);

  const profile = computed<AtelierProfile>(() => {
    const u = auth.user;
    return {
      ...defaultAtelierProfile,
      ...(u
        ? {
            id: `LP-${u.id.slice(0, 6).toUpperCase()}`,
            name: u.name,
            title: u.title || defaultAtelierProfile.title,
            affiliation: u.studio,
            metrologyId: `LP-${u.id.slice(0, 6).toUpperCase()}`,
          }
        : {}),
    };
  });

  // Order history comes from the API, for a signed-in customer only; it is fetched in the browser
  // (a signed-out visitor never triggers the request).
  if (import.meta.client)
    watch(
      () => auth.isSignedIn,
      (signedIn) => {
        if (signedIn) account.ensureOrders();
      },
      { immediate: true },
    );
  const pending = computed(
    () => auth.isSignedIn && (account.status === "pending" || account.status === "idle"),
  );
  const error = computed(() => (auth.isSignedIn && account.status === "error" ? account.error : ""));

  const orders = computed<RequisitionOrder[]>(() => account.orders);

  const findOrder = (slug: string) => {
    const id = slug.startsWith("#") ? slug : `#${slug}`;
    return orders.value.find((o) => o.id === id);
  };

  /** The full order behind a requisition, once it has been loaded (see `loadSource`). */
  const sourceOrder = (req: RequisitionOrder) =>
    orderStore.get(req.id.replace(/^#/, ""));

  /** Fetches the full order for its owner (no PIN needed while signed in). */
  const loadSource = (req: RequisitionOrder) =>
    orderStore.load(req.id.replace(/^#/, ""));

  return {
    auth,
    profile,
    orders,
    pending,
    error,
    refresh: account.refresh,
    findOrder,
    sourceOrder,
    loadSource,
    registryCount: computed(() => wishlist.ids.length),
    now,
  };
};

export const orderSlug = (id: string) => id.replace(/^#/, "");

/** When the order was placed, as a date (falls back to the demo `date` text). */
export const orderDate = (o: RequisitionOrder) => {
  const d = new Date(o.placedAt ?? o.date ?? "");
  return Number.isNaN(d.getTime()) ? null : d;
};

export const orderDateLabel = (o: RequisitionOrder) =>
  orderDate(o)?.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }) ?? "—";

/** "Q3 2025" for the quarter filter. */
export const orderQuarter = (o: RequisitionOrder) => {
  const d = orderDate(o);
  return d ? `Q${Math.floor(d.getMonth() / 3) + 1} ${d.getFullYear()}` : "";
};
