import { Link } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Business } from "../types";
import { useEffect, useState } from "react";
import { isHexColor } from "../lib/api";
import { useCart } from "../hooks/use-cart";
import { CartDrawer } from "./cart-drawer";
export function CatalogHeader({ business }: { business: Business }) {
  const cart = useCart(business);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!isHexColor(business.brandColor)) return;
    const root = document.documentElement;
    root.style.setProperty("--brand-primary", business.brandColor);
    return () => {
      root.style.removeProperty("--brand-primary");
    };
  }, [business.brandColor]);
  return (
    <>
      <header className="catalog-header">
        <div className="catalog-container grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 h-18">
          <Link
            to="/c/$slug"
            params={{ slug: business.slug }}
            className="flex min-w-0 items-center gap-3"
            aria-label={`${business.name}, inicio`}
          >
            {business.logoUrl ? (
              <img
                src={business.logoUrl}
                alt=""
                width={40}
                height={40}
                className="brand-mark shrink-0 object-cover"
              />
            ) : (
              <div className="brand-mark shrink-0">{business.name.charAt(0)}</div>
            )}
            <div className="min-w-0">
              <p className="brand-name truncate">{business.name}</p>
              <p className="brand-tagline">{business.tagline}</p>
            </div>
          </Link>
          <Button
            variant="cart"
            size="icon"
            key={cart.revision}
            className={`shrink-0 cart-trigger ${cart.revision > 0 ? "cart-bump" : ""}`}
            aria-label={`Abrir carrito, ${cart.count} productos`}
            title="Abrir carrito"
            onClick={() => setOpen(true)}
          >
            <ShoppingCart size={19} />
            {cart.count > 0 && (
              <span className="cart-counter" aria-live="polite">
                {cart.count}
              </span>
            )}
          </Button>
        </div>
      </header>
      <CartDrawer business={business} open={open} onOpenChange={setOpen} />
    </>
  );
}
