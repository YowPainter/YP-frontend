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

            {/* Formes abstraites */}
            <AnimatedBlob className="top-[-5%] left-[-10%] w-[50vw] h-[50vw]" />
            <AnimatedBlob className="top-[20%] right-[-5%] w-[40vw] h-[60vw]" color="amber" delay />

            {/* Hero section */}
            <section className="relative w-full min-h-[40vh] flex flex-col justify-center pt-16 px-6 sm:px-12 max-w-[1400px] mx-auto z-10">
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