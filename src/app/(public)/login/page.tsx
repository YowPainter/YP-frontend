"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatedBlob } from "@/components/ui/AnimatedBlob";
import { useAuthStore, getDashboardRoute } from "@/store/authStore";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "@/lib/toast";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = await login({ email, password });
      toast.success('Connexion réussie !', `Bienvenue, ${user.firstName || user.artistName || ''} !`);
      router.push(getDashboardRoute(user.role));
    } catch (err: any) {
      const message = err.body?.message || err.message || "Une erreur est survenue lors de la connexion.";
      setError(message);
      toast.error(err, 'Connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full canvas-texture canvas-grain overflow-hidden">

      {/* Côté Gauche: Visuel Artistique */}
      <div className="hidden lg:flex relative w-1/2 flex-col justify-between p-12 overflow-hidden bg-black">
        {/* L'Image d'Art en arrière-plan with a subtle overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/login-art.png"
            alt="Abstract Art"
            fill
            className="object-cover opacity-60 transition-transform duration-[10s] hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40"></div>
        </div>

        <AnimatedBlob className="top-[-10%] left-[-10%] w-[40vw] h-[40vw]" color="accent" opacity={0.2} />

        <div className="relative z-10 flex items-center gap-4 opacity-0 h-0 overflow-hidden">
          {/* Logo supprimé car déjà présent dans la Navbar */}
        </div>

        <div className="relative z-10">
          <h2 className="font-serif text-6xl font-light leading-[1.1] tracking-tight mb-6 text-white">
            L'Art commence <br />
            <span className="italic font-normal">ici.</span>
          </h2>
          <p className="text-xl text-white/60 max-w-md font-light leading-relaxed border-l border-accent pl-6 py-2">
            Rejoignez une communauté de créateurs et de passionnés. Gérez votre collection, suivez vos artistes favoris et vivez l'expérience totale YowPainter.
          </p>
        </div>

        <div className="relative z-10 flex justify-between items-end border-t border-white/10 pt-8">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/30">Commissaire</span>
            <span className="text-sm font-serif italic text-white/80">Elena Rostova</span>
          </div>
          <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/20">© 2024 Art Without Walls.</p>
        </div>
      </div>

      {/* Côté Droit: Formulaire */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 sm:px-12 lg:px-20 relative">
        {/* Éléments artistiques on the form side */}
        <div className="absolute top-10 right-10 w-32 h-32 text-accent/10 pointer-events-none">
          <svg viewBox="0 0 100 100" fill="currentColor"><path d="M0 100 L100 0 L100 100 Z" /></svg>
        </div>
        <div className="absolute bottom-20 left-10 w-48 h-1 text-accent/20 rotate-45 pointer-events-none"></div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 pointer-events-none opacity-40">
          <AnimatedBlob className="top-[10%] right-[10%] w-[30rem] h-[30rem]" color="accent" />
        </div>

        <div className="w-full max-w-md">
          <div className="mb-12">
            <h1 className="font-serif text-5xl font-medium mb-3 tracking-tight">Connexion.</h1>
            <p className="text-foreground/50 font-light italic">Heureux de vous revoir parmi nous.</p>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            {error && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs uppercase tracking-widest font-bold">
                {error}
              </div>
            )}

            <div className="space-y-2 group">
              <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-foreground/40 group-focus-within:text-accent transition-colors px-4">Adresse Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nom@exemple.com"
                className="w-full bg-transparent border-b border-foreground/10 py-4 px-4 outline-none focus:border-accent transition-all text-xl font-light tracking-tight placeholder:text-foreground/10"
              />
            </div>

            <div className="space-y-2 group relative">
              <div className="flex justify-between items-center px-4">
                <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-foreground/40 group-focus-within:text-accent transition-colors">Mot de passe</label>
                <Link href="#" className="text-[10px] uppercase tracking-[0.3em] font-bold text-accent hover:text-foreground transition-colors">Oublié ?</Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent border-b border-foreground/10 py-4 px-4 pr-12 outline-none focus:border-accent transition-all text-xl font-light tracking-tight placeholder:text-foreground/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/20 hover:text-accent transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="pt-8">
              <button
                disabled={loading}
                className="w-full bg-foreground text-background py-5 px-8 text-xs uppercase tracking-[0.4em] font-bold hover:bg-accent hover:shadow-[0_20px_50px_rgba(var(--accent-rgb),0.3)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-500 shadow-xl group flex items-center justify-center gap-4"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    Se Connecter
                    <span className="text-xl transition-transform group-hover:translate-x-2">&rarr;</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-16 pt-8 border-t border-foreground/5 text-center">
            <p className="text-foreground/40 font-light italic mb-6">Nouveau dans la galerie ?</p>
            <Link href="/register" className="inline-block px-10 py-4 border border-foreground/10 hover:border-accent hover:text-accent transition-all text-[10px] uppercase tracking-[0.3em] font-bold">
              Créer un compte
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
