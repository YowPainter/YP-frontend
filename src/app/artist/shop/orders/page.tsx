import ShopModuleNav from "@/components/shop/ShopModuleNav";
import { artistOrders, currency, orderStatusLabel } from "@/lib/shop-mocks";

const statusTone: Record<(typeof artistOrders)[number]["status"], string> = {
  en_attente: "bg-slate-500/20 text-slate-700 dark:text-slate-300",
  payee: "bg-sky-500/20 text-sky-700 dark:text-sky-300",
  en_preparation: "bg-amber-500/20 text-amber-700 dark:text-amber-300",
  expediee: "bg-indigo-500/20 text-indigo-700 dark:text-indigo-300",
  livree: "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300",
};

export default function ArtistOrdersPage() {
  return (
    <div className="mx-auto w-full max-w-[1400px]">
      <section className="reveal mb-8 rounded-[2rem] border border-foreground/10 bg-background/80 p-8">
        <p className="text-xs uppercase tracking-[0.4em] text-accent">SHOP-07</p>
        <h1 className="mt-3 font-serif text-4xl md:text-5xl">Gestion des commandes recues</h1>
        <p className="mt-4 max-w-2xl text-foreground/70">
          Pilotage des ventes cote artiste: statut, acheteur, paiement, preparation et expedition.
        </p>
      </section>

      <ShopModuleNav />

      <section className="space-y-4">
        {artistOrders.map((order) => (
          <article key={order.id} className="rounded-3xl border border-foreground/10 bg-background/80 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-serif text-2xl">{order.id}</h2>
              <span className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em] ${statusTone[order.status]}`}>
                {orderStatusLabel[order.status]}
              </span>
            </div>
            <div className="mt-3 grid gap-3 text-sm text-foreground/70 sm:grid-cols-4">
              <p>Acheteur: {order.buyer}</p>
              <p>Paiement: {order.paymentMethod}</p>
              <p>Montant: {currency(order.totalCents)}</p>
              <p>Date: {order.createdAt}</p>
            </div>
            <p className="mt-3 text-sm text-foreground/65">
              Articles: {order.items.map((item) => `${item.title} x${item.quantity}`).join(", ")}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <button type="button" className="rounded-full border border-foreground/20 px-4 py-2 text-xs uppercase tracking-[0.2em]">
                Marquer en preparation
              </button>
              <button type="button" className="rounded-full border border-foreground/20 px-4 py-2 text-xs uppercase tracking-[0.2em]">
                Marquer expediee
              </button>
              <button type="button" className="rounded-full bg-accent px-4 py-2 text-xs uppercase tracking-[0.2em] text-white">
                Contacter acheteur
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
