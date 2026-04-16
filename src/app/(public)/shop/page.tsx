"use client";

import Image from "next/image";
import Link from "next/link";
import ShopModuleNav from "@/components/shop/ShopModuleNav";
import { AnimatedBlob } from "@/components/ui/AnimatedBlob";
import { useQuery } from "@tanstack/react-query";
import { ArtworksService } from "@/lib/services/ArtworksService";
import { formatPrice } from "@/lib/utils";

// Static placeholders as requested for missing API equivalents
const boutiqueKpis = [
  { label: "Oeuvres en vente", value: "24" },
  { label: "Panier moyen", value: "186 500 XAF" },
  { label: "Commandes ce mois", value: "42" },
  { label: "Taux de conversion", value: "3,7%" },
];

export default function ShopIndexPage() {
  const { data: artworks, isLoading } = useQuery({
    queryKey: ["shop-featured"],
    queryFn: () => ArtworksService.getFeatured(),
  });

  return (
    <div className="mx-auto w-full max-w-[1400px] px-6 sm:px-12 pt-32 pb-24 canvas-texture canvas-grain relative overflow-hidden">
      
      {/* Arrière-plans artistiques */}
      <div className="absolute inset-0 z-[-5] pointer-events-none">
        <AnimatedBlob className="top-[-5%] right-[-10%] w-[40vw] h-[40vw]" color="accent" opacity={0.1} />
        <AnimatedBlob className="bottom-[10%] left-[5%] w-[30vw] h-[30vw]" color="amber" opacity={0.05} delay />
        
        <svg className="absolute top-[15%] left-[10%] w-[20vw] h-[20vw] text-foreground/5 opacity-50 transform rotate-12" viewBox="0 0 100 100">
           <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4,4" />
        </svg>
      </div>

      <section className="reveal relative overflow-hidden rounded-[3rem] border border-foreground/5 bg-background/40 backdrop-blur-xl p-8 md:p-16 mb-16 shadow-2xl">
        <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
        
        <div className="relative z-10 max-w-4xl">
          <p className="mb-6 text-xs uppercase tracking-[0.5em] font-bold text-accent flex items-center gap-4">
            <span className="w-12 h-[1px] bg-accent"></span> Le Shop YowPainter
          </p>
          <h1 className="font-serif text-5xl leading-[1.1] md:text-7xl tracking-tighter mb-8">
            Acquérir l'Unique. <br />
            <span className="italic font-normal text-foreground/80">En toute sérénité.</span>
          </h1>
          <p className="max-w-xl text-xl text-foreground/60 font-light leading-relaxed mb-10 border-l border-accent/30 pl-8">
            Une expérience de collection simplifiée, premium et sécurisée. Du coup de cœur à la livraison, nous veillons sur chaque chef-d'œuvre.
          </p>
          <div className="flex flex-wrap gap-6 pt-4">
            <Link href="/shop/cart" className="group flex items-center gap-4 bg-foreground text-background px-10 py-5 text-xs uppercase tracking-[0.4em] font-bold hover:bg-accent transition-all duration-500 shadow-xl">
              Accéder au Panier
              <span className="text-xl transition-transform group-hover:translate-x-2">&rarr;</span>
            </Link>
            <Link href="/artist/shop/listings" className="px-10 py-5 border border-foreground/10 text-xs uppercase tracking-[0.4em] font-bold hover:border-accent hover:text-accent transition-all duration-500">
              Espace Exposant
            </Link>
          </div>
        </div>
      </section>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 mb-16">
        {boutiqueKpis.map((kpi) => (
          <article key={kpi.label} className="group rounded-3xl border border-foreground/5 bg-background/50 p-8 backdrop-blur transition-all duration-500 hover:border-accent/20 hover:shadow-xl">
            <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-foreground/30 group-hover:text-accent transition-colors">{kpi.label}</p>
            <p className="mt-4 font-serif text-4xl tracking-tighter">{kpi.value}</p>
          </article>
        ))}
      </div>

      <div className="mb-12 border-b border-foreground/5 pb-8">
        <ShopModuleNav />
      </div>

      {isLoading ? (
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse aspect-[3/4] bg-foreground/5 rounded-2xl"></div>
          ))}
        </div>
      ) : (
        <section className="grid gap-12 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {(artworks || []).map((art) => (
            <article key={art.id} className="group transition-all duration-700">
              <Link href={`/artworks/${art.id}`} className="block">
                <div className="relative aspect-[3/4] overflow-hidden bg-white p-3 shadow-sm group-hover:shadow-2xl transition-all duration-700 border border-foreground/5 mb-6">
                  <div className="relative w-full h-full overflow-hidden">
                    <Image src={art.imageUrls?.[0] || "/images/placeholder.png"} alt={art.title || ""} fill className="object-cover transition-transform duration-[2s] group-hover:scale-110" />
                  </div>
                  
                  <div className="absolute left-6 top-6 transition-all duration-500 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0">
                    <span className="rounded-full bg-background/90 backdrop-blur px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
                      {art.style}
                    </span>
                  </div>

                  {art.status !== 'ON_SALE' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                      <span className="rounded-full bg-foreground px-6 py-2 text-[10px] uppercase tracking-[0.3em] font-black text-background">
                        Indisponible
                      </span>
                    </div>
                  )}
                </div>
              </Link>

              <div className="space-y-4 px-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="font-serif text-2xl tracking-tight group-hover:text-accent transition-colors">{art.title}</h2>
                    <p className="text-xs text-foreground/40 font-bold uppercase tracking-widest mt-1">
                      {art.artistName || "Artiste Inconnu"}
                    </p>
                  </div>
                </div>
                
                <div className="h-[1px] w-12 bg-accent/20 transition-all duration-500 group-hover:w-full"></div>

                <div className="flex items-end justify-between">
                  <div className="flex flex-col">
                    <span className="text-xl font-medium tracking-tight">
                        {/* ArtworkResponse doesn't have price, usually it's in the linked product. Placeholder if missing. */}
                        {formatPrice(0)}
                    </span>
                    <span className="text-[10px] text-foreground/30 uppercase font-bold tracking-tighter">+ livraison {formatPrice(0)}</span>
                  </div>
                  
                  <button
                    type="button"
                    disabled={art.status !== 'ON_SALE'}
                    className={`flex h-12 w-12 items-center justify-center rounded-full transition-all duration-500 ${
                      art.status === 'ON_SALE'
                        ? "bg-foreground text-background hover:bg-accent hover:shadow-lg"
                        : "cursor-not-allowed opacity-20 bg-foreground/15"
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}

