import ShopModuleNav from "@/components/shop/ShopModuleNav";
import { artistListings, currency } from "@/lib/shop-mocks";

const statusLabel: Record<(typeof artistListings)[number]["status"], string> = {
  publiee: "Publiee",
  brouillon: "Brouillon",
  archivee: "Archivee",
};

export default function ArtistListingsPage() {
  return (
    <div className="mx-auto w-full max-w-[1400px]">
      <section className="reveal mb-8 rounded-[2rem] border border-foreground/10 bg-background/80 p-8">
        <p className="text-xs uppercase tracking-[0.4em] text-accent">SHOP-01 / SHOP-02</p>
        <h1 className="mt-3 font-serif text-4xl md:text-5xl">Mise en vente des oeuvres</h1>
        <p className="mt-4 max-w-2xl text-foreground/70">
          L&apos;artiste fixe prix et frais de port, active ou retire les oeuvres de la boutique.
        </p>
      </section>

      <ShopModuleNav />

      <section className="space-y-4">
        {artistListings.map((item) => (
          <article key={item.id} className="rounded-3xl border border-foreground/10 bg-background/80 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-serif text-2xl">{item.title}</h2>
              <span className="rounded-full border border-foreground/15 px-3 py-1 text-xs uppercase tracking-[0.2em] text-foreground/55">
                {statusLabel[item.status]}
              </span>
            </div>
            <div className="mt-4 grid gap-3 text-sm text-foreground/70 sm:grid-cols-3">
              <p>Prix: {currency(item.priceCents)}</p>
              <p>Port: {currency(item.shippingCents)}</p>
              <p>Maj: {item.updatedAt}</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {item.inSale ? (
                <>
                  <button type="button" className="rounded-full border border-foreground/20 px-4 py-2 text-xs uppercase tracking-[0.2em]">
                    Modifier tarif
                  </button>
                  <button type="button" className="rounded-full bg-foreground px-4 py-2 text-xs uppercase tracking-[0.2em] text-background">
                    Retirer de la vente
                  </button>
                </>
              ) : (
                <button type="button" className="rounded-full bg-accent px-4 py-2 text-xs uppercase tracking-[0.2em] text-white">
                  Mettre en vente
                </button>
              )}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
