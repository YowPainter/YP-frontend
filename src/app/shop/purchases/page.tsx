import ShopModuleNav from "@/components/shop/ShopModuleNav";
import { currency, purchases } from "@/lib/shop-mocks";

const purchaseBadge: Record<(typeof purchases)[number]["status"], string> = {
  en_cours: "bg-amber-500/20 text-amber-700 dark:text-amber-300",
  livree: "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300",
  remboursee: "bg-slate-500/20 text-slate-700 dark:text-slate-300",
};

export default function PurchasesPage() {
  return (
    <div className="mx-auto w-full max-w-[1400px]">
      <section className="reveal mb-8 rounded-[2rem] border border-foreground/10 bg-background/80 p-8">
        <p className="text-xs uppercase tracking-[0.4em] text-accent">SHOP-08</p>
        <h1 className="mt-3 font-serif text-4xl md:text-5xl">Historique des achats</h1>
        <p className="mt-4 max-w-2xl text-foreground/70">
          Suivi des commandes passees par l&apos;acheteur avec statut, montant et methode de paiement.
        </p>
      </section>

      <ShopModuleNav />

      <section className="space-y-4">
        {purchases.map((purchase) => (
          <article key={purchase.id} className="rounded-3xl border border-foreground/10 bg-background/80 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-serif text-2xl">{purchase.id}</p>
              <span className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em] ${purchaseBadge[purchase.status]}`}>
                {purchase.status}
              </span>
            </div>
            <p className="mt-2 text-sm text-foreground/60">Artiste: {purchase.artist}</p>
            <div className="mt-4 grid gap-3 text-sm text-foreground/70 sm:grid-cols-3">
              <p>Total: {currency(purchase.totalCents)}</p>
              <p>Paiement: {purchase.paymentMethod}</p>
              <p>Date: {purchase.purchasedAt}</p>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
