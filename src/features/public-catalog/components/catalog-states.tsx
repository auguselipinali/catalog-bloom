import { SearchX, ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
export function CatalogSkeleton() {
  return (
    <main className="catalog-container py-6" aria-busy="true" aria-label="Cargando catálogo">
      <div className="skeleton h-12 rounded-2xl mb-5" />
      <div className="flex gap-2 mb-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton h-9 w-20 rounded-full" />
        ))}
      </div>
      <div className="product-grid">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div className="product-card" key={i}>
            <div className="skeleton aspect-square" />
            <div className="p-4 space-y-3">
              <div className="skeleton h-4 w-3/4 rounded" />
              <div className="skeleton h-4 w-1/2 rounded" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
export function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <SearchX size={24} />
      </div>
      <h2>No encontramos productos</h2>
      <p>Probá con otra búsqueda o categoría.</p>
      <Button variant="catalogOutline" onClick={onReset}>
        Limpiar filtros
      </Button>
    </div>
  );
}
export function CatalogNotFound() {
  return (
    <main className="not-found">
      <div className="brand-mark">L</div>
      <p className="error-number">404</p>
      <h1>No encontramos esta página</h1>
      <p>El catálogo o producto que buscás no está disponible.</p>
      <Button variant="catalog" asChild>
        <Link to="/c/$slug" params={{ slug: "lumina" }}>
          <ArrowLeft />
          Volver al catálogo
        </Link>
      </Button>
    </main>
  );
}
