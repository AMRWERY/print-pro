import { skipHydrate } from "pinia";
import type { CustomerReview } from "~/types/product";

/** Reviews customers submit, kept in this browser only until there is an API to post them to. */
export const useReviewStore = defineStore("reviews", () => {
  // initOnMounted keeps SSR and the first client render identical (both empty).
  const byProduct = useLocalStorage<Record<string, CustomerReview[]>>(
    "product-reviews",
    {},
    { initOnMounted: true },
  );

  const forProduct = (productId: string) => byProduct.value[productId] ?? [];

  const add = (
    productId: string,
    input: Omit<CustomerReview, "id" | "createdAt">,
  ) => {
    const review: CustomerReview = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    byProduct.value = {
      ...byProduct.value,
      [productId]: [review, ...forProduct(productId)],
    };
    return review;
  };

  return { byProduct: skipHydrate(byProduct), forProduct, add };
});
