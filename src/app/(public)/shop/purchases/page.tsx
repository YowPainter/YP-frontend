"use client";

import ShopModuleNav from "@/components/shop/ShopModuleNav";
import { useQuery } from "@tanstack/react-query";
import { ShopOrdersService } from "@/lib/services/ShopOrdersService";
import { formatPrice, formatNumber } from "@/lib/utils";

const statusLabel: Record<string, string> = {
  PENDING_PAYMENT: "En attente de paiement",
  PAID: "Payée",
  PROCESSING: "En préparation",
  SHIPPED: "Expédiée",
  DELIVERED: "Livrée",
  CANCELLED: "Annulée",
  REFUNDED: "Remboursée",
};

export default function PurchasesPage() {
  const { data: purchases, isLoading } = useQuery({
    queryKey: ["my-purchases"],
    queryFn: () => ShopOrdersService.getMyPurchases(),
  });

  return (
    <div className="mx-auto w-full max-w-[1400px]">
      <section className="reveal mb-8 rounded-[2rem] border border-foreground/10 bg-background/80 p-8">
        <p className="text-xs uppercase tracking-[0.4em] text-accent">MES ACHATS</p>
        <h1 className="mt-3 font-serif text-4xl md:text-5xl">Historique des acquisitions</h1>
        <p className="mt-4 max-w-2xl text-foreground/70">
          Suivi des commandes passées, factures et suivi de livraison de vos chefs-d&apos;œuvre.
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
          {(purchases || []).length === 0 ? (
            <div className="py-20 text-center border border-dashed border-foreground/10 rounded-[2rem]">
                <p className="text-foreground/40 italic">Vous n&apos;avez pas encore effectué d&apos;achat.</p>
            </div>
          ) : (
            (purchases || []).map((purchase) => (
              <article key={purchase.id} className="rounded-3xl border border-foreground/10 bg-background/80 p-6 transition-all hover:border-accent/20">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <p className="font-serif text-2xl tracking-tighter">REF: {purchase.id?.slice(0, 8).toUpperCase()}</p>
                  <span className="rounded-full border border-accent/20 bg-accent/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-accent">
                    {statusLabel[purchase.status || ""] || purchase.status}
                  </span>
                </div>
                
                <div className="grid gap-6 text-sm sm:grid-cols-3 border-t border-foreground/5 pt-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-foreground/30 mb-1">Montant total</p>
                    <p className="font-bold">{formatPrice(purchase.totalAmount || 0)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-foreground/30 mb-1">Articles</p>
                    <p className="font-medium">{purchase.items?.length || 0} oeuvre(s)</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-foreground/30 mb-1">Date</p>
                    <p className="font-medium">{purchase.createdAt ? new Date(purchase.createdAt).toLocaleDateString('fr-FR') : "N/A"}</p>
                  </div>
                </div>
              </article>
            ))
          )}
        </section>
      )}
    </div>
  );
}
