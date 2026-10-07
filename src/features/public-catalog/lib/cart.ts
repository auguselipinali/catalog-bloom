import type { Business, Product } from "../types";
import { formatARS } from "./catalog";
export interface CartEntry {
  productId: string;
  quantity: number;
}
export interface CartLine extends CartEntry {
  product: Product;
  subtotal: number;
}
export const cartStorageKey = (slug: string) => `catalog-cart:${slug}`;
export function normalizeCart(raw: unknown, products: Product[]): CartEntry[] {
  if (!Array.isArray(raw)) return [];
  const quantities = new Map<string, number>();
  for (const entry of raw) {
    if (
      !entry ||
      typeof entry !== "object" ||
      typeof entry.productId !== "string" ||
      typeof entry.quantity !== "number" ||
      !Number.isFinite(entry.quantity) ||
      entry.quantity <= 0
    )
      continue;
    const product = products.find((p) => p.id === entry.productId);
    if (!product || product.stock <= 0) continue;
    const quantity = Math.min(
      Math.floor(product.stock),
      (quantities.get(product.id) ?? 0) + Math.floor(entry.quantity),
    );
    if (quantity > 0) quantities.set(product.id, quantity);
  }
  return Array.from(quantities, ([productId, quantity]) => ({ productId, quantity }));
}
export function setCartQuantity(
  entries: CartEntry[],
  products: Product[],
  productId: string,
  quantity: number,
) {
  return normalizeCart(
    [...entries.filter((e) => e.productId !== productId), { productId, quantity }],
    products,
  );
}
export function cartLines(entries: CartEntry[], products: Product[]): CartLine[] {
  return normalizeCart(entries, products).flatMap((entry) => {
    const product = products.find((p) => p.id === entry.productId);
    return product ? [{ ...entry, product, subtotal: entry.quantity * product.price }] : [];
  });
}
export function whatsappNumber(raw: unknown) {
  // Cached tenant data and older configurations may omit this field.
  if (typeof raw !== "string") return null;
  const digits = raw.replace(/[\s+()-]/g, "");
  if (!/^[1-9]\d{9,14}$/.test(digits) || (digits.startsWith("549") && digits.length !== 13))
    return null;
  return digits;
}
export function orderMessage(business: Business, entries: CartEntry[], name: string, note: string) {
  const customer = name.trim();
  if (!customer) throw new Error("Ingresá tu nombre.");
  const lines = cartLines(entries, business.products);
  if (!lines.length) throw new Error("El carrito está vacío.");
  const total = lines.reduce((sum, line) => sum + line.subtotal, 0);
  return [
    `Hola! Quiero hacer un pedido en ${business.name}:`,
    "",
    ...lines.map(
      (line) => `• ${line.quantity}x ${line.product.name} — ${formatARS(line.subtotal)}`,
    ),
    "",
    `Total: ${formatARS(total)}`,
    `Nombre: ${customer}`,
    ...(note.trim() ? [`Nota: ${note.trim()}`] : []),
  ].join("\n");
}
export function whatsappOrderUrl(
  business: Business,
  entries: CartEntry[],
  name: string,
  note: string,
) {
  const number = whatsappNumber(business.whatsappNumber);
  if (!number) throw new Error("El negocio todavía no tiene un número de WhatsApp completo.");
  return `https://wa.me/${number}?text=${encodeURIComponent(orderMessage(business, entries, name, note))}`;
}
