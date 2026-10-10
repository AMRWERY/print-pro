import { skipHydrate } from "pinia";
import type { Order } from "~/types/order";

const MAX_ORDERS = 10;

// Orders live in this browser only (there is no backend yet).
// initOnMounted keeps SSR and the first client render identical (both empty).
export const useOrderStore = defineStore("orders", () => {
  const orders = useLocalStorage<Order[]>("orders", [], { initOnMounted: true });

  const add = (order: Order) => {
    orders.value = [order, ...orders.value.filter((o) => o.id !== order.id)].slice(0, MAX_ORDERS);
  };

  const get = (id: string) => orders.value.find((o) => o.id === id);

  return { orders: skipHydrate(orders), add, get };
});
