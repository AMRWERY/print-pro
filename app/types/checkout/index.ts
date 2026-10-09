export interface PlacedOrder {
  id: string;
  name: string;
  email: string;
  total: number;
  delivery: string;
  payment: string;
  items: { key: string; name: string; qty: number; price: number }[];
}

export interface CheckoutAmounts {
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

export interface DeliveryOption {
  id: "crated" | "express" | "pickup";
  label: string;
  note: string;
  /** Working days until delivery or pickup. */
  days: number;
  icon: string;
}
