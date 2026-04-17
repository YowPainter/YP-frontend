import { useQuery } from "@tanstack/react-query";
import { ArtworksService } from "@/lib/services/ArtworksService";
import { GlobalSearchService } from "@/lib/services/GlobalSearchService";
import type { ArtworkResponse } from "@/lib/models/ArtworkResponse";

export interface FilterParams {
    technique?: string;
    style?: string;
    search?: string;
}

export function useArtworks(filters: FilterParams, artistSlug?: string) {
    return useQuery({
        queryKey: ["artworks", filters, artistSlug],
        queryFn: async (): Promise<Array<ArtworkResponse>> => {
            if (artistSlug) {
                // Fetch for specific artist shop
                if (filters.search) {
                    return await ArtworksService.searchArtworks(artistSlug, filters.search);
                }
                return await ArtworksService.getAllPublicArtworks(artistSlug);
            } else {
                // Global search or featured
                if (filters.search) {
                    const results = await GlobalSearchService.globalSearch(filters.search);
                    return results.artworks || [];
                }
                return await ArtworksService.getLatestArtworks();
            }
        },
    });
}
