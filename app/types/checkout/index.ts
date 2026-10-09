export interface PlacedOrder {
  id: string;
  name: string;
  email: string;
  total: number;
  delivery: string;
  payment: string;
  items: { key: string; name: string; qty: number; price: number }[];
}
