import { useQuery } from "@tanstack/react-query";
import { ArtworksService } from "@/lib/services/ArtworksService";
import type { ArtworkResponse } from "@/lib/models/ArtworkResponse";

export interface FilterParams {
    technique?: string;
    style?: string;
    search?: string;
}

export function useArtworks(filters: FilterParams, artistSlug?: string) {
    return useQuery({
        queryKey: ["artworks", filters, artistSlug],
        queryFn: async () => {
            if (artistSlug) {
                // Fetch for specific artist shop
                if (filters.search) {
                    return await ArtworksService.searchArtworks(artistSlug, filters.search);
                }
                return await ArtworksService.getAllPublicArtworks(artistSlug);
            } else {
                // Global search or featured
                // Fallback to featured for now if no filters, or use search if q provided
                if (filters.search) {
                    // For now GlobalSearchService might be better, but let's use searchArtworks with a generic slug or similar if backend supports it.
                    // Actually, let's use getFeatured if no search is provided.
                    return await ArtworksService.getFeatured();
                }
                return await ArtworksService.getFeatured();
            }
        },
    });
}
