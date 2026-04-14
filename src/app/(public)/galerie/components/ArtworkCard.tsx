"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, MessageSquare, ExternalLink } from "lucide-react";
import { Artwork } from "@/types/artwork";
import { useLikeArtwork } from "@/hooks/useLikeArtwork";
import { useState } from "react";
import { cn } from "@/lib/utils"; // I should create this utility

interface ArtworkCardProps {
    artwork: Artwork;
    isLoggedIn?: boolean;
}

export default function ArtworkCard({ artwork, isLoggedIn = false }: ArtworkCardProps) {
    const { mutate: toggleLike } = useLikeArtwork();
    const [isLiked, setIsLiked] = useState(false); // Local state for immediate feedback
    const [localLikes, setLocalLikes] = useState(artwork.likesCount);
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

    const handleLike = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isLoggedIn) {
            // Trigger modal or redirect to login (to be handled by parent or context)
            alert("Veuillez vous connecter pour liker cette œuvre.");
            return;
        }

        const newLikedState = !isLiked;
        setIsLiked(newLikedState);
        setLocalLikes(prev => newLikedState ? prev + 1 : prev - 1);

        toggleLike({ artworkId: artwork.id, liked: newLikedState });
    };

    const descriptionLimit = 80;
    const isLongDescription = artwork.description.length > descriptionLimit;
    const displayDescription = isDescriptionExpanded
        ? artwork.description
        : artwork.description.slice(0, descriptionLimit) + (isLongDescription ? "..." : "");

    return (
        <div className="group relative flex flex-col reveal h-full">
            {/* Container Image */}
            <div className="relative aspect-square md:aspect-[3/4] overflow-hidden bg-foreground/5 art-frame cursor-pointer mb-6">
                <Link
                    href={`/${artwork.artist.slug}/artworks/${artwork.id}`}
                    className="absolute inset-0"
                >
                    <Image
                        src={artwork.images[0] || "/images/placeholder.png"}
                        alt={artwork.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </Link>

                {/* Artist Info Top Left */}
                <Link
                    href={`/${artwork.artist.slug}`}
                    className="absolute top-4 left-4 z-20 flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-full py-1.5 pl-1.5 pr-4 border border-white/20 hover:bg-white/20 transition-all"
                >
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/40">
                        <Image
                            src={artwork.artist.avatar || "/images/placeholder.png"}
                            alt={artwork.artist.artistName}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest truncate max-w-[120px]">
                        {artwork.artist.artistName}
                    </span>
                </Link>

                {/* Badge En Vente - Top Right */}
                {artwork.price && (
                    <div className="absolute top-4 right-4 z-10">
                        <span className="bg-accent text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1 shadow-lg ring-1 ring-white/20">
                            En Vente
                        </span>
                    </div>
                )}

                {/* Overlay au survol */}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>

            {/* Détails */}
            <div className="flex flex-col gap-3 flex-1">
                <div className="flex justify-between items-start">
                    <Link href={`/${artwork.artist.slug}/artworks/${artwork.id}`} className="flex-1 mr-4">
                        <h3 className="font-serif text-2xl font-medium tracking-tight group-hover:text-accent transition-colors">
                            {artwork.title}
                        </h3>
                    </Link>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleLike}
                            className={cn(
                                "flex items-center gap-1.5 transition-all duration-300",
                                isLiked ? "text-accent" : "text-foreground/40 hover:text-accent"
                            )}
                        >
                            <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
                            <span className="text-xs font-bold">{localLikes}</span>
                        </button>
                        <div className="flex items-center gap-1.5 text-foreground/40">
                            <MessageSquare className="w-4 h-4" />
                            <span className="text-xs font-bold">{artwork.commentsCount}</span>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1">
                    <p className="text-sm text-foreground/60 font-light leading-relaxed">
                        {displayDescription}
                    </p>
                    {isLongDescription && (
                        <button
                            onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                            className="text-[10px] font-bold uppercase tracking-widest text-accent hover:text-foreground transition-colors text-left"
                        >
                            {isDescriptionExpanded ? "Voir moins" : "Voir plus"}
                        </button>
                    )}
                </div>

                {/* Bottom Row (Technique/Style) */}
                <div className="mt-auto pt-4 flex items-center justify-between border-t border-foreground/5 text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/30">
                    <span>{artwork.technique}</span>
                    <span className="text-accent/30">•</span>
                    <span>{artwork.style}</span>
                </div>
            </div>
        </div>
    );
}
