"use client";

import Link from "next/link";
import ShopModuleNav from "@/components/shop/ShopModuleNav";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { formatPrice } from "@/lib/utils";

export default function CheckoutPage() {
  const { items, getTotal } = useCartStore();
  const { user } = useAuthStore();
  
  const subtotal = getTotal();
  const shipping = items.length * 5000;
  const platformFee = 8000;
  const total = subtotal + shipping + platformFee;

  return (
    <div className="mx-auto w-full max-w-[1400px]">
      <section className="reveal mb-8 rounded-[2rem] border border-foreground/10 bg-gradient-to-r from-background via-background to-accent/10 p-8">
        <p className="text-xs uppercase tracking-[0.4em] text-accent">CHECKOUT</p>
        <h1 className="mt-3 font-serif text-4xl md:text-5xl">Paiement sécurisé</h1>
        <p className="mt-4 max-w-2xl text-foreground/70">
          Validation finale de votre commande et choix du moyen de paiement.
        </p>
      </section>

      <ShopModuleNav />

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <section className="space-y-6">
          <article className="rounded-3xl border border-foreground/10 bg-background/80 p-6">
            <h2 className="font-serif text-3xl">Adresse de livraison</h2>
            <p className="mt-3 text-sm text-foreground/70">
                {user ? `${user.firstName || user.artistName || 'Utilisateur'}, Cameroun` : "Connectez-vous pour définir une adresse"} - Tel: +237 6XX XXX XXX
            </p>
            <button type="button" className="mt-4 rounded-full border border-foreground/20 px-4 py-2 text-xs uppercase tracking-[0.2em] font-bold">
              Modifier
            </button>
          </article>

          <article className="rounded-3xl border border-foreground/10 bg-background/80 p-6">
            <h2 className="font-serif text-3xl">Moyen de paiement</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-accent bg-accent/10 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-accent">Sélectionné</p>
                <p className="mt-2 font-medium">Stripe (CB, Visa, Mastercard)</p>
              </div>
              <div className="rounded-2xl border border-foreground/10 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-foreground/45">Alternative</p>
                <p className="mt-2 font-medium">Mobile Money (MTN, Orange)</p>
              </div>
            </div>
            <div className="mt-5 rounded-2xl border border-foreground/10 p-4 text-sm text-foreground/70 italic">
              Données cryptées TLS 1.3 - Paiement conforme PCI-DSS via nos prestataires sécurisés.
            </div>
          </article>
        </section>

        <aside className="h-fit rounded-3xl border border-foreground/10 bg-background/80 p-6">
          <h2 className="font-serif text-3xl">Récapitulatif</h2>
          <div className="mt-4 space-y-3 text-sm">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span className="truncate max-w-[200px]">{item.title}</span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
            <div className="mt-4 flex justify-between text-foreground/65">
              <span>Livraison</span>
              <span>{formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between text-foreground/65">
              <span>Service</span>
              <span>{formatPrice(platformFee)}</span>
            </div>
            <div className="mt-4 flex justify-between border-t border-foreground/10 pt-4 text-base font-semibold">
              <span>Total final</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
          <Link
            href="/shop/confirmation"
            className="mt-6 block rounded-full bg-accent px-6 py-3 text-center text-xs uppercase tracking-[0.3em] text-white font-bold hover:shadow-xl transition-all"
          >
            Confirmer le paiement
          </Link>
        </aside>
      </div>
    </div>
  );
}
