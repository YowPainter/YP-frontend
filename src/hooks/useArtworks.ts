import { useQuery } from "@tanstack/react-query";
import {
    getGalleryArtworks,
    type GalleryArtwork,
    type GalleryViewerContext,
} from "@/lib/services/ArtworksService";
import type { FilterParams } from "@/types/artwork";

export async function fetchArtworks(
    filters: FilterParams,
    artistSlug?: string,
    viewer?: GalleryViewerContext,
): Promise<Array<GalleryArtwork>> {
    console.log("Filters sent:", filters);
    return getGalleryArtworks(filters, artistSlug, viewer);
}

export function useArtworks(filters: FilterParams, artistSlug?: string, viewer?: GalleryViewerContext) {
    return useQuery({
        queryKey: ["artworks", filters, artistSlug, viewer?.role, viewer?.artistSlug],
        queryFn: () => fetchArtworks(filters, artistSlug, viewer),
    });
}
