import { createFileRoute } from "@tanstack/react-router";
import { CatalogPage } from "@/features/public-catalog/components/catalog-page";
import {
  CatalogSkeleton,
  CatalogNotFound,
} from "@/features/public-catalog/components/catalog-states";
import { catalogQuery, catalogHead } from "@/features/public-catalog/lib/catalog";
export const Route = createFileRoute("/c/$slug/")({
  loader: ({ context, params }) => context.queryClient.ensureQueryData(catalogQuery(params.slug)),
  head: ({ loaderData }) =>
    catalogHead(
      loaderData ? `${loaderData.name} · Catálogo de cosmética` : "Catálogo no disponible · Lumina",
      loaderData
        ? "Descubrí el catálogo de cosmética de Lumina: cuidado del rostro, cuerpo, cabello y labios."
        : "Este catálogo no está disponible.",
    ),
  pendingComponent: CatalogSkeleton,
  notFoundComponent: CatalogNotFound,
  component: PublicCatalog,
});
function PublicCatalog() {
  const { slug } = Route.useParams();
  return <CatalogPage slug={slug} />;
}
