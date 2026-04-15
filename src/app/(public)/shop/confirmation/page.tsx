import Link from "next/link";
import ShopModuleNav from "@/components/shop/ShopModuleNav";
import { currency } from "@/lib/shop-mocks";

export default function ConfirmationPage() {
  return (
    <div className="mx-auto w-full max-w-[1400px]">
      <section className="reveal mb-8 rounded-[2rem] border border-foreground/10 bg-background/80 p-10">
        <p className="text-xs uppercase tracking-[0.4em] text-accent">SHOP-06</p>
        <h1 className="mt-3 font-serif text-4xl md:text-5xl">Commande confirmee</h1>
        <p className="mt-4 max-w-2xl text-foreground/70">
          Email et notification in-app declenches (mock). Le suivi de livraison et les prochaines actions sont affiches.
        </p>
      </section>

      <ShopModuleNav />

      <div className="grid gap-8 lg:grid-cols-[1.8fr_1fr]">
        <section className="space-y-5 rounded-3xl border border-foreground/10 bg-background/80 p-6">
          <div className="rounded-2xl border border-accent/40 bg-accent/10 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-accent">Reference</p>
            <p className="mt-2 font-serif text-3xl">YWP-2026-0012</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <article className="rounded-2xl border border-foreground/10 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-foreground/45">Montant paye</p>
              <p className="mt-2 text-xl font-semibold">{currency(688000)}</p>
            </article>
            <article className="rounded-2xl border border-foreground/10 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-foreground/45">Mode de paiement</p>
              <p className="mt-2 text-xl font-semibold">Stripe</p>
            </article>
            <article className="rounded-2xl border border-foreground/10 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-foreground/45">Date de commande</p>
              <p className="mt-2 text-xl font-semibold">14 avril 2026</p>
            </article>
            <article className="rounded-2xl border border-foreground/10 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-foreground/45">Livraison estimee</p>
              <p className="mt-2 text-xl font-semibold">19 avril 2026</p>
            </article>
          </div>
        </section>

        <aside className="h-fit rounded-3xl border border-foreground/10 bg-background/80 p-6">
          <h2 className="font-serif text-3xl">Et ensuite ?</h2>
          <div className="mt-5 space-y-3">
            <Link href="/shop/purchases" className="block rounded-full border border-foreground/15 px-4 py-2 text-center text-xs uppercase tracking-[0.2em] hover:border-accent hover:text-accent">
              Voir mes achats
            </Link>
            <Link href="/shop/disputes" className="block rounded-full border border-foreground/15 px-4 py-2 text-center text-xs uppercase tracking-[0.2em] hover:border-accent hover:text-accent">
              Ouvrir un litige
            </Link>
            <Link href="/shop" className="block rounded-full bg-accent px-4 py-2 text-center text-xs uppercase tracking-[0.2em] text-white">
              Retour boutique
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
