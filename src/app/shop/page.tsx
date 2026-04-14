import Image from "next/image";
import Link from "next/link";
import ShopModuleNav from "@/components/shop/ShopModuleNav";
import { boutiqueKpis, catalog, currency } from "@/lib/shop-mocks";

export default function ShopIndexPage() {
  return (
    <div className="mx-auto w-full max-w-[1400px]">
      <section className="reveal relative overflow-hidden rounded-[2rem] border border-foreground/10 bg-gradient-to-br from-accent/15 via-background to-background p-8 md:p-12">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
        <p className="mb-4 text-xs uppercase tracking-[0.4em] text-accent">Module Boutique</p>
        <h1 className="font-serif text-4xl leading-tight md:text-6xl">
          Vendre des oeuvres avec une experience simple, premium et fiable.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-foreground/70">
          Cette vitrine illustre SHOP-03 avec un catalogue public, des filtres, des prix + frais de port,
          puis la transition vers panier et paiement securise.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/shop/cart" className="rounded-full bg-accent px-6 py-3 text-xs uppercase tracking-[0.3em] text-white">
            Aller au panier
          </Link>
          <Link href="/artist/shop/listings" className="rounded-full border border-foreground/20 px-6 py-3 text-xs uppercase tracking-[0.3em]">
            Espace artiste
          </Link>
        </div>
      </section>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {boutiqueKpis.map((kpi) => (
          <article key={kpi.label} className="rounded-2xl border border-foreground/10 bg-background/70 p-5 backdrop-blur">
            <p className="text-[11px] uppercase tracking-[0.3em] text-foreground/40">{kpi.label}</p>
            <p className="mt-2 font-serif text-3xl">{kpi.value}</p>
          </article>
        ))}
      </div>

      <div className="mt-10">
        <ShopModuleNav />
      </div>

      <section className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {catalog.map((art) => (
          <article key={art.id} className="group overflow-hidden rounded-3xl border border-foreground/10 bg-background/80">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image src={art.image} alt={art.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <span className="absolute left-4 top-4 rounded-full bg-background/85 px-3 py-1 text-[11px] uppercase tracking-[0.2em]">
                {art.style}
              </span>
              {!art.available && (
                <span className="absolute right-4 top-4 rounded-full bg-foreground px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-background">
                  Rupture
                </span>
              )}
            </div>
            <div className="space-y-3 p-5">
              <div>
                <h2 className="font-serif text-2xl">{art.title}</h2>
                <p className="text-sm text-foreground/60">
                  {art.artist} - {art.technique} - {art.dimensions}
                </p>
              </div>
              <div className="text-sm text-foreground/60">
                <p>Prix: {currency(art.priceCents)}</p>
                <p>Livraison: {currency(art.shippingCents)}</p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.2em] text-foreground/45">{art.likes} likes</span>
                <button
                  type="button"
                  disabled={!art.available}
                  className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.2em] ${
                    art.available
                      ? "bg-accent text-white hover:opacity-90"
                      : "cursor-not-allowed border border-foreground/15 text-foreground/40"
                  }`}
                >
                  Ajouter
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
