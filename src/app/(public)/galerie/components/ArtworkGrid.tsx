"use client";

import type { GalleryArtwork } from "@/lib/services/ArtworksService";
import ArtworkCard from "./ArtworkCard";
import GallerySkeleton from "./GallerySkeleton";

interface ArtworkGridProps {
    artworks: GalleryArtwork[];
    isLoading: boolean;
    isLoggedIn?: boolean;
}

export default function ArtworkGrid({ artworks, isLoading, isLoggedIn }: ArtworkGridProps) {
    if (isLoading) {
        return <GallerySkeleton />;
    }

    if (artworks.length === 0) {
        return (
            <div className="w-full py-20 flex flex-col items-center justify-center text-center reveal">
                <div className="w-20 h-20 rounded-full border border-foreground/5 flex items-center justify-center mb-6">
                    <span className="text-4xl text-foreground/10 font-serif">?</span>
                </div>
                <h3 className="font-serif text-3xl mb-4">Aucune œuvre trouvée</h3>
                <p className="text-foreground/40 max-w-sm">
                    Nous n&apos;avons pas trouvé de pépites correspondant à vos critères. Essayez d&apos;ajuster vos filtres.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 xl:gap-10">
            {artworks.map((artwork) => (
                <ArtworkCard
                    key={artwork.id}
                    artwork={artwork}
                    isLoggedIn={isLoggedIn}
                />
            ))}
        </div>
    );
}
