import { defaultAtelierProfile } from "~/data/account";
import { demoOrderHistory } from "~/data/account-orders";
import { trackingStages, trackingState } from "~/data/tracking";
import type { AtelierProfile, RequisitionOrder } from "~/types/account";
import type { Order } from "~/types/order";

const upper = (s: string) => s.toUpperCase();

/** An order placed through checkout, in the shape the account screens use. */
export const toRequisition = (o: Order, now: Date): RequisitionOrder => {
  const state = trackingState(o, trackingStages(o, now));
  const status: RequisitionOrder["status"] =
    state.state === "delivered"
      ? "delivered"
      : state.state === "in-transit"
        ? "in-transit"
        : "processing";

  const names = o.items.map((i) => i.name);
  return {
    id: `#${o.id}`,
    title:
      names.length > 2
        ? `${names[0]} + ${names.length - 1} more items`
        : names.join(" + "),
    status,
    statusLabel: upper(state.label),
    badgeLabel: upper(o.delivery.label),
    waybill: `LP-${o.pin}`,
    destination: `${o.address.city}`.toUpperCase(),
    amount: o.amounts.total,
    placedAt: o.createdAt,
    real: true,
    items: o.items.map((i) => ({
      name: i.name,
      thumb: i.image,
      icon: i.icon,
      sku: i.sku,
      quantity: i.qty,
    })),
  };
};

/**
 * What the signed-in studio sees across the account area: its profile, and its orders
 * (checkout orders first, then the demo history).
 */
export const useAccount = () => {
  const auth = useAuthStore();
  const orderStore = useOrderStore();
  const wishlist = useWishlistStore();

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

  const orders = computed<RequisitionOrder[]>(() => [
    ...orderStore.orders.map((o) => toRequisition(o, now.value)),
    ...demoOrderHistory(),
  ]);

  const findOrder = (slug: string) => {
    const id = slug.startsWith("#") ? slug : `#${slug}`;
    return orders.value.find((o) => o.id === id);
  };

  /** The checkout order behind a requisition, when it has one. */
  const sourceOrder = (req: RequisitionOrder) =>
    orderStore.get(req.id.replace(/^#/, ""));

  return {
    auth,
    profile,
    orders,
    findOrder,
    sourceOrder,
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
