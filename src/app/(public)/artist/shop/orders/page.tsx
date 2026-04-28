"use client";

import ShopModuleNav from "@/components/shop/ShopModuleNav";
import { useQuery } from "@tanstack/react-query";
import { ShopOrdersService } from "@/lib/services/ShopOrdersService";
import { formatPrice } from "@/lib/utils";

const statusLabel: Record<string, string> = {
  PENDING_PAYMENT: "En attente de paiement",
  PAID: "Payée",
  PROCESSING: "En préparation",
  SHIPPED: "Expédiée",
  DELIVERED: "Livrée",
  CANCELLED: "Annulée",
  REFUNDED: "Remboursée",
};

export default function ArtistOrdersPage() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ["artist-orders"],
    queryFn: () => ShopOrdersService.getMySales(),
  });

  return (
    <div className="mx-auto w-full max-w-[1400px]">
      <section className="reveal mb-8 rounded-[2rem] border border-foreground/10 bg-background/80 p-8">
        <p className="text-xs uppercase tracking-[0.4em] text-accent">OPERATIONS</p>
        <h1 className="mt-3 font-serif text-4xl md:text-5xl">Dernières commandes</h1>
        <p className="mt-4 max-w-2xl text-foreground/70">
          Suivez vos ventes, gérez les expéditions et communiquez avec vos acheteurs.
        </p>
      </section>

      <ShopModuleNav />

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="animate-pulse h-32 bg-foreground/5 rounded-3xl"></div>
          ))}
        </div>
      ) : (
        <section className="space-y-4">
          {(orders || []).length === 0 ? (
            <div className="py-20 text-center border border-dashed border-foreground/10 rounded-[2rem]">
                <p className="text-foreground/40 italic">Aucune commande reçue pour le moment.</p>
            </div>
          ) : (
            (orders || []).map((order) => (
              <article key={order.id} className="rounded-3xl border border-foreground/10 bg-background/80 p-6 flex flex-wrap items-center justify-between gap-6 transition-all hover:border-accent/30">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-widest text-foreground/40">Commande {order.id?.slice(0, 8)}</p>
                  <h2 className="font-serif text-xl">{order.buyerName}</h2>
                </div>
                
                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-widest text-foreground/40 mb-1">Articles</p>
                  <p className="text-sm font-bold">{order.items?.length || 0} oeuvre(s)</p>
                </div>

                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-widest text-foreground/40 mb-1">Montant</p>
                  <p className="text-lg font-serif">{formatPrice(order.totalAmount || 0)}</p>
                </div>

                <div className="flex items-center gap-6">
                   <div className="text-right">
                     <p className="text-[10px] uppercase tracking-widest text-foreground/40 mb-1">Statut</p>
                     <span className="text-xs font-bold uppercase tracking-wider text-accent">{statusLabel[order.status || ""] || order.status}</span>
                   </div>
                   <button className="h-12 w-12 rounded-full border border-foreground/10 flex items-center justify-center hover:bg-foreground hover:text-background transition-all">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                   </button>
                </div>
              </article>
            ))
          )}
        </section>
      )}
    </div>
  );
}
