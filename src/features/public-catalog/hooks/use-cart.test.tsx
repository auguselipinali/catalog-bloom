import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { demoBusiness } from "../data/demo";
import { useCart } from "./use-cart";
import { cartStorageKey } from "../lib/cart";
describe("useCart", () => {
  it("restores saved quantities, shares updates and clears persisted cart", async () => {
    const business = { ...demoBusiness, slug: "cart-test" };
    localStorage.setItem(
      cartStorageKey(business.slug),
      JSON.stringify([{ productId: "2", quantity: 2 }]),
    );
    const a = renderHook(() => useCart(business));
    const b = renderHook(() => useCart(business));
    await waitFor(() => expect(a.result.current.ready).toBe(true));
    expect(a.result.current.count).toBe(2);
    expect(a.result.current.total).toBe(25000);
    act(() => {
      a.result.current.add("2", 1);
    });
    expect(b.result.current.count).toBe(3);
    act(() => {
      expect(a.result.current.add("2", 22)).toBe(false);
    });
    expect(a.result.current.count).toBe(3);
    act(() => a.result.current.clear());
    expect(b.result.current.count).toBe(0);
    expect(localStorage.getItem(cartStorageKey(business.slug))).toBe("[]");
  });
});
