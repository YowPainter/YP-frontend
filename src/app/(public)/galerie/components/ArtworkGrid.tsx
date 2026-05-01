"use client";

import { useQuery } from "@tanstack/react-query";
import type { GalleryArtwork } from "@/lib/services/ArtworksService";
import ArtworkPost from "@/components/artdashboard/ArtworkPost";
import GallerySkeleton from "./GallerySkeleton";
import type { Work } from "@/components/artdashboard/types";
import { ArtistsService } from "@/lib/services/ArtistsService";
import type { ArtistResponse } from "@/lib/models/ArtistResponse";
import { ArtworkResponse } from "@/lib";

const GRADIENTS = [
    'linear-gradient(135deg,#e8c4a0,#c8804a)',
    'linear-gradient(135deg,#a8c4d0,#5888a8)',
    'linear-gradient(135deg,#d4c4b8,#9a7060)',
    'linear-gradient(135deg,#c8d4a0,#7a9850)',
    'linear-gradient(135deg,#dcc8e0,#9870a8)',
]

interface ArtworkGridProps {
    artworks: GalleryArtwork[];
    isLoading: boolean;
    isLoggedIn?: boolean;
}

/* ── Carte individuelle ── */
function ArtworkPostWithArtist({ artwork, index, artistData }: { artwork: ArtworkResponse; index: number; artistData?: ArtistResponse }) {

    const work: Work = {
        id: artwork.id!,
        title: artwork.title!,
        type: artwork.imageUrls && artwork.imageUrls.length > 0 ? 'image' : 'video',
        bg: GRADIENTS[index % GRADIENTS.length],
        likes: artwork.likeCount || 0,
        comments: 0,
        shares: 0,
        date: artwork.publishedAt
            ? new Date(artwork.publishedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
            : '',
        desc: artwork.description || '',
        tags: artwork.tags || [],
        imageUrls: artwork.imageUrls || [],
        // pas de status → pas de badge
    }

    const displayName = artistData?.artistName
        || `${artistData?.firstName ?? ''} ${artistData?.lastName ?? ''}`.trim()
        || artwork.artistName
        || 'Artiste'

    return (
        <ArtworkPost
            key={work.id}
            work={work}
            inlineComments
            artist={{
                name: displayName,
                avatar: artistData?.profilePictureUrl || undefined,
                username: artistData?.email?.split('@')[0] || undefined,
                slug: artistData?.slug || undefined,
            }}
        />
    )
}

export default function ArtworkGrid({ artworks, isLoading }: ArtworkGridProps) {
    const uniqueArtistIds = Array.from(
        new Set(artworks.map((a) => a.artistId).filter(Boolean))
    ) as string[];

    const { data: artistsMap, isLoading: isArtistsLoading } = useQuery({
        queryKey: ['grid-artists', uniqueArtistIds],
        queryFn: async () => {
            const map = new Map<string, ArtistResponse>();
            const results = await Promise.allSettled(
                uniqueArtistIds.map((id) => ArtistsService.getArtistById(id))
            );
            results.forEach((result, index) => {
                if (result.status === 'fulfilled') {
                    map.set(uniqueArtistIds[index], result.value);
                }
            });
            return map;
        },
        enabled: uniqueArtistIds.length > 0,
        staleTime: 5 * 60 * 1000, // 5 min cache
    });

    if (isLoading || (uniqueArtistIds.length > 0 && isArtistsLoading)) {
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 reveal">
            {artworks.map((artwork, index) => (
                <ArtworkPostWithArtist 
                    key={artwork.id} 
                    artwork={artwork} 
                    index={index} 
                    artistData={artwork.artistId ? artistsMap?.get(artwork.artistId) : undefined} 
                />
            ))}
        </div>
    );
}
