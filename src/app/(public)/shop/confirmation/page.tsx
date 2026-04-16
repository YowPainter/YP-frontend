"use client";

import Link from "next/link";
import ShopModuleNav from "@/components/shop/ShopModuleNav";
import { formatPrice } from "@/lib/utils";

export default function ConfirmationPage() {
  return (
    <div className="mx-auto w-full max-w-[1400px]">
      <section className="reveal mb-8 rounded-[2rem] border border-foreground/10 bg-background/80 p-10 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-accent">SUCCESS</p>
        <h1 className="mt-3 font-serif text-4xl md:text-5xl">Commande confirmée</h1>
        <p className="mt-4 max-w-2xl text-foreground/70 mx-auto">
          Un email de confirmation vous a été envoyé. Vous pouvez suivre l&apos;évolution de votre commande dans votre espace personnel.
        </p>
      </section>

      <ShopModuleNav />

      <div className="grid gap-8 lg:grid-cols-[1.8fr_1fr]">
        <section className="space-y-5 rounded-3xl border border-foreground/10 bg-background/80 p-6">
          <div className="rounded-2xl border border-accent/40 bg-accent/10 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-accent">Référence</p>
            <p className="mt-2 font-serif text-3xl">YWP-{new Date().getFullYear()}-XXXX</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <article className="rounded-2xl border border-foreground/10 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-foreground/45">Montant payé</p>
              <p className="mt-2 text-xl font-semibold">{formatPrice(0)}</p>
            </article>
            <article className="rounded-2xl border border-foreground/10 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-foreground/45">Mode de paiement</p>
              <p className="mt-2 text-xl font-semibold font-serif italic">Sécurisé</p>
            </article>
            <article className="rounded-2xl border border-foreground/10 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-foreground/45">Date de commande</p>
              <p className="mt-2 text-xl font-semibold">{new Date().toLocaleDateString('fr-FR')}</p>
            </article>
            <article className="rounded-2xl border border-foreground/10 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-foreground/45">Livraison estimée</p>
              <p className="mt-2 text-xl font-semibold">Sous 3 à 5 jours</p>
            </article>
          </div>
        </section>

        <aside className="h-fit rounded-3xl border border-foreground/10 bg-background/80 p-6">
          <h2 className="font-serif text-3xl">Et ensuite ?</h2>
          <div className="mt-5 space-y-3">
            <Link href="/shop/purchases" className="block rounded-full border border-foreground/15 px-4 py-2 text-center text-xs uppercase tracking-[0.2em] hover:border-accent hover:text-accent font-bold transition-all">
              Voir mes achats
            </Link>
            <Link href="/shop/disputes" className="block rounded-full border border-foreground/15 px-4 py-2 text-center text-xs uppercase tracking-[0.2em] hover:border-accent hover:text-accent font-medium">
              Ouvrir un litige
            </Link>
            <Link href="/shop" className="block rounded-full bg-accent px-4 py-2 text-center text-xs uppercase tracking-[0.2em] text-white font-bold hover:shadow-lg transition-all">
              Retour boutique
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
