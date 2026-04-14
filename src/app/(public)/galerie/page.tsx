import { Metadata } from "next";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import axios from "axios";
import GalerieClient from "./GalerieClient";
import { Artwork, FilterParams, PaginatedResponse } from "@/types/artwork";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export const generateMetadata = async (): Promise<Metadata> => {
    return {
        title: "Galerie Publique | YowPainter",
        description: "Explorez l'ensemble des œuvres publiées par nos artistes sur YowPainter Gallery.",
        openGraph: {
            title: "Galerie Publique | YowPainter",
            description: "Explorez l'ensemble des œuvres publiées par nos artistes sur YowPainter Gallery.",
            images: ["/images/og-gallery.png"],
        },
    };
};

export default async function GaleriePage(
    props: {
        searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
    }
) {
    const searchParams = await props.searchParams;
    const queryClient = new QueryClient();

    const filters: FilterParams = {
        page: searchParams.page ? Number(searchParams.page) : 0,
        size: searchParams.size ? Number(searchParams.size) : 12,
        sort: (searchParams.sort as string) || "createdAt,desc",
        technique: (searchParams.technique as string) || undefined,
        style: (searchParams.style as string) || undefined,
        minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
        maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
        search: (searchParams.search as string) || undefined,
        forSale: searchParams.forSale === "true",
    };

    // Prefetch data for SSR/ISR
    await queryClient.prefetchQuery({
        queryKey: ["artworks", filters],
        queryFn: async () => {
            try {
                const { data } = await axios.get<PaginatedResponse<Artwork>>(`${API_BASE_URL}/public/artworks`, {
                    params: filters,
                });
                return data;
            } catch (error) {
                console.warn("Prefetch error, using mock data");
                const { MOCK_PAGINATED_RESPONSE } = await import("@/mocks/artworks");
                return MOCK_PAGINATED_RESPONSE;
            }
        },
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <GalerieClient initialFilters={filters} />
        </HydrationBoundary>
    );
}
