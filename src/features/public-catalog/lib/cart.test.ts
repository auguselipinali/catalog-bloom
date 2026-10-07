import { describe, it, expect } from "vitest";
import { demoBusiness } from "../data/demo";
import {
  cartStorageKey,
  normalizeCart,
  setCartQuantity,
  cartLines,
  orderMessage,
  whatsappOrderUrl,
  whatsappNumber,
} from "./cart";
describe("cart rules", () => {
  it("safely rejects missing or malformed tenant WhatsApp values", () => {
    for (const value of [undefined, null, 5492641234567, {}, ""]) {
      expect(whatsappNumber(value)).toBeNull();
    }
  });
  it("isolates persisted carts by slug", () => {
    expect(cartStorageKey("lumina")).toBe("catalog-cart:lumina");
    expect(cartStorageKey("otro")).not.toBe(cartStorageKey("lumina"));
  });
  it("never exceeds stock including duplicated saved items", () =>
    expect(
      normalizeCart(
        [
          { productId: "1", quantity: 10 },
          { productId: "1", quantity: 10 },
        ],
        demoBusiness.products,
      ),
    ).toEqual([{ productId: "1", quantity: 15 }]));
  it("removes unknown and unavailable items and invalid quantities", () =>
    expect(
      normalizeCart(
        [
          { productId: "unknown", quantity: 2 },
          { productId: "3", quantity: 1 },
          { productId: "1", quantity: -1 },
          { productId: "2", quantity: NaN },
        ],
        demoBusiness.products,
      ),
    ).toEqual([]));
  it("updates quantity and removes a zero quantity", () => {
    expect(setCartQuantity([], demoBusiness.products, "2", 99)).toEqual([
      { productId: "2", quantity: 22 },
    ]);
    expect(
      setCartQuantity([{ productId: "2", quantity: 2 }], demoBusiness.products, "2", 0),
    ).toEqual([]);
  });
  it("computes item subtotal using quantity", () =>
    expect(cartLines([{ productId: "2", quantity: 2 }], demoBusiness.products)[0]?.subtotal).toBe(
      25000,
    ));
  it("requires a nonblank customer name", () =>
    expect(() =>
      orderMessage(demoBusiness, [{ productId: "2", quantity: 2 }], "  ", ""),
    ).toThrow());
  it("matches the requested message with optional note", () => {
    const business = {
      ...demoBusiness,
      products: demoBusiness.products.map((p) =>
        p.id === "1"
          ? { ...p, name: "Producto B", price: 8500 }
          : p.id === "2"
            ? { ...p, name: "Producto A" }
            : p,
      ),
    };
    expect(
      orderMessage(
        business,
        [
          { productId: "2", quantity: 2 },
          { productId: "1", quantity: 1 },
        ],
        " Ana ",
        "retiro por local",
      ),
    ).toBe(
      "Hola! Quiero hacer un pedido en Lumina:\n\n• 2x Producto A — $25.000\n• 1x Producto B — $8.500\n\nTotal: $33.500\nNombre: Ana\nNota: retiro por local",
    );
  });
  it("omits an empty optional note", () =>
    expect(
      orderMessage(demoBusiness, [{ productId: "2", quantity: 1 }], "Ana", "  "),
    ).not.toContain("Nota:"));
  it("encodes the entire message and reads destination from business config", () => {
    const business = { ...demoBusiness, whatsappNumber: "+54 9 264 123 4567" };
    const entries = [{ productId: "2", quantity: 2 }];
    expect(whatsappOrderUrl(business, entries, "Ana & Sol", "retiro #1")).toBe(
      "https://wa.me/5492641234567?text=" +
        encodeURIComponent(orderMessage(business, entries, "Ana & Sol", "retiro #1")),
    );
  });
  it("blocks the incomplete number supplied by the user", () => {
    expect(whatsappNumber("+54 9 264")).toBeNull();
    expect(() =>
      whatsappOrderUrl(demoBusiness, [{ productId: "2", quantity: 1 }], "Ana", ""),
    ).toThrow();
  });
});
