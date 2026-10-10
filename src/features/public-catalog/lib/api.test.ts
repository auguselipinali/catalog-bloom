import { describe, expect, it } from "vitest";
import { isHexColor, parseBusiness } from "./api";
import { catalogQuery, catalogUrl } from "./catalog";

const catId = "3f1c2a9e-1b2c-4d5e-8f90-123456789abc";
const prodId = "9a8b7c6d-5e4f-4a3b-9c2d-1e0f9a8b7c6d";
const payload = {
  id: "11111111-2222-4333-8444-555555555555",
  slug: "tienda",
  name: "Tienda",
  brandColor: "#ff0066",
  plan: { name: "pro", limits: { maxProducts: 50 }, features: { exportXlsx: true } },
  categories: [{ id: catId, name: "Uno" }],
  products: [{ id: prodId, slug: "a", name: "A", categoryId: catId, price: 100, stock: 2, size: null }],
};

describe("catalog API mapping", () => {
  it("maps a valid payload to Business and omits a missing size", () => {
    const b = parseBusiness(payload);
    expect(b.plan.limits?.maxProducts).toBe(50);
    expect(b.products[0]?.id).toBe(prodId);
    expect(b.products[0]?.categoryId).toBe(catId);
    expect(b.products[0]).not.toHaveProperty("size");
  });
  it("tolerates null or missing optional business and product fields", () => {
    const b = parseBusiness({
      ...payload,
      tagline: null,
      whatsappNumber: null,
      logoUrl: null,
      brandColor: null,
      products: [
        { id: prodId, slug: "a", name: "A", categoryId: catId, price: 1, stock: 1, description: null, featured: null },
      ],
    });
    expect(b.tagline).toBe("");
    expect(b.whatsappNumber).toBe("");
    expect(b.brandColor).toBe("");
    expect(b).not.toHaveProperty("logoUrl");
    expect(b.products[0]?.images).toEqual([]);
    expect(b.products[0]?.description).toBe("");
    expect(b.products[0]).not.toHaveProperty("featured");
  });
  it("rejects numeric ids", () => {
    expect(() => parseBusiness({ ...payload, categories: [{ id: 1, name: "Uno" }] })).toThrow();
  });
  it("rejects an invalid payload", () => {
    expect(() => parseBusiness({ ...payload, products: [{ id: "x" }] })).toThrow();
  });
  it("builds the catalog URL as {api}/{slug}/catalog", () => {
    expect(catalogUrl("https://api.test/", "lumina")).toBe("https://api.test/lumina/catalog");
  });
  it("accepts only hex brand colors", () => {
    expect(isHexColor("#8069fe")).toBe(true);
    expect(isHexColor("red")).toBe(false);
  });
  it("keeps catalog data fresh for 60 seconds", () => {
    expect(catalogQuery("lumina").staleTime).toBe(60_000);
  });
});
