'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { EventResponse } from '@/lib/models/EventResponse';
import type { ArtistResponse } from '@/lib/models/ArtistResponse';

interface EventCardProps {
    event: EventResponse;
    variant?: 'grid' | 'featured';
    artistSlug?: string;
    artist?: ArtistResponse;
}

const ScissorsIcon = ({ className }: { className?: string }) => (
    <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <circle cx="6" cy="6" r="3" />
        <circle cx="6" cy="18" r="3" />
        <line x1="20" y1="4" x2="8.12" y2="15.88" />
        <line x1="14.47" y1="14.48" x2="20" y2="20" />
        <line x1="8.12" y1="8.12" x2="12" y2="12" />
    </svg>
);

const DottedLine = ({ className }: { className?: string }) => (
    <svg width="100%" height="2" className={className}>
        <line 
            x1="0" y1="1" x2="100%" y2="1" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeDasharray="1 6" 
            strokeLinecap="round" 
            opacity="0.3"
        />
    </svg>
);

/** Bandeau Artiste style LinkedIn — photo ronde + nom cliquable */
function ArtistBanner({ artist, className = '' }: { artist: ArtistResponse; className?: string }) {
    const displayName = artist.artistName || `${artist.firstName || ''} ${artist.lastName || ''}`.trim() || 'Artiste';
    const slug = artist.slug || 'artiste';

    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <Link
                href={`/${slug}`}
                onClick={(e) => e.stopPropagation()}
                className="shrink-0 relative w-8 h-8 rounded-full overflow-hidden border-2 border-foreground/10 hover:border-accent transition-colors"
            >
                {artist.profilePictureUrl ? (
                    <Image
                        src={artist.profilePictureUrl}
                        alt={displayName}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <span className="flex items-center justify-center w-full h-full bg-accent/10 text-accent text-[10px] font-bold uppercase">
                        {displayName.charAt(0)}
                    </span>
                )}
            </Link>
            <Link
                href={`/${slug}`}
                onClick={(e) => e.stopPropagation()}
                className="text-[11px] font-semibold text-foreground/70 hover:text-accent transition-colors truncate"
            >
                {displayName}
            </Link>
        </div>
    );
}

export function EventCard({ event, variant = 'grid', artistSlug, artist }: EventCardProps) {
    const [imgSrc, setImgSrc] = useState(event.posterUrl || '/images/placeholder.png');

    const formatDateShort = (dateStr?: string) => {
        if (!dateStr) return 'N/A';
        const date = new Date(dateStr);
        return new Intl.DateTimeFormat('fr-FR', {
            day: '2-digit',
            month: 'short',
        }).format(date).toUpperCase();
    };

    const isSoldOut = event.maxCapacity && event.reservedCount
        ? event.reservedCount >= event.maxCapacity
        : false;

    // Smart Linking: Utilise le slug artiste si disponible, sinon fallback sur artistId
    const tenantSlug = artist?.slug || artistSlug || event.artistId || 'gallery';
    const detailLink = `/${tenantSlug}/events/${event.id}`;

    // Masques CSS pour les trous "Billet"
    const topMask = {
        WebkitMaskImage: "radial-gradient(circle at bottom left, transparent 20px, black 21px), radial-gradient(circle at bottom right, transparent 20px, black 21px)",
        WebkitMaskSize: "51% 100%",
        WebkitMaskPosition: "left bottom, right bottom",
        WebkitMaskRepeat: "no-repeat",
    };
    
    const bottomMask = {
        WebkitMaskImage: "radial-gradient(circle at top left, transparent 20px, black 21px), radial-gradient(circle at top right, transparent 20px, black 21px)",
        WebkitMaskSize: "51% 100%",
        WebkitMaskPosition: "left top, right top",
        WebkitMaskRepeat: "no-repeat",
    };

    if (variant === 'featured') {
        return (
            <div className="group relative flex flex-col h-full bg-transparent hover:-translate-y-2 transition-all duration-500 will-change-transform drop-shadow-[0_15px_40px_rgba(0,0,0,0.12)]">
                {/* Main Link Overlay */}
                <Link 
                    href={detailLink} 
                    className="absolute inset-0 z-10" 
                    aria-label={`Voir les détails de ${event.name}`}
                />

                {/* Artist Banner — en-tête de la carte (Interactive, above overlay) */}
                {artist && (
                    <div className="relative z-20 px-6 py-3 bg-background border border-foreground/5 border-b-0 flex items-center gap-3">
                        <ArtistBanner artist={artist} />
                    </div>
                )}

                {/* TOP: Image & Title Layer */}
                <div style={topMask} className="relative z-0 w-full min-h-[500px] overflow-visible bg-background border border-foreground/5">
                    <div className="absolute inset-0 overflow-hidden">
                        <Image
                            src={imgSrc}
                            alt={event.name || ''}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 50vw"
                            className="object-cover group-hover:scale-110 transition-transform duration-[2s]"
                            onError={() => setImgSrc('https://images.unsplash.com/photo-1579710838505-4cfa69f0bd2c?w=800&q=80')}
                        />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-85 group-hover:opacity-95 transition-opacity duration-500" />
                    
                    <div className="absolute inset-x-0 bottom-0 px-10 pb-16 pt-20 flex flex-col items-center text-center text-white z-10 transition-transform duration-500 group-hover:-translate-y-2 pointer-events-none">
                        {/* Status Badge */}
                        <div className="absolute top-8 right-8">
                            <span className="px-5 py-2 text-[11px] uppercase tracking-[0.3em] font-bold bg-accent text-white border border-accent/20 shadow-lg">
                                {event.ticketPrice && event.ticketPrice > 0 ? `${event.ticketPrice.toLocaleString()} CFA` : 'GRATUIT'}
                            </span>
                        </div>

                        {isSoldOut && (
                            <div className="mb-6 inline-block bg-red-600 text-white px-4 py-1.5 text-[11px] uppercase tracking-[0.25em] font-bold w-max shadow-lg self-center">
                                COMPLET
                            </div>
                        )}

                        <h3 className="font-serif text-3xl md:text-5xl lg:text-6xl font-light mb-6 uppercase leading-[1.1] group-hover:text-accent transition-colors">
                            {event.name}
                        </h3>

                        {!artist && (
                            <p className="text-[11px] uppercase tracking-[0.4em] text-white/80 flex items-center justify-center gap-3">
                                <span className="w-8 h-[1px] bg-accent"></span>
                                ÉVÉNEMENT • <span className="font-bold text-white uppercase italic">{tenantSlug.replace('/', '')}</span>
                            </p>
                        )}
                    </div>
                </div>

                {/* MIDDLE: Perforated line with SCISSORS */}
                <div className="relative z-20 w-full flex items-center justify-center -my-[1px] pointer-events-none">
                    <div className="w-[calc(100%-60px)] flex items-center justify-center relative">
                        <DottedLine className="text-foreground/40" />
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-background p-1 translate-x-1/2 z-30">
                            <ScissorsIcon className="w-5 h-5 text-accent animate-pulse" />
                        </div>
                    </div>
                </div>

                {/* BOTTOM: Details area */}
                <div style={bottomMask} className="relative z-0 p-10 pb-12 pt-14 flex flex-col bg-background border border-foreground/5 pointer-events-none">
                    <div className="grid grid-cols-2 gap-8 font-mono text-sm text-foreground/80">
                        <div className="flex flex-col border-l-2 border-accent/20 pl-4">
                            <span className="text-[10px] text-foreground/40 mb-2 tracking-[0.3em] uppercase">DATE DE L&apos;ÉVÉNEMENT</span>
                            <span className="font-medium text-lg text-foreground tracking-tight">{formatDateShort(event.startDateTime)}</span>
                        </div>
                        <div className="flex flex-col text-right border-r-2 border-foreground/5 pr-4">
                            <span className="text-[10px] text-foreground/40 mb-2 tracking-[0.3em] uppercase">LIEU / VILLE</span>
                            <span className="font-medium text-lg text-foreground tracking-tight">{event.location?.split(',')[0]}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Grid Variant
    return (
        <div className="group relative flex flex-col h-full bg-transparent hover:-translate-y-2 transition-all duration-500 will-change-transform drop-shadow-[0_10px_25px_rgba(0,0,0,0.08)]">
            {/* Main Link Overlay */}
            <Link 
                href={detailLink} 
                className="absolute inset-0 z-10" 
                aria-label={`Voir les détails de ${event.name}`}
            />

            {/* Artist Banner — en-tête de la carte (Interactive, above overlay) */}
            {artist && (
                <div className="relative z-20 px-5 py-2.5 bg-background border border-foreground/5 border-b-0 flex items-center gap-3">
                    <ArtistBanner artist={artist} />
                </div>
            )}

            {/* TOP: Image */}
            <div style={topMask} className="relative z-0 w-full aspect-square overflow-hidden bg-background border border-foreground/5">
                <Image
                    src={imgSrc}
                    alt={event.name || ''}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-[1.5s] grayscale-[20%] group-hover:grayscale-0"
                    onError={() => setImgSrc('https://images.unsplash.com/photo-1579710838505-4cfa69f0bd2c?w=800&q=80')}
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                
                <div className="absolute top-4 right-4 z-10">
                    <span className="px-3 py-1.5 text-[9px] uppercase tracking-widest font-bold bg-accent text-white border border-white/10 backdrop-blur-md shadow-md">
                        {event.ticketPrice && event.ticketPrice > 0 ? `${event.ticketPrice.toLocaleString()} CFA` : 'GRATUIT'}
                    </span>
                </div>

                {isSoldOut && (
                    <div className="absolute inset-x-0 bottom-0 bg-red-600/90 backdrop-blur-sm text-white text-center py-2 text-[9px] uppercase tracking-[0.3em] font-bold shadow-inner z-10">
                        COMPLET
                    </div>
                )}
            </div>

            {/* MIDDLE: Perforated line with SCISSORS */}
            <div className="relative z-20 w-full flex items-center justify-center -my-[1px] pointer-events-none">
                <div className="w-[calc(100%-48px)] flex items-center justify-center relative">
                    <DottedLine className="text-foreground/30" />
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-background p-1 translate-x-1/2 z-30">
                        <ScissorsIcon className="w-4 h-4 text-accent" />
                    </div>
                </div>
            </div>

            {/* BOTTOM: Text */}
            <div style={bottomMask} className="relative z-0 px-8 pb-10 pt-12 flex flex-col items-center text-center flex-grow bg-background border border-foreground/5 pointer-events-none">
                <div className="mb-6 flex-grow">
                    <h3 className="font-serif text-xl font-medium leading-[1.3] group-hover:text-accent transition-colors uppercase tracking-tight">
                        {event.name}
                    </h3>
                    {!artist && (
                        <p className="text-[9px] uppercase tracking-[0.3em] text-foreground/40 mt-5 flex items-center justify-center gap-2">
                            <span className="w-4 h-[1px] bg-accent"></span>
                            <span className="font-bold text-foreground/70 uppercase">{tenantSlug.replace('/', '')}</span>
                        </p>
                    )}
                </div>

                <div className="mt-auto grid grid-cols-2 gap-4 pb-2 w-full">
                    <div className="flex flex-col border-l border-foreground/10 pl-3">
                        <span className="text-[8px] uppercase tracking-widest text-foreground/30 mb-1">DATE</span>
                        <span className="text-[12px] font-medium font-mono text-foreground">{formatDateShort(event.startDateTime)}</span>
                    </div>
                    <div className="flex flex-col text-right border-r border-foreground/10 pr-3">
                        <span className="text-[8px] uppercase tracking-widest text-foreground/30 mb-1">LIEU</span>
                        <span className="text-[12px] font-medium font-mono text-foreground truncate">{event.location?.split(',')[0]}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}