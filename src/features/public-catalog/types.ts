export interface Category {
  id: string;
  name: string;
}
export interface Product {
  id: string;
  slug: string;
  name: string;
  categoryId: string;
  price: number;
  stock: number;
  size?: string;
  description: string;
  images: string[];
  featured?: boolean;
}
export interface Business {
  slug: string;
  name: string;
  tagline: string;
  whatsappNumber: string;
  logoUrl?: string;
  brandColor: string;
  plan: Plan;
  categories: Category[];
  products: Product[];
}
export type PriceOrder = "default" | "asc" | "desc";
export interface Plan {
  name: string;
  limits?: { maxProducts?: number };
  features?: { stock?: boolean; exportXlsx?: boolean };
}
