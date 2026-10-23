export const studioTags = [
  "Head office",
  "Branch office",
  "Print room",
  "Reception",
  "Home office",
  "Unassigned",
];

export const wishlistSortOptions = [
  { key: "price-desc", label: "Price (high to low)" },
  { key: "price-asc", label: "Price (low to high)" },
  { key: "rating", label: "Top rated" },
  { key: "name", label: "Name (A–Z)" },
] as const;

/** One-click sample so a new visitor can see a populated wishlist. */
export const sampleRegistry = ["corex-laser-450c", "kopira-pro-a3-35", "nordjet-lf-44", "corex-toner-210-hy", "printa-tank-500"];

export const wishlistAssurances = [
  { icon: "lucide:flask-conical", title: "Tested before dispatch", body: "Every printer and photocopier is test-printed and checked by a technician before it leaves us." },
  { icon: "lucide:truck", title: "Delivery and installation", body: "Heavy machines are delivered on a pallet, installed on site and connected to your network." },
  { icon: "lucide:shield-check", title: "Genuine supplies", body: "Original ink, toner and drum units, factory sealed and matched to your model." },
  { icon: "lucide:users", title: "Share with your team", body: "Share your wishlist with colleagues and purchasing staff before you order." },
];
