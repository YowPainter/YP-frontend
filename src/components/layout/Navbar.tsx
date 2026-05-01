"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useAuthStore, getDashboardRoute } from "@/store/authStore";
import { useRouter, usePathname } from "next/navigation";
import { User, LogOut } from "lucide-react";

function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Évite le flash SSR
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-9 h-9" />;

  const isDark = resolvedTheme === "dark";

  return (
    <button
      id="theme-toggle-btn"
      onClick={toggleTheme}
      aria-label={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
      title={isDark ? "Mode clair" : "Mode sombre"}
      className="relative w-9 h-9 flex items-center justify-center rounded-full border border-foreground/20 hover:border-accent hover:text-accent text-foreground/60 transition-all duration-300 hover:rotate-12 hover:scale-110"
    >
      {/* Icône animée : Soleil / Lune */}
      <span
        className="absolute inset-0 flex items-center justify-center transition-all duration-500"
        style={{ opacity: isDark ? 1 : 0, transform: isDark ? "rotate(0deg) scale(1)" : "rotate(90deg) scale(0)" }}
      >
        {/* Lune */}
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </span>
      <span
        className="absolute inset-0 flex items-center justify-center transition-all duration-500"
        style={{ opacity: isDark ? 0 : 1, transform: isDark ? "rotate(-90deg) scale(0)" : "rotate(0deg) scale(1)" }}
      >
        {/* Soleil */}
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      </span>
    </button>
  );
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 px-6 sm:px-12 pointer-events-none 
      ${scrolled || pathname === '/login' || pathname === '/register' || pathname?.includes('dashboard') ? "py-4 glass-elegant backdrop-blur-xl border-b border-foreground/5 shadow-sm" : "py-8"}`}
    >
      <div className="max-w-[1400px] mx-auto flex justify-between items-center pointer-events-auto">

        {/* Logo (Gauche) */}
        <div className="flex-1 flex justify-start">
          <Link href="/" className="flex items-center gap-3 group">
            <div className={`relative transition-all duration-500 overflow-hidden ${scrolled || pathname === '/login' || pathname === '/register' || pathname?.includes('dashboard') ? 'w-14 h-14' : 'w-24 h-24'}`}>
              <Image 
                src="/images/logo.png" 
                alt="YowPainter Logo" 
                fill
                sizes="100px"
                className="object-contain scale-[2] transition-transform duration-500"
                priority
              />
            </div>
            <span className={`font-serif italic font-light text-foreground/80 tracking-tight transition-all duration-500 ${scrolled ? 'opacity-0 w-0 overflow-hidden text-[0px]' : 'opacity-100 w-auto text-xl'}`}>
              YowPainter
            </span>
          </Link>
        </div>

        {/* Navigation Centrale (Ergonomie Maximale) */}
        <nav className="hidden lg:flex items-center gap-10">
          <div className="flex items-center gap-8 font-serif text-lg italic text-foreground/80 lowercase tracking-wide">
            <Link href="/galerie" className="hover:text-accent transition-colors relative group">
              Collection
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent group-hover:w-full transition-all"></span>
            </Link>
            <Link href="/artists" className="hover:text-accent transition-colors relative group">
              Artistes
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent group-hover:w-full transition-all"></span>
            </Link>
            <Link href="/events" className="hover:text-accent transition-colors relative group">
              Evenements
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent group-hover:w-full transition-all"></span>
            </Link>
            <Link href="/shop" className="hover:text-accent transition-colors relative group">
              Boutique
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent group-hover:w-full transition-all"></span>
            </Link>
          </div>
        </nav>

        {/* Actions (Droite) */}
        <div className="flex-1 flex justify-end items-center gap-4 md:gap-6">
          <ThemeToggle />

          {!mounted ? (
            <div className="w-10 h-10" />
          ) : isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link
                href={getDashboardRoute(user?.role)}
                className="flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-full border border-foreground/10 overflow-hidden transition-all group-hover:border-accent">
                  {user?.profilePictureUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.profilePictureUrl}
                      alt="Profile"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-foreground/5 text-foreground/40">
                      <User size={18} />
                    </div>
                  )}
                </div>
                {!scrolled && (
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/60 group-hover:text-accent">
                    {user?.firstName || 'Profil'}
                  </span>
                )}
              </Link>
              <button
                onClick={() => {
                  logout();
                  router.push("/");
                }}
                className="p-2 text-foreground/40 hover:text-rose-500 transition-colors"
                title="Déconnexion"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="text-xs uppercase tracking-[0.4em] font-bold text-foreground/70 border border-foreground/20 px-6 py-2.5 hover:border-accent hover:text-accent transition-all duration-300">Login</Link>
              <Link href="/register" className={`bg-accent text-white px-8 py-3 text-xs uppercase tracking-[0.4em] font-bold hover:bg-foreground hover:shadow-xl transition-all shadow-md ${scrolled ? 'scale-90 opacity-90' : 'scale-100'}`}>S&apos;inscrire</Link>
            </>
          )}
        </div>

      </div>

    </header>
  );
}
