"use client";

import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Trash2, Minus, Plus, ArrowLeft, ShoppingBag } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import { useEffect, useState } from "react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, getItemCount } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 pt-32 pb-24 text-center">
        <div className="w-24 h-24 rounded-full bg-foreground/5 flex items-center justify-center mb-8 animate-in fade-in zoom-in duration-700">
          <ShoppingBag size={40} className="text-foreground/20" />
        </div>
        <h1 className="font-serif text-4xl md:text-6xl mb-6 tracking-tighter">Votre panier est vide</h1>
        <p className="text-foreground/40 max-w-sm mb-10 font-light">
          Il semblerait que vous n&apos;ayez pas encore trouvé la perle rare.
        </p>
        <Link 
          href="/shop" 
          className="bg-accent text-white px-10 py-4 text-xs uppercase tracking-[0.4em] font-black hover:bg-foreground transition-all shadow-xl"
        >
          Découvrir la boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] px-6 sm:px-12 pt-32 pb-24">
      <div className="flex items-center gap-4 mb-16 reveal">
        <Link href="/shop" className="p-2 rounded-full border border-foreground/10 hover:border-accent hover:text-accent transition-all">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-serif text-5xl md:text-7xl tracking-tighter italic">Votre Panier</h1>
        <div className="h-[1px] flex-1 bg-foreground/10 mx-4"></div>
        <span className="text-[10px] uppercase tracking-[0.4em] font-black text-foreground/30">
          {getItemCount()} {getItemCount() > 1 ? 'articles' : 'article'}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-10">
          {items.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row gap-8 pb-10 border-b border-foreground/5 group reveal">
              {/* Product Image */}
              <div className="relative w-full sm:w-48 aspect-[4/5] rounded-2xl overflow-hidden border border-foreground/5 bg-foreground/[0.02]">
                <SafeImage 
                  src={item.imageUrl} 
                  alt={item.title} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110" 
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 flex flex-col py-2">
                <div className="flex justify-between items-start gap-4 mb-2">
                  <div>
                    <h3 className="font-serif text-2xl font-medium mb-1 group-hover:text-accent transition-colors">{item.title}</h3>
                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/40 italic">
                      par {item.artistName}
                    </p>
                  </div>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-foreground/20 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="mt-auto flex flex-wrap items-end justify-between gap-6">
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-4 p-1 rounded-full border border-foreground/10 bg-foreground/[0.02]">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-foreground/5 transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-foreground/5 transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <span className="block text-[9px] uppercase tracking-widest text-foreground/30 font-black mb-1">Prix unitaire</span>
                    <span className="font-display text-2xl font-black text-accent tracking-tighter">
                      {formatPrice(item.price)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-4">
          <div className="glass-elegant border border-foreground/10 p-10 rounded-[2.5rem] sticky top-32 reveal">
            <h2 className="font-serif text-3xl mb-10 tracking-tight">Récapitulatif</h2>
            
            <div className="space-y-6 mb-10">
              <div className="flex justify-between items-center text-sm">
                <span className="text-foreground/40 font-light">Sous-total</span>
                <span className="font-bold">{formatPrice(getTotal())}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-foreground/40 font-light">Frais de livraison</span>
                <span className="text-green-500 font-bold uppercase text-[10px] tracking-widest">Offerts</span>
              </div>
              <div className="h-[1px] bg-foreground/10"></div>
              <div className="flex justify-between items-end">
                <span className="font-serif text-xl italic text-foreground/60">Total</span>
                <span className="font-display text-4xl font-black text-accent tracking-tighter">
                  {formatPrice(getTotal())}
                </span>
              </div>
            </div>

            <Link 
              href="/checkout"
              className="w-full flex items-center justify-center py-5 bg-ink text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] shadow-2xl hover:bg-accent transition-all hover:translate-y-[-2px]"
            >
              Passer la commande
            </Link>

            <p className="mt-8 text-[10px] text-center text-foreground/30 font-bold uppercase tracking-widest leading-relaxed px-4">
              Paiement sécurisé par Mobile Money & Cartes Bancaires.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
