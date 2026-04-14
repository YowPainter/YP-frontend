import Link from "next/link";
import ShopModuleNav from "@/components/shop/ShopModuleNav";
import { cart, catalog, currency } from "@/lib/shop-mocks";

const platformFeeCents = 8000;

export default function CartPage() {
  const items = cart.map((line) => ({
    ...line,
    artwork: catalog.find((art) => art.id === line.artworkId),
  }));

  const subtotal = items.reduce((sum, item) => sum + (item.artwork?.priceCents ?? 0) * item.quantity, 0);
  const shipping = items.reduce((sum, item) => sum + (item.artwork?.shippingCents ?? 0), 0);
  const total = subtotal + shipping + platformFeeCents;

  return (
    <div className="mx-auto w-full max-w-[1400px]">
      <section className="reveal mb-8 rounded-[2rem] border border-foreground/10 bg-background/70 p-8">
        <p className="text-xs uppercase tracking-[0.4em] text-accent">SHOP-04</p>
        <h1 className="mt-3 font-serif text-4xl md:text-5xl">Panier d&apos;achat</h1>
        <p className="mt-4 max-w-2xl text-foreground/70">
          Validation des oeuvres, calcul des frais et preparation du passage au paiement.
        </p>
      </section>

      <ShopModuleNav />

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <section className="space-y-4">
          {items.map((item) => (
            <article key={item.id} className="rounded-3xl border border-foreground/10 bg-background/80 p-5">
              <p className="font-serif text-2xl">{item.artwork?.title}</p>
              <p className="text-sm text-foreground/60">
                {item.artwork?.artist} - Quantite: {item.quantity}
              </p>
              <div className="mt-3 flex justify-between text-sm">
                <span>Article: {currency((item.artwork?.priceCents ?? 0) * item.quantity)}</span>
                <span>Livraison: {currency(item.artwork?.shippingCents ?? 0)}</span>
              </div>
            </article>
          ))}
        </section>

        <aside className="h-fit rounded-3xl border border-foreground/10 bg-background/80 p-6">
          <h2 className="font-serif text-3xl">Resume</h2>
          <div className="mt-5 space-y-3 text-sm text-foreground/70">
            <div className="flex justify-between">
              <span>Sous-total</span>
              <span>{currency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Frais de port</span>
              <span>{currency(shipping)}</span>
            </div>
            <div className="flex justify-between">
              <span>Commission plateforme</span>
              <span>{currency(platformFeeCents)}</span>
            </div>
            <div className="mt-4 flex justify-between border-t border-foreground/10 pt-4 text-base font-semibold text-foreground">
              <span>Total</span>
              <span>{currency(total)}</span>
            </div>
          </div>
          <Link
            href="/shop/checkout"
            className="mt-6 block rounded-full bg-accent px-6 py-3 text-center text-xs uppercase tracking-[0.3em] text-white"
          >
            Continuer vers checkout
          </Link>
        </aside>
      </div>
    </div>
  );
}
