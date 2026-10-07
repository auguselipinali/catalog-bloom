import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatARS, isAvailable } from "../lib/catalog";
import type { Product } from "../types";
import { useSuspenseQuery } from "@tanstack/react-query";
import { catalogQuery } from "../lib/catalog";
import { useCart } from "../hooks/use-cart";
export function ProductCard({
  product,
  slug,
  featured = false,
  category,
}: {
  product: Product;
  slug: string;
  featured?: boolean;
  category?: string | undefined;
}) {
  const available = isAvailable(product);
  const { data: business } = useSuspenseQuery(catalogQuery(slug));
  const cart = useCart(business);
  const atLimit = cart.quantityFor(product.id) >= product.stock;
  return (
    <article className={cn("product-card rise", featured && "product-featured")}>
      <Link
        to="/c/$slug/p/$productSlug"
        params={{ slug, productSlug: product.slug }}
        className="product-image-link"
        aria-label={`Ver ${product.name}`}
      >
        <img
          src={product.images[0]}
          alt={product.name}
          width={640}
          height={featured ? 900 : 640}
          loading={featured ? "eager" : "lazy"}
          className="product-image"
        />
        {!available && <span className="stock-badge">Sin stock</span>}
      </Link>
      <div className="product-info">
        {featured && <span className="category-badge">{category}</span>}
        <Link to="/c/$slug/p/$productSlug" params={{ slug, productSlug: product.slug }}>
          <h2>{product.name}</h2>
        </Link>
        <p className="product-size">{product.size}</p>
        <div className="product-actions">
          <p className={cn("product-price", !available && "text-muted-foreground")}>
            {formatARS(product.price)}
          </p>
          <Button
            variant="catalog"
            size="sm"
            disabled={!available || !cart.ready || atLimit}
            aria-label={`Agregar ${product.name}`}
            title={
              !available
                ? "Sin stock"
                : atLimit
                  ? "Stock máximo en el carrito"
                  : "Agregar al carrito"
            }
            onClick={() => cart.add(product.id)}
          >
            Agregar
          </Button>
        </div>
      </div>
    </article>
  );
}
