import { describe, expect, it } from "vitest";
import { readableOn } from "./contrast";

describe("readableOn", () => {
  it("uses white text on a dark brand color", () => expect(readableOn("#1e3a8a")).toBe("#ffffff"));
  it("uses dark text on a light brand color", () => expect(readableOn("#fde047")).toBe("#14161f"));
  it("ignores invalid colors", () => expect(readableOn("red")).toBeNull());
});
