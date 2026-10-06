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
  size: string;
  description: string;
  images: string[];
  featured?: boolean;
}
export interface Business {
  slug: string;
  name: string;
  tagline: string;
  categories: Category[];
  products: Product[];
}
export type PriceOrder = "default" | "asc" | "desc";
