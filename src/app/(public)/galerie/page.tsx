import { Metadata } from "next";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import GalerieClient from "./GalerieClient";
import { ArtworksService } from "@/lib/services/ArtworksService";

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

    const filters = {
        technique: (searchParams.technique as string) || undefined,
        style: (searchParams.style as string) || undefined,
        search: (searchParams.search as string) || undefined,
    };

    // Prefetch data for SSR/ISR to match useArtworks client hook exactly
    await queryClient.prefetchQuery({
        queryKey: ["artworks", filters, undefined],
        queryFn: async () => {
            if (filters.search) {
                const { GlobalSearchService } = await import("@/lib/services/GlobalSearchService");
                const results = await GlobalSearchService.globalSearch(filters.search);
                return results.artworks || [];
            }
            return await ArtworksService.getLatestArtworks();
        },
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <GalerieClient initialFilters={filters} />
        </HydrationBoundary>
    );
}
