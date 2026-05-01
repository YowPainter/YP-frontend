"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative z-10 w-full overflow-hidden pt-20 pb-12 reveal">
      
      {/* Triangle Penché Décoratif (Retour à gauche) */}
      <div className="absolute top-[10%] left-[-10%] w-[35vw] h-[35vw] text-amber-500/10 pointer-events-none -z-10 transform -rotate-[30deg]">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M0,200 L200,200 L100,0 Z" />
        </svg>
      </div>
      
      {/* Forme géante décorative en fond de footer - INCLINÉE */}
      <div className="absolute bottom-[-10%] right-[-10%] w-[70vw] h-[70vw] text-foreground/[0.04] pointer-events-none -z-10 transform rotate-[15deg] origin-bottom-right">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M39.6,-67.2C50.2,-61.1,56.9,-46.8,63.1,-33.5C69.3,-20.2,74.9,-7.8,73.1,4C71.3,15.8,62.1,27.1,52.2,36.9C42.2,46.7,31.4,55,19.3,59.3C7.2,63.6,-6.2,63.9,-19.7,60.8C-33.1,57.7,-46.5,51.3,-56,41.2C-65.4,31.2,-70.8,17.4,-72.1,3.2C-73.4,-11.1,-70.5,-25.8,-63,-38.1C-55.5,-50.4,-43.3,-60.2,-30.3,-65C-17.3,-69.8,-3.4,-69.5,10.6,-71.4C24.7,-73.2,39,-77.2,39.6,-67.2Z" transform="translate(100 100)" />
        </svg>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent mb-24"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 mb-32">
          
          {/* Bloc d'Impact (Newsletter) */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <h2 className="font-serif text-5xl md:text-7xl font-light mb-4 leading-none tracking-tighter">
              Rejoignez <br/> <span className="italic font-normal">l'avant-garde.</span>
            </h2>
            <p className="text-foreground/50 font-light text-xl max-w-sm mb-8 leading-relaxed">
              Soyez le premier à découvrir les nouvelles acquisitions et les talents qui feront demain.
            </p>
            <form className="flex w-full max-w-md border-b-[1.5px] border-foreground/20 focus-within:border-accent transition-all duration-700 pb-4">
              <input 
                type="email" 
                placeholder="Votre adresse email" 
                className="flex-1 bg-transparent border-none outline-none text-xl text-foreground placeholder:text-foreground/20 font-light tracking-tight"
                required
              />
              <button type="submit" className="text-xs font-bold uppercase tracking-[0.4em] hover:text-accent transition-colors">
                S'inscrire
              </button>
            </form>
          </div>
          
          {/* Navigation Structurée */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-12 sm:gap-16">
            
            <div className="flex flex-col gap-6">
              <h4 className="font-medium text-xs uppercase tracking-[0.3em] mb-4 text-foreground/30">Collections</h4>
              <ul className="flex flex-col gap-4 font-serif text-lg italic">
                <li><Link href="/galerie?category=peinture" className="text-foreground/70 hover:text-accent transition-colors">Peinture Classique</Link></li>
                <li><Link href="/galerie?category=sculpture" className="text-foreground/70 hover:text-accent transition-colors">Sculpture d'Art</Link></li>
                <li><Link href="/galerie?category=photographie" className="text-foreground/70 hover:text-accent transition-colors">Photographie</Link></li>
                <li><Link href="/galerie?category=digital" className="text-foreground/70 hover:text-accent transition-colors">Digital Art</Link></li>
              </ul>
            </div>

            <div className="flex flex-col gap-6">
              <h4 className="font-medium text-xs uppercase tracking-[0.3em] mb-4 text-foreground/30">Plateforme</h4>
              <ul className="flex flex-col gap-4 text-sm font-bold uppercase tracking-widest">
                <li><Link href="/artists" className="text-foreground/80 hover:text-accent transition-colors">Village des Artistes</Link></li>
                <li><Link href="/events" className="text-foreground/80 hover:text-accent transition-colors">Vernissages</Link></li>
                <li><Link href="/shop" className="text-foreground/80 hover:text-accent transition-colors">Boutique</Link></li>
                <li><Link href="/about" className="text-foreground/80 hover:text-accent transition-colors">Manifesto</Link></li>
                <li><Link href="/register" className="text-accent hover:text-foreground transition-colors">Devenir Artiste</Link></li>
              </ul>
            </div>

            <div className="flex flex-col gap-6">
              <h4 className="font-medium text-xs uppercase tracking-[0.3em] mb-4 text-foreground/30">Archives</h4>
              <ul className="flex flex-col gap-4 text-sm font-light">
                <li><Link href="/faq" className="text-foreground/60 hover:text-accent transition-colors">Aide & Support</Link></li>
                <li><Link href="/terms" className="text-foreground/60 hover:text-accent transition-colors">Conditions</Link></li>
                <li><Link href="/privacy" className="text-foreground/60 hover:text-accent transition-colors">Privacy</Link></li>
              </ul>
            </div>

          </div>
        </div>
        
        {/* Ligne de droits */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-8 pt-12 border-t border-foreground/5">
          <div className="flex items-center gap-6">
            <div className="relative w-20 h-20 overflow-hidden">
              <Image 
                src="/images/logo.png" 
                alt="YowPainter Logo" 
                fill
                sizes="80px"
                className="object-contain opacity-80 scale-[2]"
              />
            </div>
            <span className="font-serif text-2xl font-medium tracking-tighter">Yow<span className="text-accent italic">Painter</span></span>
          </div>
          <p className="text-foreground/20 text-[10px] uppercase tracking-[0.5em] font-bold">© {new Date().getFullYear()} Art Without Walls.</p>
        </div>
      </div>
    </footer>
  );
}
