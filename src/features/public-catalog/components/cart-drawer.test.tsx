import { fireEvent, render, screen, waitFor, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { demoBusiness } from "../data/demo";
import { cartStorageKey, orderPendingKey } from "../lib/cart";
import { CartDrawer } from "./cart-drawer";

const assign = vi.fn();
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  assign.mockReset();
  localStorage.clear();
});
function mockLocation() {
  vi.spyOn(window, "location", "get").mockReturnValue({
    ...window.location,
    assign,
  } as unknown as Location);
}
async function fillName() {
  await waitFor(() => expect(screen.getByLabelText("Tu nombre *")).toBeInTheDocument());
  fireEvent.change(screen.getByLabelText("Tu nombre *"), { target: { value: "Ana" } });
}

describe("WhatsApp handoff", () => {
  it("renders older tenant data without WhatsApp and prevents sending", async () => {
    const business = { ...demoBusiness, slug: "missing-whatsapp" };
    Reflect.deleteProperty(business, "whatsappNumber");
    localStorage.setItem(cartStorageKey(business.slug), JSON.stringify([{ productId: "2", quantity: 1 }]));
    render(<CartDrawer business={business} open onOpenChange={() => {}} />);
    await fillName();
    expect(screen.getByRole("button", { name: "Enviar pedido por WhatsApp" })).toBeDisabled();
  });

  it("navigates to wa.me, keeps the cart and stores a pending flag", async () => {
    mockLocation();
    const open = vi.spyOn(window, "open");
    const business = { ...demoBusiness, slug: "handoff", whatsappNumber: "5492641234567" };
    localStorage.setItem(cartStorageKey(business.slug), JSON.stringify([{ productId: "2", quantity: 2 }]));
    render(<CartDrawer business={business} open onOpenChange={() => {}} />);
    await fillName();
    fireEvent.change(screen.getByLabelText(/Nota/), { target: { value: "retiro por local" } });
    fireEvent.click(screen.getByRole("button", { name: "Enviar pedido por WhatsApp" }));
    expect(open).not.toHaveBeenCalled();
    expect(assign).toHaveBeenCalledTimes(1);
    const url = assign.mock.calls[0]![0] as string;
    expect(url).toContain("https://wa.me/5492641234567?text=");
    expect(decodeURIComponent(url)).toContain("Total: $25.000");
    expect(JSON.parse(localStorage.getItem(cartStorageKey(business.slug))!)).toEqual([
      { productId: "2", quantity: 2 },
    ]);
    expect(localStorage.getItem(orderPendingKey(business.slug))).not.toBeNull();
  });

  it("asks on return and clears the cart when confirmed", async () => {
    const business = { ...demoBusiness, slug: "return-yes" };
    localStorage.setItem(cartStorageKey(business.slug), JSON.stringify([{ productId: "2", quantity: 1 }]));
    localStorage.setItem(orderPendingKey(business.slug), "x");
    render(<CartDrawer business={business} open onOpenChange={() => {}} />);
    await waitFor(() => expect(screen.getByText("¿Se envió tu pedido?")).toBeInTheDocument());
    fireEvent.click(screen.getByRole("button", { name: "Sí, vaciar carrito" }));
    expect(localStorage.getItem(cartStorageKey(business.slug))).toBe("[]");
    expect(localStorage.getItem(orderPendingKey(business.slug))).toBeNull();
  });

  it("keeps products when the customer chooses to", async () => {
    const business = { ...demoBusiness, slug: "return-keep" };
    localStorage.setItem(cartStorageKey(business.slug), JSON.stringify([{ productId: "2", quantity: 1 }]));
    localStorage.setItem(orderPendingKey(business.slug), "x");
    render(<CartDrawer business={business} open onOpenChange={() => {}} />);
    await waitFor(() => expect(screen.getByText("¿Se envió tu pedido?")).toBeInTheDocument());
    fireEvent.click(screen.getByRole("button", { name: "Mantener productos" }));
    expect(JSON.parse(localStorage.getItem(cartStorageKey(business.slug))!)).toEqual([
      { productId: "2", quantity: 1 },
    ]);
    expect(localStorage.getItem(orderPendingKey(business.slug))).toBeNull();
    expect(screen.getByLabelText("Tu nombre *")).toBeInTheDocument();
  });

  it("shows the real error message when navigation fails", async () => {
    vi.spyOn(window, "location", "get").mockReturnValue({
      assign: () => {
        throw new Error("Navegación bloqueada");
      },
    } as unknown as Location);
    const business = { ...demoBusiness, slug: "nav-error", whatsappNumber: "5492641234567" };
    localStorage.setItem(cartStorageKey(business.slug), JSON.stringify([{ productId: "2", quantity: 1 }]));
    render(<CartDrawer business={business} open onOpenChange={() => {}} />);
    await fillName();
    fireEvent.click(screen.getByRole("button", { name: "Enviar pedido por WhatsApp" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Navegación bloqueada");
    expect(localStorage.getItem(orderPendingKey(business.slug))).toBeNull();
  });
});
