export interface OrderItem {
  key: string;
  id: string;
  name: string;
  brand: string;
  qty: number;
  unitPrice: number;
  option?: string;
  sku?: string;
  icon: string;
  image?: string;
  imageAlt?: string;
  specs: string[];
}

export interface OrderAmounts {
  units: number;
  subtotal: number;
  volume: number;
  voucher: number;
  voucherLabel?: string;
  wire: number;
  shipping: number;
  tax: number;
  total: number;
}

export interface Order {
  id: string;
  /** ISO timestamp. */
  createdAt: string;
  name: string;
  company?: string;
  email: string;
  phone: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    region: string;
    postal: string;
    country: string;
  };
  delivery: { id: string; label: string; note: string; days: number };
  payment: { id: "card" | "wire"; label: string; last4?: string };
  notes?: string;
  items: OrderItem[];
  amounts: OrderAmounts;
  /** Short code the customer quotes when tracking the order. */
  pin: string;
}
