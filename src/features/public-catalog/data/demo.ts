import type { Business, Product } from "../types";
import serum from "@/assets/serum.jpg";
import serumDetail from "@/assets/serum-detail.jpg";
import cream from "@/assets/cream.jpg";
import creamDetail from "@/assets/cream-detail.jpg";
import lipstick from "@/assets/lipstick.jpg";
import lipstickDetail from "@/assets/lipstick-detail.jpg";
import cleanser from "@/assets/cleanser.jpg";
import cleanserDetail from "@/assets/cleanser-detail.jpg";
import lotion from "@/assets/lotion.jpg";
import lotionDetail from "@/assets/lotion-detail.jpg";
import scrub from "@/assets/scrub.jpg";
import scrubDetail from "@/assets/scrub-detail.jpg";
import oil from "@/assets/oil.jpg";
import oilDetail from "@/assets/oil-detail.jpg";
import shampoo from "@/assets/shampoo.jpg";
import shampooDetail from "@/assets/shampoo-detail.jpg";
import conditioner from "@/assets/conditioner.jpg";
import conditionerDetail from "@/assets/conditioner-detail.jpg";
import mask from "@/assets/mask.jpg";
import maskDetail from "@/assets/mask-detail.jpg";
import balm from "@/assets/balm.jpg";
import balmDetail from "@/assets/balm-detail.jpg";
import gloss from "@/assets/gloss.jpg";
import glossDetail from "@/assets/gloss-detail.jpg";
const products: Product[] = [
  {
    id: "1",
    slug: "serum-vitamina-c",
    name: "Serum Vitamina C",
    categoryId: "rostro",
    price: 18500,
    stock: 15,
    size: "30 ml",
    images: [serum, serumDetail],
    featured: true,
    description:
      "Un toque de luminosidad para tu rutina diaria. Su textura ligera se absorbe rápidamente y deja la piel suave e hidratada. Aplicá unas gotas sobre el rostro limpio antes de tu crema hidratante.",
  },
  {
    id: "2",
    slug: "crema-hidratante",
    name: "Crema Hidratante",
    categoryId: "rostro",
    price: 12500,
    stock: 22,
    size: "50 ml",
    images: [cream, creamDetail],
    description:
      "Hidratación suave con ácido hialurónico para acompañar tu piel todos los días. Textura fresca, de rápida absorción y sin sensación pesada. Aplicá sobre el rostro limpio por la mañana y por la noche.",
  },
  {
    id: "3",
    slug: "labial-mate",
    name: "Labial Mate",
    categoryId: "labios",
    price: 9800,
    stock: 0,
    size: "tono Nude · 5 ml",
    images: [lipstick, lipstickDetail],
    description:
      "Un nude delicado con acabado mate y textura aterciopelada. Su aplicador permite definir los labios de manera precisa y distribuir el color de forma uniforme.",
  },
  {
    id: "4",
    slug: "gel-limpiador",
    name: "Gel Limpiador",
    categoryId: "rostro",
    price: 8900,
    stock: 18,
    size: "150 ml",
    images: [cleanser, cleanserDetail],
    description:
      "Limpieza fresca y delicada para tu rostro. Retira las impurezas del día sin dejar sensación de tirantez. Masajeá sobre la piel húmeda y enjuagá con agua tibia.",
  },
  {
    id: "5",
    slug: "locion-corporal",
    name: "Loción Corporal",
    categoryId: "cuerpo",
    price: 14200,
    stock: 12,
    size: "250 ml",
    images: [lotion, lotionDetail],
    description:
      "Una loción ligera que aporta suavidad y confort a la piel. Ideal para después de la ducha. Aplicá con movimientos suaves sobre el cuerpo hasta su absorción.",
  },
  {
    id: "6",
    slug: "exfoliante-corporal",
    name: "Exfoliante Corporal",
    categoryId: "cuerpo",
    price: 11900,
    stock: 10,
    size: "200 g",
    images: [scrub, scrubDetail],
    description:
      "Textura cremosa con partículas exfoliantes suaves para renovar tu rutina corporal. Usá sobre la piel húmeda, masajeá sin presionar y enjuagá. Evitá las zonas sensibles.",
  },
  {
    id: "7",
    slug: "aceite-corporal",
    name: "Aceite Corporal",
    categoryId: "cuerpo",
    price: 16800,
    stock: 8,
    size: "100 ml",
    images: [oil, oilDetail],
    description:
      "Un aceite de textura sedosa para nutrir y suavizar la piel. Aplicá unas gotas después del baño sobre la piel ligeramente húmeda y disfrutá de su acabado luminoso.",
  },
  {
    id: "8",
    slug: "shampoo-suave",
    name: "Shampoo Suave",
    categoryId: "cabello",
    price: 10500,
    stock: 20,
    size: "250 ml",
    images: [shampoo, shampooDetail],
    description:
      "Limpieza delicada para el cabello de todos los días. Su espuma suave deja el pelo fresco y liviano. Aplicá sobre el cabello mojado, masajeá y enjuagá.",
  },
  {
    id: "9",
    slug: "acondicionador",
    name: "Acondicionador",
    categoryId: "cabello",
    price: 11200,
    stock: 16,
    size: "250 ml",
    images: [conditioner, conditionerDetail],
    description:
      "Suavidad y desenredo en una textura cremosa. Aplicá de medios a puntas después del shampoo, dejá actuar unos minutos y enjuagá con abundante agua.",
  },
  {
    id: "10",
    slug: "mascara-capilar",
    name: "Máscara Capilar",
    categoryId: "cabello",
    price: 15900,
    stock: 0,
    size: "200 g",
    images: [mask, maskDetail],
    description:
      "Un momento de cuidado intensivo para tu cabello. Su fórmula cremosa ayuda a recuperar suavidad y facilita el peinado. Aplicá de medios a puntas y enjuagá después de cinco minutos.",
  },
  {
    id: "11",
    slug: "balsamo-labial",
    name: "Bálsamo Labial",
    categoryId: "labios",
    price: 6500,
    stock: 25,
    size: "4 g",
    images: [balm, balmDetail],
    description:
      "Un básico para llevar siempre con vos. Su textura suave protege los labios de la resequedad y aporta un acabado natural. Reaplicá cuando lo necesites.",
  },
  {
    id: "12",
    slug: "gloss-rosado",
    name: "Gloss Rosado",
    categoryId: "labios",
    price: 9200,
    stock: 14,
    size: "5 ml",
    images: [gloss, glossDetail],
    description:
      "Brillo delicado y un toque de color rosado para tus labios. Su textura cómoda se puede usar sola o sobre tu labial favorito.",
  },
];
export const demoBusiness: Business = {
  slug: "lumina",
  name: "Lumina",
  tagline: "cosmética",
  // Incomplete number supplied by the owner; sending stays disabled until completed.
  whatsappNumber: "+54 9 264",
  brandColor: "#8069fe",
  plan: { name: "demo", features: { stock: true } },
  categories: [
    { id: "rostro", name: "Rostro" },
    { id: "cuerpo", name: "Cuerpo" },
    { id: "cabello", name: "Cabello" },
    { id: "labios", name: "Labios" },
  ],
  products,
};
