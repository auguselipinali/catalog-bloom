import { createFileRoute } from "@tanstack/react-router";
import { CatalogPage } from "@/features/public-catalog/components/catalog-page";
import {
  CatalogSkeleton,
  CatalogNotFound,
} from "@/features/public-catalog/components/catalog-states";
import { catalogQuery, catalogHead } from "@/features/public-catalog/lib/catalog";
import { absoluteUrl, currentOrigin } from "@/features/public-catalog/lib/origin.functions";
export const Route = createFileRoute("/c/$slug/")({
  loader: async ({ context, params }) => {
    const business = await context.queryClient.ensureQueryData(catalogQuery(params.slug));
    const origin = await currentOrigin();
    const image = absoluteUrl(business.logoUrl ?? business.products[0]?.images[0], origin);
    return {
      name: business.name,
      description: `Catálogo de ${business.name}${business.tagline ? ` · ${business.tagline}` : ""}: ${business.categories.map((c) => c.name).join(", ")}.`,
      image,
    };
  },
  head: ({ loaderData }) =>
    loaderData
      ? catalogHead(`${loaderData.name} · Catálogo`, loaderData.description, loaderData.image)
      : catalogHead("Catálogo no disponible", "Este catálogo no está disponible."),
  pendingComponent: CatalogSkeleton,
  notFoundComponent: CatalogNotFound,
  component: PublicCatalog,
});
function PublicCatalog() {
  const { slug } = Route.useParams();
  return <CatalogPage slug={slug} />;
}
