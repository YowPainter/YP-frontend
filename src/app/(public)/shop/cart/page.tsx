"use client";

import Link from "next/link";
import ShopModuleNav from "@/components/shop/ShopModuleNav";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";

const platformFee = 8000;

export default function CartPage() {
  const { items, getTotal, removeItem, updateQuantity } = useCartStore();
  
  const subtotal = getTotal();
  const shipping = items.length * 5000; // Placeholder shipping calculation
  const total = subtotal + shipping + platformFee;

  return (
    <div className="mx-auto w-full max-w-[1400px]">
      <section className="reveal mb-8 rounded-[2rem] border border-foreground/10 bg-background/70 p-8">
        <p className="text-xs uppercase tracking-[0.4em] text-accent">MY SELECTION</p>
        <h1 className="mt-3 font-serif text-4xl md:text-5xl">Panier d&apos;achat</h1>
        <p className="mt-4 max-w-2xl text-foreground/70">
          Validation des oeuvres, calcul des frais et préparation du passage au paiement.
        </p>
      </section>

      <ShopModuleNav />

      {items.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-foreground/10 rounded-[2rem]">
            <p className="text-foreground/40 italic mb-8">Votre panier est vide.</p>
            <Link href="/shop" className="px-8 py-4 bg-foreground text-background text-xs uppercase tracking-widest font-bold">
                Retour au Shop
            </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            <section className="space-y-4">
            {items.map((item) => (
                <article key={item.id} className="rounded-3xl border border-foreground/10 bg-background/80 p-5 flex justify-between items-center">
                    <div>
                        <p className="font-serif text-2xl">{item.title}</p>
                        <p className="text-sm text-foreground/60">
                            {item.artistName}
                        </p>
                        <div className="mt-3 flex gap-6 text-sm">
                            <span>Art: {formatPrice(item.price)}</span>
                            <span>Quantité: {item.quantity}</span>
                        </div>
                    </div>
                    <button 
                        onClick={() => removeItem(item.id)}
                        className="text-foreground/30 hover:text-rose-500 transition-colors"
                    >
                        Retirer
                    </button>
                </article>
            ))}
            </section>

            <aside className="h-fit rounded-3xl border border-foreground/10 bg-background/80 p-6">
                <h2 className="font-serif text-3xl">Résumé</h2>
                <div className="mt-5 space-y-3 text-sm text-foreground/70">
                    <div className="flex justify-between">
                    <span>Sous-total</span>
                    <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                    <span>Frais de port (est.)</span>
                    <span>{formatPrice(shipping)}</span>
                    </div>
                    <div className="flex justify-between">
                    <span>Service plateforme</span>
                    <span>{formatPrice(platformFee)}</span>
                    </div>
                    <div className="mt-4 flex justify-between border-t border-foreground/10 pt-4 text-base font-semibold text-foreground">
                    <span>Total estimé</span>
                    <span>{formatPrice(total)}</span>
                    </div>
                </div>
                <Link
                    href="/shop/checkout"
                    className="mt-6 block rounded-full bg-accent px-6 py-3 text-center text-xs uppercase tracking-[0.3em] text-white font-bold hover:shadow-xl transition-all"
                >
                    Passer au paiement
                </Link>
            </aside>
        </div>
      )}
    </div>
  );
}
