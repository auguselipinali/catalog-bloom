import { describe, expect, it } from "vitest";
import { isHexColor, parseBusiness } from "./api";
import { catalogQuery } from "./catalog";

const payload = {
  slug: "tienda",
  name: "Tienda",
  brandColor: "#ff0066",
  plan: { name: "pro", limits: { maxProducts: 50 }, features: { exportXlsx: true } },
  categories: [{ id: 1, name: "Uno" }],
  products: [{ id: 7, slug: "a", name: "A", categoryId: 1, price: 100, stock: 2, size: null }],
};

describe("catalog API mapping", () => {
  it("maps a valid payload to Business and omits a missing size", () => {
    const b = parseBusiness(payload);
    expect(b.plan.limits?.maxProducts).toBe(50);
    expect(b.products[0]?.id).toBe("7");
    expect(b.products[0]).not.toHaveProperty("size");
  });
  it("rejects an invalid payload", () => {
    expect(() => parseBusiness({ ...payload, products: [{ id: 1 }] })).toThrow();
  });
  it("accepts only hex brand colors", () => {
    expect(isHexColor("#8069fe")).toBe(true);
    expect(isHexColor("red")).toBe(false);
  });
  it("keeps catalog data fresh for 60 seconds", () => {
    expect(catalogQuery("lumina").staleTime).toBe(60_000);
  });
});
