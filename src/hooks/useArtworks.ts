import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Artwork, FilterParams, PaginatedResponse } from "@/types/artwork";
import { MOCK_PAGINATED_RESPONSE } from "@/mocks/artworks";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export function useArtworks(filters: FilterParams) {
    return useQuery({
        queryKey: ["artworks", filters],
        queryFn: async () => {
            try {
                const { data } = await axios.get<PaginatedResponse<Artwork>>(`${API_BASE_URL}/public/artworks`, {
                    params: filters,
                });
                return data;
            } catch (error) {
                console.warn("API Error, using mock data", error);
                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 800));

                // Filter mock data locally for better visualization
                let filtered = [...MOCK_PAGINATED_RESPONSE.content];
                if (filters.search) {
                    const s = filters.search.toLowerCase();
                    filtered = filtered.filter(a =>
                        a.title.toLowerCase().includes(s) ||
                        a.artist.artistName.toLowerCase().includes(s)
                    );
                }
                if (filters.technique) {
                    filtered = filtered.filter(a => a.technique === filters.technique);
                }
                if (filters.style) {
                    filtered = filtered.filter(a => a.style === filters.style);
                }

                return {
                    ...MOCK_PAGINATED_RESPONSE,
                    content: filtered,
                    totalElements: filtered.length,
                };
            }
        },
    });
}
