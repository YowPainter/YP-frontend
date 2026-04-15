import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative w-full canvas-texture canvas-grain pb-24 selection:bg-accent selection:text-white overflow-hidden">
      
      {/* TÂCHES DE COULEURS ABSTRAITES & DIFFORMES (L'Aquarelle) - TRÈS PROFOND */}
      <div className="absolute top-[-5%] left-[-10%] w-[50vw] h-[50vw] bg-accent/10 dark:bg-accent/20 blur-[100px] z-[-20] animate-blob" style={{ borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" }}></div>
      <div className="absolute top-[20%] right-[-5%] w-[40vw] h-[60vw] bg-amber-500/10 dark:bg-amber-600/15 blur-[120px] z-[-20] animate-blob-delayed" style={{ borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%" }}></div>
      <div className="absolute bottom-[10%] left-[10%] w-[45vw] h-[40vw] bg-slate-400/10 dark:bg-slate-500/15 blur-[130px] z-[-20] animate-blob" style={{ borderRadius: "75% 25% 67% 33% / 45% 74% 26% 55%" }}></div>
      <div className="absolute top-[60%] right-[10%] w-[35vw] h-[35vw] bg-rose-400/5 dark:bg-rose-900/20 blur-[100px] z-[-20] animate-blob-delayed" style={{ borderRadius: "46% 54% 21% 79% / 51% 26% 74% 49%" }}></div>

      {/* FIGURES GÉOMÉTRIQUES ABSTRAITES (Type Kandinsky / Miro) - DERRIÈRE LE TEXTE */}
      <div className="absolute inset-0 z-[-10] pointer-events-none overflow-hidden">
        
        {/* Ligne courbe éclatante - Décalée sur le côté */}
        <svg className="absolute top-[5%] left-[-15%] w-[45vw] h-[45vw] text-foreground/20 opacity-80 transform -rotate-12" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="none" stroke="currentColor" strokeWidth="2" d="M10,190 Q90,10 190,190" strokeDasharray="8,12" strokeLinecap="round" />
        </svg>
        
        {/* Arc géométrique strict - Plus haut */}
        <svg className="absolute top-[2%] right-[5%] w-[25vw] h-[25vw] text-accent/40 opacity-100 animate-spin-slow" style={{ animationDuration: '60s' }} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="100 200" strokeLinecap="round" />
        </svg>

        {/* Forme brute asymétrique - Décalée */}
        <svg className="absolute top-[45%] right-[-15%] w-[35vw] h-[35vw] text-foreground/10 opacity-100 transform rotate-45" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <polygon fill="currentColor" points="120,0 20,200 200,90 0,90 180,200" />
        </svg>

        {/* Lignes parallèles hachurées - Déplacées pour éviter "Nouvelles Acquisitions" */}
        <svg className="absolute top-[40%] left-[-5%] w-[15vw] h-[15vw] text-accent/30 opacity-100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="20" x2="100" y2="20" stroke="currentColor" strokeWidth="3" />
          <line x1="0" y1="40" x2="100" y2="40" stroke="currentColor" strokeWidth="3" />
          <line x1="0" y1="60" x2="100" y2="60" stroke="currentColor" strokeWidth="3" />
          <line x1="0" y1="80" x2="100" y2="80" stroke="currentColor" strokeWidth="3" />
        </svg>
        
        {/* Trio de cercles flottants francs - Déplacés */}
        <div className="absolute top-[60%] left-[5%] w-16 h-16 rounded-full border-4 border-foreground/15 opacity-100"></div>
        <div className="absolute top-[62%] left-[3%] w-10 h-10 rounded-full bg-accent/30 opacity-90"></div>
        <div className="absolute top-[65%] left-[7%] w-6 h-6 rounded-full border-2 border-accent opacity-80 bg-foreground/10"></div>
        
        {/* Tâche géante (Triangle Penché) - Vers le bas */}
        <svg className="absolute top-[85%] left-[-15%] w-[40vw] h-[40vw] text-amber-500/10 opacity-100 transform -rotate-[45deg]" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M0,200 L200,200 L100,0 Z" />
        </svg>

      </div>

      {/* 1. HERO SECTION: Musée Contemporain */}
      <section className="relative w-full min-h-[85vh] flex flex-col justify-center pt-16 px-6 sm:px-12 max-w-[1400px] mx-auto z-10">
        
        {/* Lettrine Géante en Arrière-plan */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-12 font-serif text-[40rem] font-black text-foreground/[0.03] select-none pointer-events-none z-0 leading-none">
          Y
        </div>

        <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20 relative z-10">
          
          {/* Bloc Texte Épuré */}
          <div className="w-full lg:w-1/2 flex flex-col items-start reveal">
            <div className="relative mb-6 reveal-delay-1">
              <p className="text-accent uppercase tracking-[0.4em] text-sm font-bold flex items-center gap-4">
                <span className="w-12 h-[1.5px] bg-accent"></span> YowPainter Gallery
              </p>
              {/* Éclaboussure de peinture subtile derrière le tag */}
              <svg className="absolute -top-10 -left-10 w-32 h-32 text-accent/10 -z-10 opacity-60" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path fill="currentColor" d="M44.7,-76.4C58.3,-69.2,70,-57.9,78.7,-44.5C87.4,-31.1,93.1,-15.5,91.3,-0.9C89.5,13.6,80.3,27.2,71.2,40.1C62.1,53,53.2,65.3,41.4,73.1C29.6,80.9,14.8,84.1,-0.7,85.2C-16.1,86.4,-32.3,85.5,-46.1,78.9C-59.9,72.3,-71.4,60,-79,45.8C-86.6,31.7,-90.4,15.8,-89.4,0.6C-88.3,-14.7,-82.5,-29.3,-74.1,-42.2C-65.7,-55.1,-54.7,-66.2,-41.7,-73.7C-28.7,-81.3,-14.4,-85.2,0.4,-85.9C15.2,-86.6,31.1,-83.7,44.7,-76.4Z" transform="translate(100 100)" />
              </svg>
            </div>

            <h1 className="font-serif text-6xl md:text-8xl lg:text-[7rem] font-medium leading-[0.95] tracking-tighter mb-10 text-foreground reveal-delay-2">
              L'Art. <br />
              <span className="relative">
                Sans les murs.
                <span className="absolute -bottom-2 left-0 w-full h-8 bg-accent/5 -z-10 transform -rotate-1"></span>
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-foreground/70 max-w-lg font-light leading-relaxed mb-12 border-l-2 border-accent pl-8 py-2 reveal-delay-3">
              Chaque œuvre est une porte ouverte. Découvrez des pièces uniques, soutenez directement les créateurs et vibrez au rythme de la création contemporaine.
            </p>
            
            <div className="flex items-center gap-10">
              <Link href="/galerie" className="group flex items-center gap-6 border-b border-foreground pb-3 hover:border-accent hover:text-accent transition-all duration-500">
                <span className="font-serif text-2xl tracking-tight transition-colors">Explorer la Collection</span>
                <div className="w-12 h-[1px] bg-foreground group-hover:bg-accent group-hover:w-20 transition-all duration-500"></div>
              </Link>
            </div>
          </div>

          {/* Composition Image Héro (Audacieuse) */}
          <div className="w-full lg:w-1/2 relative h-[600px] lg:h-[800px] mt-12 lg:mt-0 flex items-center justify-center reveal reveal-delay-2">
            
            {/* L'image principale (Brush Border & Floating) */}
            <div className="relative w-[340px] md:w-[450px] aspect-[3/4] art-frame bg-white p-4 lg:p-6 z-20 parallax-slow shadow-[30px_30px_80px_rgba(0,0,0,0.1)]">
              <div className="relative w-full h-full bg-foreground/5 overflow-hidden">
                <Image 
                  src="/images/placeholder.png" 
                  alt="Pièce Maîtresse" 
                  fill
                  className="object-cover transition-transform duration-[3s] hover:scale-110"
                  priority
                />
              </div>
              {/* Annotation manuscrite factice */}
              <div className="absolute -bottom-12 -right-8 font-serif italic text-accent/60 text-lg rotate-[-5deg] select-none">
                "Pure Essence, 2024"
              </div>
            </div>
            
            {/* Forme géométrique décalée */}
            <div className="absolute top-[10%] left-0 w-[200px] h-[300px] bg-accent/5 border border-accent/10 z-10 transform -rotate-12"></div>
            <div className="absolute bottom-[5%] right-0 w-[250px] h-[250px] rounded-full border-[0.5px] border-foreground/10 z-0"></div>
            
            <div className="absolute right-[-2rem] top-1/3 translate-y-1/2 rotate-90 origin-right hidden lg:block z-30">
              <p className="text-xs tracking-[0.6em] uppercase text-foreground/30 font-bold">Curated Masterpiece</p>
            </div>
          </div>
        </div>
      </section>

      {/* TRANSITION DRIP / SPLASH */}
      <div className="w-full h-20 flex justify-center items-start overflow-hidden pointer-events-none relative z-10">
        <svg className="w-64 h-full text-accent/10 opacity-80" viewBox="0 0 100 100" preserveAspectRatio="none">
           <path fill="currentColor" d="M0,0 C20,40 40,0 60,60 C80,20 100,80 100,0 L100,0 L0,0 Z" />
        </svg>
      </div>

      {/* 2. PÉPITES ARTISTIQUES: MASONRY ASYMÉTRIQUE */}
      <section className="w-full max-w-[1400px] mx-auto px-6 sm:px-12 mt-20 z-10 relative">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-foreground/5 pb-10">
          <div className="relative group">
            <span className="w-24 h-[2px] bg-accent absolute -top-10 left-0 transition-all duration-700 group-hover:w-40"></span>
            <h2 className="font-serif text-6xl md:text-7xl font-light mb-6 text-foreground tracking-tighter">Nouvelles <span className="italic font-normal">Acquisitions</span></h2>
            <p className="text-foreground/40 font-light text-2xl max-w-md leading-tight">Une sélection millimétrée des créations qui définissent aujourd'hui.</p>
          </div>
          <Link href="/galerie" className="group flex items-center gap-4 text-xs font-bold uppercase tracking-[0.3em] text-accent hover:text-foreground transition-all mt-10 md:mt-0">
            <span className="border-b border-accent/30 group-hover:border-foreground pb-2">Parcourir toute la galerie</span>
            <span className="text-2xl transition-transform group-hover:translate-x-3">&rarr;</span>
          </Link>
        </div>

        {/* Grille Masonry Audacieuse */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-16 md:gap-x-12 lg:gap-x-20">
          
          {/* Colonne 1 : Grande oeuvre stable */}
          <div className="md:col-span-7 lg:col-span-8 group cursor-pointer reveal">
            <div className="relative w-full aspect-[16/10] art-frame bg-white p-4 transition-all duration-700 mb-8 border border-foreground/5">
              <div className="relative w-full h-full overflow-hidden">
                <Image src="/images/placeholder.png" alt="Grand format" fill className="object-cover transition-transform duration-[2s] group-hover:scale-105" />
                {/* Overlay dégradé — lisible en mode clair ET sombre */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="absolute inset-0 flex flex-col justify-end p-10 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-10 group-hover:translate-y-0">
                  <span className="text-white text-4xl font-serif mb-2 drop-shadow-lg">Structure Invisible</span>
                  <span className="text-white/90 uppercase tracking-widest text-sm drop-shadow">Peinte à la main — 3 200 €</span>
                </div>
              </div>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="font-serif text-3xl">01</span>
              <div className="h-[1px] flex-1 bg-foreground/10"></div>
              <span className="text-foreground/40 font-light italic">Elena Rostova</span>
            </div>

            {/* Oeuvre Panoramique (Déplacée à gauche) */}
            <div className="group cursor-pointer relative mt-20 -translate-x-6 md:-translate-x-12 w-full md:w-[110%] z-20">
               <svg className="absolute -top-10 -left-10 w-40 h-20 text-accent/15 -z-10 group-hover:scale-110 transition-transform duration-1000" viewBox="0 0 200 100">
                  <path d="M10 50 L190 50" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="10 5" />
               </svg>
               <div className="relative w-full h-32 md:h-40 art-frame bg-white p-3 shadow-2xl overflow-hidden">
                 <div className="relative w-full h-full overflow-hidden">
                    <Image src="/images/placeholder.png" alt="Format Panoramique" fill className="object-cover transition-transform duration-[4s] group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center p-8">
                       <span className="text-white text-sm uppercase tracking-[0.4em] font-medium">Horizon Infini</span>
                    </div>
                 </div>
               </div>
               <p className="mt-4 text-[10px] uppercase tracking-[0.5em] font-bold text-foreground/40 text-left">Panorama Artistique, Collection 2024</p>
            </div>
          </div>

          <div className="md:col-span-5 lg:col-span-4 md:-translate-y-20 reveal reveal-delay-2">
            <div className="group cursor-pointer mb-20">
              <div className="relative w-full aspect-[3/5] art-frame bg-white p-4 mb-6 shadow-xl">
                <div className="relative w-full h-full overflow-hidden">
                  <Image src="/images/placeholder.png" alt="Oeuvre vertical" fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" />
                </div>
              </div>
              <div className="flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-widest text-accent mb-2">Abstraction</span>
                  <h3 className="font-serif text-2xl font-medium">Équilibre Précis</h3>
                </div>
                <span className="text-lg font-medium">1 450 €</span>
              </div>
            </div>

            {/* Retour de l'Étoile Tournante (Élément Décoratif à droite) */}
            <div className="relative mt-12 flex justify-end pr-12 group cursor-help">
               <div className="relative">
                 <svg className="w-32 h-32 text-accent/20 animate-spin-slow opacity-80" viewBox="0 0 100 100">
                    <path d="M50 10 L60 40 L90 50 L60 60 L50 90 L40 60 L10 50 L40 40 Z" fill="currentColor" />
                 </svg>
                 <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[10px] uppercase tracking-[0.4em] font-black text-foreground/40 rotate-12">Y-P</span>
                 </div>
               </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. LE HUB DES ARTISTES: Présentation solennelle & Annuaire */}
      <section className="relative z-10 w-full bg-foreground text-background mt-24 py-20 px-6 sm:px-12 overflow-hidden">
        {/* Tâche de peinture abstraite très foncée pour casser le bloc solide */}
        <div className="absolute top-[10%] left-[-10%] w-[30vw] h-[30vw] bg-accent/20 blur-[80px] rounded-full mix-blend-screen pointer-events-none" style={{ borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%" }}></div>

        <div className="max-w-[1400px] mx-auto flex flex-col relative z-10">
          
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-background/20 pb-8">
            <div className="w-full md:w-1/2">
              <span className="w-12 h-[1px] bg-accent block mb-6"></span>
              <h2 className="font-serif text-4xl md:text-6xl font-medium mb-4">Le Village des Créateurs.</h2>
              <p className="text-background/60 font-light text-lg">
                Des centaines de talents internationaux possèdent leur propre galerie sur YowPainter. Explorez leurs univers.
              </p>
            </div>
            
            {/* Barre de Recherche Élégante */}
            <div className="w-full md:w-1/3 mt-8 md:mt-0 relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-background/40 group-focus-within:text-accent transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
              <input 
                type="text" 
                placeholder="Rechercher un artiste..." 
                className="w-full bg-background/5 border border-background/20 rounded-full py-3 pl-12 pr-6 text-background placeholder:text-background/40 focus:outline-none focus:border-accent focus:bg-background/10 transition-all font-light"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 w-full mb-24">
            {[
               { nom: "Elena Rostova", type: "Expressionnisme", country: "Paris, FR", shape: "rounded-[60%_40%_30%_70%/60%_30%_70%_40%]" },
               { nom: "Marc Legrand", type: "Minimalisme", country: "Montréal, CA", shape: "rounded-[30%_70%_70%_30%/30%_30%_70%_70%]" },
               { nom: "Studio Lumière", type: "Nouveau Média", country: "Berlin, DE", shape: "rounded-[75%_25%_67%_33%/45%_74%_26%_55%]" },
               { nom: "Aisha Diallo", type: "Art Contemporain", country: "Dakar, SN", shape: "rounded-[46%_54%_21%_79%/51%_26%_74%_49%]" }
            ].map((artist, idx) => (
              <Link href={`/${artist.nom.toLowerCase().replace(' ', '-')}`} key={idx} className="flex flex-col group cursor-pointer transition-all duration-700">
                 <div className={`w-full aspect-[4/5] mb-8 overflow-hidden relative ${artist.shape} border border-background/20 group-hover:scale-105 transition-all duration-700`}>
                   <Image src="/images/placeholder.png" alt={artist.nom} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" />
                   
                   {/* Badge Pays de Luxe */}
                   <div className="absolute top-6 left-6 mix-blend-difference">
                     <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-background/80">{artist.country}</span>
                   </div>
                 </div>
                 
                 <div className="flex flex-col items-center text-center">
                   <h3 className="font-serif text-3xl font-medium mb-2 group-hover:text-accent transition-colors">{artist.nom}</h3>
                   <div className="w-8 h-[1px] bg-accent/40 mb-3 group-hover:w-20 transition-all duration-700"></div>
                   <p className="text-background/40 uppercase tracking-[0.4em] text-[10px] font-bold">{artist.type}</p>
                 </div>
              </Link>
            ))}
          </div>

          <div className="flex justify-center">
            <Link href="/artists" className="px-8 py-3 border border-background/30 hover:border-accent hover:bg-accent hover:text-white transition-all text-sm uppercase tracking-widest font-medium">
              Parcourir l'Annuaire (250+ Artistes)
            </Link>
          </div>
        </div>
      </section>
      
    </div>
  );
}
