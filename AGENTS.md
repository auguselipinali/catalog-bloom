<!-- LOVABLE:BEGIN -->

> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

<!-- LOVABLE:END -->

## Architecture

- Keep all public catalog components, types, read adapters and demo data under `src/features/public-catalog`, separate from any future admin area, to preserve tenant isolation boundaries.
- Load tenant catalogs through a shared TanStack Query read adapter; routes validate tenant and product slugs before rendering to prevent cross-catalog access.
- Keep all visual roles in `src/styles.css`; components read the tenant primary only through `--brand-primary`, so they stay theme-independent.
- The root URL redirects to the example catalog; public tenant and product pages live under `/c/$slug` and `/c/$slug/p/$productSlug`.
- Keep reusable cart state in `useCart`, backed by a slug-keyed browser store and hydrated through effects; persist only product IDs and quantities and reconcile against current tenant stock.
- Tenant name and WhatsApp destination belong to the example tenant config; order message construction and phone validation live in pure cart utilities, never UI components.
- Sending navigates to wa.me with `window.location.assign` and never clears the cart; it stores a slug-keyed pending flag, and the drawer asks on reopen whether the order was sent before clearing, since delivery cannot be verified.
- Catalogs come from `${VITE_API_URL}/:slug/catalog` (documented in `.env.example`), validated and mapped to `Business` in `lib/api.ts` with zod; optional fields may be null or absent and ids are opaque strings (UUIDs), never numbers; without `VITE_API_URL` the demo tenant is the fallback, so the app runs without a backend.
- Tenant SEO (title, description, og:image) is derived from loader data only; never hardcode a tenant name in route heads, and resolve og:image to an absolute URL.
- A valid hex `brandColor` overrides `--brand-primary` at runtime on the document root; the stylesheet value is the fallback.
