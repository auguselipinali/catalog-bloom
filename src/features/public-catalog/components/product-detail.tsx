import { useState } from "react";
import { Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { catalogQuery, formatARS, isAvailable } from "../lib/catalog";
import { CatalogHeader } from "./catalog-header";
export function ProductDetail({ slug, productSlug }: { slug: string; productSlug: string }) {
  const { data: business } = useSuspenseQuery(catalogQuery(slug));
  const product = business.products.find((p) => p.slug === productSlug);
  const [active, setActive] = useState(0);
  if (!product) throw notFound();
  const change = (direction: number) =>
    setActive((i) => (i + direction + product.images.length) % product.images.length);
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
            <div className="gallery-main">
              <img
                src={product.images[active]}
                alt={`${product.name}, vista ${active + 1}`}
                width={640}
                height={640}
              />
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
                  onClick={() => setActive(i)}
                >
                  <img src={image} alt="" width={80} height={80} />
                </Button>
              ))}
            </div>
          </div>
          <div className="detail-info">
            <span className="category-badge">
              {business.categories.find((c) => c.id === product.categoryId)?.name}
            </span>
            <h1>{product.name}</h1>
            <p className="text-muted-foreground mt-2">{product.size}</p>
            <p className="detail-price">{formatARS(product.price)}</p>
            <Button
              variant="catalog"
              size="lg"
              className="w-full sm:w-auto"
              disabled={!isAvailable(product)}
              aria-label={`Agregar ${product.name}`}
              title="Carrito próximamente"
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
    </>
  );
}
