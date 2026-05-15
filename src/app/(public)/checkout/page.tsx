"use client";

import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Loader2, MapPin, Phone, CreditCard } from "lucide-react";
import { useEffect, useState } from "react";
import { ShopOrdersService } from "@/lib/services/ShopOrdersService";
import { toast } from "@/lib/toast";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [orderIds, setOrderIds] = useState<string[]>([]);
  const router = useRouter();

  const [shippingAddress, setShippingAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  if (items.length === 0 && !completed) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 pt-32 pb-24 text-center">
        <h1 className="font-serif text-4xl mb-6">Accès non autorisé</h1>
        <Link href="/shop" className="text-accent underline">Retour à la boutique</Link>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    if (!shippingAddress.trim()) {
      toast.error("Veuillez renseigner votre adresse de livraison");
      return;
    }
    if (!phoneNumber.trim()) {
      toast.error("Veuillez renseigner votre numéro de téléphone pour le paiement");
      return;
    }

    setLoading(true);
    try {
      const ids: string[] = [];
      
      // On place une commande pour CHAQUE article du panier
      // car le backend semble être structuré ainsi (productId par commande)
      for (const item of items) {
        const res = await ShopOrdersService.placeOrder(item.artistId, {
          productId: item.id,
          quantity: item.quantity,
          shippingAddress: shippingAddress,
        });
        if (res.id) ids.push(res.id);
      }

      setOrderIds(ids);
      setCompleted(true);
      clearCart();
      toast.success("Commandes validées avec succès !");
    } catch (err) {
      toast.error(err, "Erreur lors de la validation");
    } finally {
      setLoading(false);
    }
  };

  if (completed) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 pt-32 pb-24 text-center reveal">
        <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center mb-8 animate-in zoom-in duration-1000">
          <CheckCircle2 size={48} className="text-green-500" />
        </div>
        <h1 className="font-serif text-5xl md:text-7xl mb-6 tracking-tighter italic">Commande validée !</h1>
        <p className="text-foreground/50 max-w-lg mb-12 font-light text-xl leading-relaxed">
          Merci pour votre acquisition. Vous recevrez un appel ou un SMS de confirmation sous peu pour finaliser le paiement Mobile Money.
        </p>
        <div className="flex flex-wrap justify-center gap-6">
           <Link 
            href="/artdashboard" 
            className="px-10 py-4 border border-foreground/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-foreground/5 transition-all"
          >
            Suivre mes achats
          </Link>
          <Link 
            href="/shop" 
            className="px-10 py-4 bg-accent text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-foreground transition-all shadow-xl"
          >
            Continuer mes achats
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] px-6 sm:px-12 pt-32 pb-24">
      <div className="flex items-center gap-4 mb-16 reveal">
        <Link href="/cart" className="p-2 rounded-full border border-foreground/10 hover:border-accent hover:text-accent transition-all">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-serif text-5xl md:text-7xl tracking-tighter">Finalisation</h1>
        <div className="h-[1px] flex-1 bg-foreground/10 mx-4"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Checkout Form */}
        <div className="lg:col-span-7 space-y-12">
          <div className="space-y-8 reveal">
            <div className="flex items-center gap-4 text-accent">
              <MapPin size={24} />
              <h2 className="font-serif text-3xl italic">Adresse de Livraison</h2>
            </div>
            <textarea 
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              placeholder="Saisissez votre adresse complète (Quartier, Rue, Porte...)"
              className="w-full bg-foreground/[0.02] border border-foreground/10 rounded-3xl p-8 min-h-[150px] outline-none focus:border-accent transition-all font-light text-lg"
              required
            />
          </div>

          <div className="space-y-8 reveal" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center gap-4 text-accent">
              <Phone size={24} />
              <h2 className="font-serif text-3xl italic">Paiement Mobile Money</h2>
            </div>
            <div className="relative">
              <input 
                type="tel" 
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Numéro de téléphone (MOMO / Orange)"
                className="w-full bg-foreground/[0.02] border border-foreground/10 rounded-full px-10 py-6 outline-none focus:border-accent transition-all font-bold text-xl tracking-widest"
                required
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 flex gap-2">
                <div className="w-10 h-6 bg-yellow-400 rounded-md opacity-40"></div>
                <div className="w-10 h-6 bg-orange-500 rounded-md opacity-40"></div>
              </div>
            </div>
            <p className="text-[11px] text-foreground/40 font-bold uppercase tracking-widest px-4">
              Un message de validation vous sera envoyé sur ce numéro.
            </p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-5">
          <div className="glass-elegant border border-foreground/10 p-10 rounded-[2.5rem] reveal" style={{ animationDelay: '200ms' }}>
            <h2 className="font-serif text-3xl mb-10 tracking-tight">Votre Commande</h2>
            
            <div className="space-y-6 mb-10 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-foreground/5 bg-foreground/5 shrink-0">
                    <img src={item.imageUrl} alt={item.title} className="object-cover w-full h-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium truncate">{item.title}</h4>
                    <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest">
                      {item.quantity} x {formatPrice(item.price)}
                    </p>
                  </div>
                  <span className="text-sm font-bold">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-6 pt-10 border-t border-foreground/10 mb-10">
              <div className="flex justify-between items-end">
                <span className="font-serif text-xl italic text-foreground/60">Total à payer</span>
                <span className="font-display text-4xl font-black text-accent tracking-tighter">
                  {formatPrice(getTotal())}
                </span>
              </div>
            </div>

            <button 
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full flex items-center justify-center gap-4 py-6 bg-ink text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] shadow-2xl hover:bg-accent transition-all hover:translate-y-[-2px] disabled:opacity-50"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : (
                <>
                  <CreditCard size={18} />
                  Valider l&apos;acquisition
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
