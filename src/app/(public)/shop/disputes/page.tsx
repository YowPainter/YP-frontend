"use client";

import ShopModuleNav from "@/components/shop/ShopModuleNav";
import { formatPrice } from "@/lib/utils";

const placeholderDisputes = [
    {
        id: "LIT-2026-001",
        stage: "ouvert",
        orderId: "CMD-88229",
        reason: "Article non conforme à la description",
        requestedRefund: 45000,
        lastUpdate: "Hier, 14:30"
    }
];

const stageBadge: Record<string, string> = {
  ouvert: "bg-rose-500/20 text-rose-700 dark:text-rose-300",
  en_analyse: "bg-amber-500/20 text-amber-700 dark:text-amber-300",
  resolu: "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300",
};

export default function DisputesPage() {
  return (
    <div className="mx-auto w-full max-w-[1400px]">
      <section className="reveal mb-8 rounded-[2rem] border border-foreground/10 bg-background/80 p-8">
        <p className="text-xs uppercase tracking-[0.4em] text-accent">SUPPORT</p>
        <h1 className="mt-3 font-serif text-4xl md:text-5xl">Remboursements et litiges</h1>
        <p className="mt-4 max-w-2xl text-foreground/70">
          Centre de résolution des incidents : création de ticket, suivi du dossier et issue finale.
        </p>
      </section>

      <ShopModuleNav />

      <section className="space-y-4">
        {placeholderDisputes.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-foreground/10 rounded-[2rem]">
                <p className="text-foreground/40 italic">Aucun litige en cours.</p>
            </div>
        ) : (
            placeholderDisputes.map((dispute) => (
                <article key={dispute.id} className="rounded-3xl border border-foreground/10 bg-background/80 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-serif text-2xl">{dispute.id}</p>
                    <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${stageBadge[dispute.stage]}`}>
                        {dispute.stage}
                    </span>
                    </div>
                    <p className="mt-3 text-sm text-foreground/75 font-medium">Commande: {dispute.orderId}</p>
                    <p className="mt-1 text-sm text-foreground/60 italic">Motif: {dispute.reason}</p>
                    <div className="mt-4 grid gap-3 text-sm text-foreground/70 sm:grid-cols-2 border-t border-foreground/5 pt-4">
                    <p>Montant demandé: <span className="font-bold text-foreground">{formatPrice(dispute.requestedRefund)}</span></p>
                    <p className="text-right">Dernière mise à jour: {dispute.lastUpdate}</p>
                    </div>
                </article>
            ))
        )}
      </section>
    </div>
  );
}
