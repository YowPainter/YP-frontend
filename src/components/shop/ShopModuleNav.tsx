"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = { href: string; label: string };

const buyerLinks: NavItem[] = [
  { href: "/shop", label: "Boutique" },
  { href: "/shop/cart", label: "Panier" },
  { href: "/shop/checkout", label: "Checkout" },
  { href: "/shop/confirmation", label: "Confirmation" },
  { href: "/shop/purchases", label: "Achats" },
  { href: "/shop/disputes", label: "Litiges" },
];

const artistLinks: NavItem[] = [
  { href: "/artist/shop/listings", label: "Mises en vente" },
  { href: "/artist/shop/orders", label: "Commandes recues" },
];

function LinkChip({ item, pathname }: { item: NavItem; pathname: string }) {
  const active = pathname === item.href;
  return (
    <Link
      href={item.href}
      className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] transition-all ${
        active
          ? "border-accent bg-accent text-white"
          : "border-foreground/15 text-foreground/70 hover:border-accent hover:text-accent"
      }`}
    >
      {item.label}
    </Link>
  );
}

export default function ShopModuleNav() {
  const pathname = usePathname();

  return (
    <aside className="mb-10 space-y-4">
      <div className="rounded-3xl border border-foreground/10 bg-background/70 p-5 backdrop-blur">
        <p className="mb-3 text-[11px] uppercase tracking-[0.35em] text-foreground/40">
          Parcours Acheteur
        </p>
        <div className="flex flex-wrap gap-2">
          {buyerLinks.map((item) => (
            <LinkChip key={item.href} item={item} pathname={pathname} />
          ))}
        </div>
      </div>
      <div className="rounded-3xl border border-foreground/10 bg-background/70 p-5 backdrop-blur">
        <p className="mb-3 text-[11px] uppercase tracking-[0.35em] text-foreground/40">
          Parcours Artiste
        </p>
        <div className="flex flex-wrap gap-2">
          {artistLinks.map((item) => (
            <LinkChip key={item.href} item={item} pathname={pathname} />
          ))}
        </div>
      </div>
    </aside>
  );
}
