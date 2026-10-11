import { MessageCircle } from "lucide-react";
import { whatsappNumber } from "../lib/cart";
import type { Business } from "../types";

export function CatalogFooter({ business }: { business: Business }) {
  const number = whatsappNumber(business.whatsappNumber);
  return (
    <footer className="catalog-footer">
      <div className="catalog-container catalog-footer-inner">
        <div>
          <p className="brand-name">{business.name}</p>
          {business.tagline && <p className="text-muted-foreground text-sm">{business.tagline}</p>}
        </div>
        {number && (
          <a
            className="footer-whatsapp"
            href={`https://wa.me/${number}`}
            target="_blank"
            rel="noopener"
          >
            <MessageCircle size={16} aria-hidden="true" />
            Consultanos
          </a>
        )}
      </div>
    </footer>
  );
}
