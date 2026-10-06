import { createFileRoute, notFound } from "@tanstack/react-router";
import { ProductDetail } from "@/features/public-catalog/components/product-detail";
import {
  CatalogSkeleton,
  CatalogNotFound,
} from "@/features/public-catalog/components/catalog-states";
import { catalogQuery, catalogHead } from "@/features/public-catalog/lib/catalog";
export const Route = createFileRoute("/c/$slug/p/$productSlug")({
  loader: async ({ context, params }) => {
    const business = await context.queryClient.ensureQueryData(catalogQuery(params.slug));
    const product = business.products.find((p) => p.slug === params.productSlug);
    if (!product) throw notFound();
    return { business, product };
  },
  head: ({ loaderData }) =>
    catalogHead(
      loaderData
        ? `${loaderData.product.name} · ${loaderData.business.name}`
        : "Producto no disponible · Lumina",
      loaderData?.product.description ?? "Este producto no está disponible.",
    ),
  pendingComponent: CatalogSkeleton,
  notFoundComponent: CatalogNotFound,
  component: PublicProduct,
});
function PublicProduct() {
  const { slug, productSlug } = Route.useParams();
  return <ProductDetail key={productSlug} slug={slug} productSlug={productSlug} />;
}
