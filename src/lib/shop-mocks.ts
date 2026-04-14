export type CatalogArtwork = {
  id: string;
  title: string;
  artist: string;
  style: string;
  technique: string;
  dimensions: string;
  image: string;
  priceCents: number;
  shippingCents: number;
  stock: number;
  likes: number;
  available: boolean;
};

export type CartItem = {
  id: string;
  artworkId: string;
  quantity: number;
};

export type OrderStatus = "en_attente" | "payee" | "en_preparation" | "expediee" | "livree";

export type ArtistOrder = {
  id: string;
  buyer: string;
  paymentMethod: "Stripe" | "Mobile Money";
  totalCents: number;
  status: OrderStatus;
  createdAt: string;
  items: Array<{ title: string; quantity: number }>;
};

export type PurchaseHistory = {
  id: string;
  artist: string;
  totalCents: number;
  status: "livree" | "en_cours" | "remboursee";
  paymentMethod: "Stripe" | "Mobile Money";
  purchasedAt: string;
};

export type DisputeItem = {
  id: string;
  orderId: string;
  reason: string;
  stage: "ouvert" | "en_analyse" | "resolu";
  requestedRefundCents: number;
  lastUpdate: string;
};

export type ListingItem = {
  id: string;
  title: string;
  status: "publiee" | "brouillon" | "archivee";
  inSale: boolean;
  priceCents: number;
  shippingCents: number;
  updatedAt: string;
};

export const boutiqueKpis = [
  { label: "Oeuvres en vente", value: "24" },
  { label: "Panier moyen", value: "186 500 XAF" },
  { label: "Commandes ce mois", value: "42" },
  { label: "Taux de conversion", value: "3,7%" },
];

export const catalog: CatalogArtwork[] = [
  {
    id: "art-001",
    title: "Braises Matinales",
    artist: "Aisha Diallo",
    style: "Abstrait",
    technique: "Acrylique",
    dimensions: "80 x 60 cm",
    image: "/images/placeholder.png",
    priceCents: 280000,
    shippingCents: 18000,
    stock: 1,
    likes: 284,
    available: true,
  },
  {
    id: "art-002",
    title: "Silence Urbain",
    artist: "Marc Legrand",
    style: "Minimalisme",
    technique: "Huile sur toile",
    dimensions: "120 x 90 cm",
    image: "/images/placeholder.png",
    priceCents: 420000,
    shippingCents: 22000,
    stock: 1,
    likes: 161,
    available: true,
  },
  {
    id: "art-003",
    title: "Maree d'Ocre",
    artist: "Studio Lumiere",
    style: "Contemporain",
    technique: "Mix media",
    dimensions: "100 x 100 cm",
    image: "/images/placeholder.png",
    priceCents: 360000,
    shippingCents: 24000,
    stock: 2,
    likes: 198,
    available: true,
  },
  {
    id: "art-004",
    title: "Clair de Terre",
    artist: "Elena Rostova",
    style: "Expressionnisme",
    technique: "Pastel sec",
    dimensions: "70 x 50 cm",
    image: "/images/placeholder.png",
    priceCents: 195000,
    shippingCents: 15000,
    stock: 0,
    likes: 312,
    available: false,
  },
];

export const cart: CartItem[] = [
  { id: "cart-001", artworkId: "art-001", quantity: 1 },
  { id: "cart-002", artworkId: "art-003", quantity: 1 },
];

export const artistOrders: ArtistOrder[] = [
  {
    id: "YWP-2026-0012",
    buyer: "Nadia Essomba",
    paymentMethod: "Mobile Money",
    totalCents: 304000,
    status: "en_preparation",
    createdAt: "2026-04-11",
    items: [{ title: "Braises Matinales", quantity: 1 }],
  },
  {
    id: "YWP-2026-0011",
    buyer: "Leo Mpondo",
    paymentMethod: "Stripe",
    totalCents: 444000,
    status: "expediee",
    createdAt: "2026-04-09",
    items: [{ title: "Silence Urbain", quantity: 1 }],
  },
  {
    id: "YWP-2026-0009",
    buyer: "Maya Nkanza",
    paymentMethod: "Stripe",
    totalCents: 384000,
    status: "livree",
    createdAt: "2026-04-04",
    items: [{ title: "Maree d'Ocre", quantity: 1 }],
  },
];

export const purchases: PurchaseHistory[] = [
  {
    id: "YWP-2026-0008",
    artist: "Aisha Diallo",
    totalCents: 304000,
    status: "en_cours",
    paymentMethod: "Mobile Money",
    purchasedAt: "2026-04-08",
  },
  {
    id: "YWP-2026-0006",
    artist: "Marc Legrand",
    totalCents: 444000,
    status: "livree",
    paymentMethod: "Stripe",
    purchasedAt: "2026-03-25",
  },
  {
    id: "YWP-2026-0003",
    artist: "Studio Lumiere",
    totalCents: 384000,
    status: "remboursee",
    paymentMethod: "Stripe",
    purchasedAt: "2026-03-12",
  },
];

export const disputes: DisputeItem[] = [
  {
    id: "DSP-001",
    orderId: "YWP-2026-0003",
    reason: "Cadre endommage a la reception",
    stage: "en_analyse",
    requestedRefundCents: 384000,
    lastUpdate: "2026-04-12",
  },
  {
    id: "DSP-0008",
    orderId: "YWP-2026-0001",
    reason: "Colis non recu dans le delai annonce",
    stage: "resolu",
    requestedRefundCents: 192000,
    lastUpdate: "2026-04-02",
  },
];

export const artistListings: ListingItem[] = [
  {
    id: "art-001",
    title: "Braises Matinales",
    status: "publiee",
    inSale: true,
    priceCents: 280000,
    shippingCents: 18000,
    updatedAt: "2026-04-13",
  },
  {
    id: "art-002",
    title: "Silence Urbain",
    status: "publiee",
    inSale: true,
    priceCents: 420000,
    shippingCents: 22000,
    updatedAt: "2026-04-10",
  },
  {
    id: "art-005",
    title: "Poussiere d'Orage",
    status: "brouillon",
    inSale: false,
    priceCents: 160000,
    shippingCents: 12000,
    updatedAt: "2026-04-14",
  },
];

export const currency = (amountCents: number) =>
  `${new Intl.NumberFormat("fr-FR").format(amountCents)} XAF`;

export const orderStatusLabel: Record<OrderStatus, string> = {
  en_attente: "En attente",
  payee: "Payee",
  en_preparation: "En preparation",
  expediee: "Expediee",
  livree: "Livree",
};
