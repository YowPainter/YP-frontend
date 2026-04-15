"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatedBlob } from "@/components/ui/AnimatedBlob";

export default function RegisterPage() {
  const [role, setRole] = useState<"COLLECTOR" | "ARTIST">("COLLECTOR");

  return (
    <div className="flex min-h-screen w-full canvas-texture canvas-grain overflow-hidden">
      
      {/* Côté Gauche: Visuel Artistique */}
      <div className="hidden lg:flex relative w-1/2 flex-col justify-between p-12 overflow-hidden bg-accent">
        {/* L'Image d'Art en arrière-plan */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/register-art.png" 
            alt="Vibrant Abstract Art" 
            fill 
            className="object-cover opacity-40 mix-blend-overlay transition-transform duration-[12s] hover:scale-110" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-accent via-transparent to-accent/40"></div>
        </div>

        <AnimatedBlob className="top-[-10%] right-[-10%] w-[45vw] h-[45vw]" color="slate" opacity={0.2} />

        <div className="relative z-10 flex items-center gap-4">
          <div className="w-8 h-8 bg-white rounded-full mb-1"></div>
          <span className="font-serif text-3xl font-medium tracking-tighter italic text-white">YowPainter</span>
        </div>

        <div className="relative z-10">
          <h2 className="font-serif text-6xl font-light leading-[1.1] tracking-tight mb-6 text-white">
            Devenez <br />
            <span className="italic font-normal">l'Avant-Garde.</span>
          </h2>
          <p className="text-xl text-white/70 max-w-md font-light leading-relaxed border-l border-white/30 pl-6 py-2">
            Que vous soyez créateur ou amateur de pépites, votre place est ici. Créez votre profil en quelques secondes et accédez à l'intégralité de la galerie.
          </p>
        </div>

        <div className="relative z-10 flex justify-between items-end border-t border-white/10 pt-8">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/40">Statut actuel</span>
            <span className="text-sm font-serif italic text-white/90">
              {role === "COLLECTOR" ? "Collectionneur d'Art" : "Artiste Contemporain"}
            </span>
          </div>
          <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/20">© 2024 Art Without Walls.</p>
        </div>
      </div>

      {/* Côté Droit: Formulaire d'inscription */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 sm:px-12 lg:px-20 relative py-20 overflow-y-auto">
        {/* Éléments artistiques sur le côté formulaire */}
        <div className="absolute top-0 right-0 w-64 h-64 text-accent/5 pointer-events-none -z-10">
           <svg viewBox="0 0 100 100" fill="currentColor"><circle cx="100" cy="0" r="100" /></svg>
        </div>
        <div className="absolute bottom-10 right-10 w-24 h-24 border border-accent/20 rounded-full animate-spin-slow pointer-events-none"></div>
        
        <div className="w-full max-w-md my-auto">
          <div className="mb-12">
            <h1 className="font-serif text-5xl font-medium mb-3 tracking-tight">Inscription.</h1>
            <p className="text-foreground/50 font-light italic">Commencer votre voyage artistique.</p>
          </div>

          {/* Sélecteur de Rôle Style Onglets de Musée */}
          <div className="flex gap-4 mb-12 p-1 bg-foreground/5 rounded-full">
            <button 
              onClick={() => setRole("COLLECTOR")}
              className={`flex-1 py-3 px-6 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-500 ${role === "COLLECTOR" ? "bg-foreground text-background shadow-lg" : "text-foreground/40 hover:text-foreground"}`}
            >
              Collectionneur
            </button>
            <button 
              onClick={() => setRole("ARTIST")}
              className={`flex-1 py-3 px-6 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-500 ${role === "ARTIST" ? "bg-accent text-white shadow-lg" : "text-foreground/40 hover:text-foreground"}`}
            >
              Artiste
            </button>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2 group">
                <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-foreground/40 group-focus-within:text-accent transition-colors px-4">Prénom</label>
                <input type="text" className="w-full bg-transparent border-b border-foreground/10 py-3 px-4 outline-none focus:border-accent transition-all text-lg font-light tracking-tight" />
              </div>
              <div className="space-y-2 group">
                <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-foreground/40 group-focus-within:text-accent transition-colors px-4">Nom</label>
                <input type="text" className="w-full bg-transparent border-b border-foreground/10 py-3 px-4 outline-none focus:border-accent transition-all text-lg font-light tracking-tight" />
              </div>
            </div>

            <div className="space-y-2 group">
              <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-foreground/40 group-focus-within:text-accent transition-colors px-4">Adresse Email</label>
              <input type="email" placeholder="nom@exemple.com" className="w-full bg-transparent border-b border-foreground/10 py-3 px-4 outline-none focus:border-accent transition-all text-lg font-light tracking-tight placeholder:text-foreground/5" />
            </div>

            <div className="space-y-2 group">
              <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-foreground/40 group-focus-within:text-accent transition-colors px-4">Mot de passe</label>
              <input type="password" placeholder="••••••••" className="w-full bg-transparent border-b border-foreground/10 py-3 px-4 outline-none focus:border-accent transition-all text-lg font-light tracking-tight placeholder:text-foreground/5" />
            </div>

            <div className="pt-8">
              <button className={`w-full py-5 px-8 text-xs uppercase tracking-[0.4em] font-bold text-white transition-all duration-500 shadow-xl group flex items-center justify-center gap-4 ${role === 'COLLECTOR' ? 'bg-foreground hover:bg-black' : 'bg-accent hover:opacity-90'}`}>
                Créer mon compte
                <span className="text-xl transition-transform group-hover:translate-x-2">&rarr;</span>
              </button>
            </div>
          </form>

          <div className="mt-12 text-center">
            <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-foreground/30 mb-8">
              En vous inscrivant, vous acceptez nos <Link href="#" className="underline">Conditions d'Utilisation</Link>.
            </p>
            <p className="text-foreground/40 font-light italic">
              Déjà un compte ? <Link href="/login" className="text-accent font-bold not-italic hover:underline ml-2">Connectez-vous</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
