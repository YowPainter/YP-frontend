// app/(public)/events/page.tsx
import { Metadata } from 'next';
import { EventGrid } from '@/components/events/EventGrid';
import { Suspense } from 'react';
import { AnimatedBlob } from '@/components/ui/AnimatedBlob';

export const metadata: Metadata = {
    title: 'Expositions & Événements | YowPainter',
    description: 'Découvrez les vernissages, expositions et événements artistiques près de chez vous',
};

export default function EventsPage() {
    return (
        <div className="relative w-full canvas-texture canvas-grain pb-24 selection:bg-accent selection:text-white overflow-hidden">

            {/* Formes abstraites et Blobs */}
            <AnimatedBlob className="top-[-5%] left-[-10%] w-[50vw] h-[50vw]" />
            <AnimatedBlob className="top-[20%] right-[-5%] w-[40vw] h-[60vw]" color="amber" delay />
            <AnimatedBlob className="bottom-[10%] left-[10%] w-[45vw] h-[40vw]" color="amber" delay />

            {/* FIGURES GÉOMÉTRIQUES ABSTRAITES (Type Kandinsky / Miro) */}
            <div className="absolute inset-0 z-[-10] pointer-events-none overflow-hidden">
                {/* Couches de peinture / Splashes */}
                <svg className="absolute top-[10%] left-[5%] w-[40vw] h-[40vw] text-accent/20 opacity-80 -z-20" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <path fill="currentColor" d="M44.7,-76.4C58.3,-69.2,70,-57.9,78.7,-44.5C87.4,-31.1,93.1,-15.5,91.3,-0.9C89.5,13.6,80.3,27.2,71.2,40.1C62.1,53,53.2,65.3,41.4,73.1C29.6,80.9,14.8,84.1,-0.7,85.2C-16.1,86.4,-32.3,85.5,-46.1,78.9C-59.9,72.3,-71.4,60,-79,45.8C-86.6,31.7,-90.4,15.8,-89.4,0.6C-88.3,-14.7,-82.5,-29.3,-74.1,-42.2C-65.7,-55.1,-54.7,-66.2,-41.7,-73.7C-28.7,-81.3,-14.4,-85.2,0.4,-85.9C15.2,-86.6,31.1,-83.7,44.7,-76.4Z" transform="translate(100 100)" />
                </svg>
                <svg className="absolute bottom-[20%] right-[-10%] w-[50vw] h-[50vw] text-amber-500/20 opacity-70 -z-20" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <path fill="currentColor" d="M38.1,-65.4C49.9,-58.4,60.5,-48.5,68.1,-36.4C75.7,-24.3,80.3,-10.1,79.1,3.4C77.9,16.9,70.9,29.8,61.8,40.4C52.7,51.1,41.5,59.5,29.4,64.8C17.3,70.1,4.3,72.3,-8.9,70.8C-22.1,69.3,-35.6,64.2,-47.1,56.1C-58.6,48,-68.1,36.9,-73.6,24C-79.1,11.2,-80.6,-3.4,-77.2,-17.1C-73.8,-30.8,-65.5,-43.6,-54.3,-51.1C-43.1,-58.6,-29,-60.8,-15.8,-64.5C-2.6,-68.2,10.3,-73.4,23.3,-72.1C36.3,-70.8,49.4,-63,38.1,-65.4Z" transform="translate(100 100)" />
                </svg>

                <svg className="absolute top-[15%] left-[-5%] w-[35vw] h-[35vw] text-foreground/10 opacity-70 transform -rotate-12" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <path fill="none" stroke="currentColor" strokeWidth="2" d="M10,190 Q90,10 190,190" strokeDasharray="8,12" strokeLinecap="round" />
                </svg>
                <svg className="absolute top-[5%] right-[10%] w-[20vw] h-[20vw] text-accent/30 opacity-80 animate-pulse" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="100 200" strokeLinecap="round" />
                </svg>
                <svg className="absolute top-[40%] right-[-10%] w-[25vw] h-[25vw] text-foreground/5 opacity-100 transform rotate-45" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <polygon fill="currentColor" points="120,0 20,200 200,90 0,90 180,200" />
                </svg>
                <svg className="absolute top-[60%] left-[5%] w-[15vw] h-[15vw] text-accent/20 opacity-80" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <line x1="0" y1="20" x2="100" y2="20" stroke="currentColor" strokeWidth="3" />
                    <line x1="0" y1="40" x2="100" y2="40" stroke="currentColor" strokeWidth="3" />
                    <line x1="0" y1="60" x2="100" y2="60" stroke="currentColor" strokeWidth="3" />
                </svg>
                <div className="absolute top-[75%] left-[8%] w-10 h-10 rounded-full border-2 border-accent opacity-60 bg-foreground/5"></div>
                <svg className="absolute bottom-[-10%] right-[15%] w-[30vw] h-[30vw] text-amber-500/10 opacity-80 transform -rotate-[30deg]" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <path fill="currentColor" d="M0,200 L200,200 L100,0 Z" />
                </svg>
            </div>

            {/* Hero section */}
            <section className="relative w-full min-h-[40vh] flex flex-col justify-center pt-32 lg:pt-40 px-6 sm:px-12 max-w-[1400px] mx-auto z-10">
                <div className="absolute top-1/2 right-0 -translate-y-1/2 font-serif text-[25rem] font-black text-foreground/[0.02] select-none pointer-events-none z-0">
                    É
                </div>

                <div className="relative z-10">
                    <p className="text-accent uppercase tracking-[0.4em] text-sm font-bold mb-4">
                        <span className="w-12 h-[1.5px] bg-accent inline-block mr-4 align-middle"></span>
                        Agenda Culturel
                    </p>
                    <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl font-light leading-[1.1] tracking-tighter mb-6">
                        Expositions &<br />
                        <span className="italic font-normal">Vernissages</span>
                    </h1>
                    <p className="text-xl text-foreground/60 max-w-2xl font-light">
                        Rencontrez les artistes, découvrez leurs nouvelles œuvres et vivez
                        l'art en direct lors de nos événements exclusifs.
                    </p>
                </div>
            </section>

            {/* Grille des événements */}
            <div className="max-w-[1400px] mx-auto px-6 sm:px-12 mt-12">
                <Suspense fallback={
                    <div className="flex justify-center items-center h-64">
                        <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                    </div>
                }>
                    <EventGrid />
                </Suspense>
            </div>
        </div>
    );
}