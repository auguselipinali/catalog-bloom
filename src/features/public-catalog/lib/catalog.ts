import { queryOptions } from "@tanstack/react-query";
import { notFound } from "@tanstack/react-router";
import { demoBusiness } from "../data/demo";
import { parseBusiness } from "./api";
import type { Product, PriceOrder } from "../types";
export const formatARS = (price: number) =>
  `$${new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 }).format(price)}`;
export const isAvailable = (product: Product) => product.stock > 0;
const normalize = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
export function selectProducts(
  products: Product[],
  query: string,
  category: string,
  order: PriceOrder,
) {
  const result = products.filter(
    (p) =>
      (category === "all" || p.categoryId === category) &&
      normalize(p.name).includes(normalize(query)),
  );
  if (order !== "default")
    result.sort((a, b) => (order === "asc" ? a.price - b.price : b.price - a.price));
  return result;
}
export const catalogUrl = (apiUrl: string, slug: string) =>
  `${apiUrl.replace(/\/+$/, "")}/${encodeURIComponent(slug)}/catalog`;
async function fetchCatalog(slug: string) {
  const apiUrl = import.meta.env["VITE_API_URL"] as string | undefined;
  if (!apiUrl) {
    if (slug !== demoBusiness.slug) throw notFound();
    return demoBusiness;
  }
  const res = await fetch(catalogUrl(apiUrl, slug));
  if (res.status === 404) throw notFound();
  if (!res.ok) throw new Error(`No se pudo cargar el catálogo (${res.status})`);
  return parseBusiness(await res.json());
}
export const catalogQuery = (slug: string) =>
  queryOptions({
    queryKey: ["public-catalog", slug],
    queryFn: () => fetchCatalog(slug),
    staleTime: 60_000,
  });
export function catalogHead(title: string, description: string, image?: string) {
  const meta: Record<string, string>[] = [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ];
  if (image)
    meta.push({ property: "og:image", content: image }, { name: "twitter:image", content: image });
  return { meta };
}
