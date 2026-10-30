import { skipHydrate } from "pinia";
import type { Order } from "~/types/order";

const MAX_ORDERS = 10;

/** What checkout sends. Prices are never included: the server prices every line itself. */
export interface OrderRequest {
  items: { id: string; qty: number; option?: string }[];
  voucher?: string;
  contact: { name: string; company?: string; email: string; phone: string };
  address: Order["address"];
  delivery: string;
  payment: { id: string; last4?: string };
  notes?: string;
}

export type PlaceResult =
  | { ok: true; order: Order }
  | { ok: false; reason: "stock" | "invalid" | "failed"; message: string };

/**
 * Orders live on the API. This store keeps the ones this tab has placed or looked up (with their PIN) in
 * sessionStorage, so the confirmation page opens instantly and still works after a refresh.
 * initOnMounted keeps SSR and the first client render identical (both empty).
 */
export const useOrderStore = defineStore("orders", () => {
  const orders = useSessionStorage<Order[]>("orders", [], { initOnMounted: true });

  /** True when the last `load` failed for a reason other than "not found" (API unreachable, rate limited). */
  const loadFailed = ref(false);

  const add = (order: Order) => {
    orders.value = [order, ...orders.value.filter((o) => o.id !== order.id)].slice(0, MAX_ORDERS);
  };

  const get = (id: string) => orders.value.find((o) => o.id === id);

  const clear = () => {
    orders.value = [];
  };

  /** Places the order. The returned Order carries the server's amounts and the tracking PIN. */
  const place = async (body: OrderRequest): Promise<PlaceResult> => {
    // Started before any await so the request context is there.
    const request = api<Order>("/api/orders", { method: "POST", body });
    try {
      const order = await request;
      add(order);
      // The signed-in customer's history has a new row.
      if (useAuthStore().isSignedIn) void useAccountStore().refresh();
      return { ok: true, order };
    } catch (e) {
      const status = statusOf(e);
      const message = messageOf(e);
      if (status === 409) return { ok: false, reason: "stock", message };
      if (status === 400) return { ok: false, reason: "invalid", message };
      return { ok: false, reason: "failed", message };
    }
  };

  /**
   * Looks an order up. A signed-in owner needs no PIN (the session cookie identifies them);
   * everyone else passes the PIN. Resolves null when the API doesn't find it.
   */
  const load = async (id: string, pin?: string): Promise<Order | null> => {
    const request = api<Order>(`/api/orders/${encodeURIComponent(id)}`, {
      query: pin ? { pin } : undefined,
    });
    loadFailed.value = false;
    try {
      const order = await request;
      add(order);
      return order;
    } catch (e) {
      loadFailed.value = statusOf(e) !== 404;
      return null;
    }
  };

  return { orders: skipHydrate(orders), loadFailed, add, get, clear, place, load };
});
