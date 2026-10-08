import { z } from "zod";
import type { Business } from "../types";

const productSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(String),
  slug: z.string().min(1),
  name: z.string().min(1),
  categoryId: z.union([z.string(), z.number()]).transform(String),
  price: z.number().nonnegative(),
  stock: z.number().int().nonnegative(),
  size: z.string().nullish(),
  description: z.string().default(""),
  images: z.array(z.string()).default([]),
  featured: z.boolean().optional(),
});

export const businessSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  tagline: z.string().default(""),
  whatsappNumber: z.string().default(""),
  logoUrl: z.string().nullish(),
  brandColor: z.string().default(""),
  plan: z
    .object({
      name: z.string(),
      limits: z.object({ maxProducts: z.number().optional() }).optional(),
      features: z
        .object({ stock: z.boolean().optional(), exportXlsx: z.boolean().optional() })
        .optional(),
    })
    .default({ name: "free" }),
  categories: z.array(
    z.object({ id: z.union([z.string(), z.number()]).transform(String), name: z.string() }),
  ),
  products: z.array(productSchema),
});

/** Validates an API catalog payload and maps it to the Business type. */
export function parseBusiness(input: unknown): Business {
  const data = businessSchema.parse(input);
  return {
    slug: data.slug,
    name: data.name,
    tagline: data.tagline,
    whatsappNumber: data.whatsappNumber,
    ...(data.logoUrl ? { logoUrl: data.logoUrl } : {}),
    brandColor: data.brandColor,
    plan: {
      name: data.plan.name,
      ...(data.plan.limits?.maxProducts !== undefined
        ? { limits: { maxProducts: data.plan.limits.maxProducts } }
        : {}),
      ...(data.plan.features
        ? {
            features: Object.fromEntries(
              Object.entries(data.plan.features).filter(([, v]) => v !== undefined),
            ),
          }
        : {}),
    },
    categories: data.categories,
    products: data.products.map(({ size, featured, ...p }) => ({
      ...p,
      ...(size ? { size } : {}),
      ...(featured !== undefined ? { featured } : {}),
    })),
  };
}

export const isHexColor = (value: unknown): value is string =>
  typeof value === "string" && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value);
