import { Link } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Business } from "../types";
import { useState } from "react";
import { useCart } from "../hooks/use-cart";
import { CartDrawer } from "./cart-drawer";
export function CatalogHeader({ business }: { business: Business }) {
  const cart = useCart(business);
  const [open, setOpen] = useState(false);
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
          <div className="brand-mark shrink-0">L</div>
          <div className="min-w-0">
            <p className="brand-name truncate">{business.name}</p>
            <p className="brand-tagline">{business.tagline}</p>
          </div>
        </Link>
        <Button
          variant="cart"
          size="icon"
          key={cart.revision}
          className={`shrink-0 cart-trigger ${cart.revision > 0 ? 'cart-bump' : ''}`}
          aria-label={`Abrir carrito, ${cart.count} productos`}
          title="Abrir carrito"
          onClick={() => setOpen(true)}
        >
          <ShoppingCart size={19} />
          {cart.count > 0 && <span className="cart-counter" aria-live="polite">{cart.count}</span>}
        </Button>
      </div>
    </header>
    <CartDrawer business={business} open={open} onOpenChange={setOpen}/>
    </>
  );
}
