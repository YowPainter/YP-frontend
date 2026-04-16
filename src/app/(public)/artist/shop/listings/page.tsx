"use client";

import ShopModuleNav from "@/components/shop/ShopModuleNav";
import { useQuery } from "@tanstack/react-query";
import { ShopOrdersService } from "@/lib/services/ShopOrdersService";
import { formatPrice } from "@/lib/utils";

export default function ArtistListingsPage() {
  const { data: inventory, isLoading } = useQuery({
    queryKey: ["artist-inventory"],
    queryFn: () => ShopOrdersService.getInventory(),
  });

  return (
    <div className="mx-auto w-full max-w-[1400px]">
      <section className="reveal mb-8 rounded-[2rem] border border-foreground/10 bg-background/80 p-8">
        <p className="text-xs uppercase tracking-[0.4em] text-accent">MY DASHBOARD</p>
        <h1 className="mt-3 font-serif text-4xl md:text-5xl">Mise en vente des oeuvres</h1>
        <p className="mt-4 max-w-2xl text-foreground/70">
          L&apos;artiste fixe prix et frais de port, active ou retire les oeuvres de la boutique.
        </p>
      </section>

      <ShopModuleNav />

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="animate-pulse h-40 bg-foreground/5 rounded-3xl"></div>
          ))}
        </div>
      ) : (
        <section className="space-y-4">
          {(inventory || []).map((item) => (
            <article key={item.id} className="rounded-3xl border border-foreground/10 bg-background/80 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-serif text-2xl">{item.name}</h2>
                <span className="rounded-full border border-foreground/15 px-3 py-1 text-xs uppercase tracking-[0.2em] text-foreground/55">
                  {item.active ? "En Vente" : "Brouillon"}
                </span>
              </div>
              <div className="mt-4 grid gap-3 text-sm text-foreground/70 sm:grid-cols-3">
                <p>Prix: {formatPrice(item.price || 0)}</p>
                <p>Stock: {item.stockQuantity || 0}</p>
                <p>Status: {item.active ? "Actif" : "Inactif"}</p>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {item.active ? (
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
      )}
    </div>
  );
}
