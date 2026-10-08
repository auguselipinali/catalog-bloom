import { createFileRoute, notFound } from "@tanstack/react-router";
import { ProductDetail } from "@/features/public-catalog/components/product-detail";
import {
  CatalogSkeleton,
  CatalogNotFound,
} from "@/features/public-catalog/components/catalog-states";
import { catalogQuery, catalogHead } from "@/features/public-catalog/lib/catalog";
import { absoluteUrl, currentOrigin } from "@/features/public-catalog/lib/origin.functions";
export const Route = createFileRoute("/c/$slug/p/$productSlug")({
  loader: async ({ context, params }) => {
    const business = await context.queryClient.ensureQueryData(catalogQuery(params.slug));
    const product = business.products.find((p) => p.slug === params.productSlug);
    if (!product) throw notFound();
    const origin = await currentOrigin();
    return {
      title: `${product.name} · ${business.name}`,
      description: product.description || `${product.name} en ${business.name}.`,
      image: absoluteUrl(product.images[0] ?? business.logoUrl, origin),
    };
  },
  head: ({ loaderData }) =>
    loaderData
      ? catalogHead(loaderData.title, loaderData.description, loaderData.image)
      : catalogHead("Producto no disponible", "Este producto no está disponible."),
  pendingComponent: CatalogSkeleton,
  notFoundComponent: CatalogNotFound,
  component: PublicProduct,
});
function PublicProduct() {
  const { slug, productSlug } = Route.useParams();
  return <ProductDetail key={productSlug} slug={slug} productSlug={productSlug} />;
}
