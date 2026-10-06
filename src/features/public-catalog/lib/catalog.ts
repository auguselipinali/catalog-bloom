import { queryOptions } from '@tanstack/react-query';
import { notFound } from '@tanstack/react-router';
import { demoBusiness } from '../data/demo';
import type { Product, PriceOrder } from '../types';
export const formatARS = (price: number) => `$${new Intl.NumberFormat('es-AR', {maximumFractionDigits:0}).format(price)}`;
export const isAvailable = (product: Product) => product.stock > 0;
const normalize = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
export function selectProducts(products: Product[], query: string, category: string, order: PriceOrder) {
 const result = products.filter(p => (category === 'all' || p.categoryId === category) && normalize(p.name).includes(normalize(query)));
 if (order !== 'default') result.sort((a,b) => order === 'asc' ? a.price-b.price : b.price-a.price);
 return result;
}
// Replace this read adapter with a database query when persistence is introduced.
export const catalogQuery = (slug: string) => queryOptions({queryKey:['public-catalog',slug], queryFn: async () => {
 if (slug !== demoBusiness.slug) throw notFound();
 return demoBusiness;
}, staleTime: Infinity});
export function catalogHead(title: string, description: string) { return {meta:[{title},{name:'description',content:description},{property:'og:title',content:title},{property:'og:description',content:description},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}; }
