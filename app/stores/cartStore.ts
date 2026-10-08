export const useCartStore = defineStore("cart", () => {
  const count = ref(0);
  const total = ref(0);

  const add = (price: number) => {
    count.value += 1;
    total.value += price;
  };

  return { count, total, add };
});
