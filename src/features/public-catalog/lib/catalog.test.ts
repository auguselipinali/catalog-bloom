import { describe, expect, it } from "vitest";
import { demoBusiness } from "../data/demo";
import { formatARS, isAvailable, selectProducts } from "./catalog";
describe("public catalog rules", () => {
  it("contains exactly 12 products", () => expect(demoBusiness.products).toHaveLength(12));
  it("contains exactly 4 categories and all products belong to them", () => {
    expect(demoBusiness.categories).toHaveLength(4);
    expect(
      demoBusiness.products.every((p) =>
        demoBusiness.categories.some((c) => c.id === p.categoryId),
      ),
    ).toBe(true);
  });
  it("formats ARS as $12.500", () => expect(formatARS(12500)).toBe("$12.500"));
  it("rejects zero stock and accepts positive stock", () => {
    const product = demoBusiness.products[0];
    if (!product) throw new Error("Missing demo product");
    expect(isAvailable({ ...product, stock: 0 })).toBe(false);
    expect(isAvailable({ ...product, stock: 1 })).toBe(true);
  });
  it("combines category and accent-insensitive search", () => {
    expect(
      selectProducts(demoBusiness.products, "balsamo", "labios", "default").map((p) => p.slug),
    ).toEqual(["balsamo-labial"]);
    expect(selectProducts(demoBusiness.products, "balsamo", "rostro", "default")).toEqual([]);
  });
  it("orders prices in both directions without changing source data", () => {
    const original = demoBusiness.products.map((p) => p.id);
    const asc = selectProducts(demoBusiness.products, "", "all", "asc");
    const desc = selectProducts(demoBusiness.products, "", "all", "desc");
    expect(asc[0]?.price).toBe(6500);
    expect(desc[0]?.price).toBe(18500);
    expect(demoBusiness.products.map((p) => p.id)).toEqual(original);
  });
});
