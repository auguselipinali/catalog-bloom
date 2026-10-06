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
- Keep primary branding and all visual roles in `src/styles.css`; configure the tenant primary color with `--brand-primary` so feature components remain theme-independent.
- The root URL redirects to the example catalog; public tenant and product pages live under `/c/$slug` and `/c/$slug/p/$productSlug`.
- Cart and add controls remain non-transactional demo affordances until commerce is explicitly requested.
