import { useRef, useState } from "react";
import { Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { catalogQuery, formatARS, isAvailable } from "../lib/catalog";
import { CatalogHeader } from "./catalog-header";
import { useCart } from "../hooks/use-cart";
import { CatalogFooter } from "./catalog-footer";
import { QuantitySelector } from "./quantity-selector";
export function ProductDetail({ slug, productSlug }: { slug: string; productSlug: string }) {
  const { data: business } = useSuspenseQuery(catalogQuery(slug));
  const product = business.products.find((p) => p.slug === productSlug);
  const [active, setActive] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const touchX = useRef<number | null>(null);
  const cart = useCart(business);
  if (!product) throw notFound();
  const remaining = Math.max(0, product.stock - cart.quantityFor(product.id));
  const selectedQuantity = Math.min(quantity, Math.max(1, remaining));
  const multiple = product.images.length > 1;
  const change = (direction: number) => {
    setZoom(null);
    setActive((i) => (i + direction + product.images.length) % product.images.length);
  };
  return (
    <>
      <CatalogHeader business={business} />
      <main className="catalog-container detail-main">
        <Button variant="link" asChild className="mb-5 px-0">
          <Link to="/c/$slug" params={{ slug }}>
            <ArrowLeft />
            Volver al catálogo
          </Link>
        </Button>
        <div className="detail-grid">
          <div className="min-w-0">
            <div
              className="gallery-main"
              onTouchStart={(e) => {
                touchX.current = e.touches[0].clientX;
              }}
              onTouchEnd={(e) => {
                if (!multiple || zoom || touchX.current === null) return;
                const dx = e.changedTouches[0].clientX - touchX.current;
                touchX.current = null;
                if (Math.abs(dx) > 40) change(dx < 0 ? 1 : -1);
              }}
            >
              {multiple ? (
                <button
                  type="button"
                  className={`gallery-zoom ${zoom ? "is-zoomed" : ""}`}
                  aria-label={zoom ? "Quitar zoom" : "Ampliar imagen"}
                  aria-pressed={!!zoom}
                  onClick={(e) => {
                    if (zoom) return setZoom(null);
                    const r = e.currentTarget.getBoundingClientRect();
                    const x = r.width ? ((e.clientX - r.left) / r.width) * 100 : 50;
                    const y = r.height ? ((e.clientY - r.top) / r.height) * 100 : 50;
                    setZoom({ x: e.clientX ? x : 50, y: e.clientY ? y : 50 });
                  }}
                >
                  <img
                    src={product.images[active]}
                    alt={`${product.name}, imagen ${active + 1} de ${product.images.length}`}
                    width={640}
                    height={640}
                    style={zoom ? { transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
                  />
                </button>
              ) : (
                <img
                  src={product.images[active]}
                  alt={`${product.name}, vista ${active + 1}`}
                  width={640}
                  height={640}
                />
              )}
              {!isAvailable(product) && <span className="stock-badge">Sin stock</span>}
              <Button
                variant="cart"
                size="icon"
                className="gallery-prev"
                aria-label="Imagen anterior"
                onClick={() => change(-1)}
              >
                <ChevronLeft />
              </Button>
              <Button
                variant="cart"
                size="icon"
                className="gallery-next"
                aria-label="Imagen siguiente"
                onClick={() => change(1)}
              >
                <ChevronRight />
              </Button>
              <span className="gallery-count">
                {active + 1} / {product.images.length}
              </span>
            </div>
            <div className="gallery-thumbnails">
              {product.images.map((image, i) => (
                <Button
                  key={image}
                  variant="thumbnail"
                  className={active === i ? "thumbnail-active" : ""}
                  aria-label={`Ver imagen ${i + 1}`}
                  aria-pressed={active === i}
                  onClick={() => {
                    setZoom(null);
                    setActive(i);
                  }}
                >
                  <img
                    src={image}
                    alt={`${product.name}, miniatura ${i + 1}`}
                    width={80}
                    height={80}
                    loading="lazy"
                  />
                </Button>
              ))}
            </div>
          </div>
          <div className="detail-info">
            <span className="category-badge">
              {business.categories.find((c) => c.id === product.categoryId)?.name}
            </span>
            <h1>{product.name}</h1>
            {product.size && <p className="text-muted-foreground mt-2">{product.size}</p>}
            <p className="detail-price">{formatARS(product.price)}</p>
            {isAvailable(product) && (
              <div className="detail-quantity">
                <span>Cantidad</span>
                <QuantitySelector
                  value={selectedQuantity}
                  max={remaining}
                  label={product.name}
                  onChange={setQuantity}
                />
                {remaining === 0 && (
                  <p className="text-muted-foreground text-sm">Stock máximo en el carrito.</p>
                )}
              </div>
            )}
            <Button
              variant="catalog"
              size="lg"
              className="w-full sm:w-auto"
              disabled={!isAvailable(product) || !cart.ready || remaining === 0}
              aria-label={`Agregar ${product.name}`}
              title="Agregar al carrito"
              onClick={() => {
                if (cart.add(product.id, selectedQuantity)) setQuantity(1);
              }}
            >
              Agregar
            </Button>
            <div className="detail-description">
              <h2>Descripción</h2>
              <p>{product.description}</p>
            </div>
          </div>
        </div>
      </main>
      <CatalogFooter business={business} />
    </>
  );
}
