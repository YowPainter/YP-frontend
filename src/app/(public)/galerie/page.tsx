import { Metadata } from "next";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import GalerieClient from "./GalerieClient";
import { fetchArtworks } from "@/hooks/useArtworks";
import type { FilterParams } from "@/types/artwork";

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
    technique: (searchParams.technique as string) || undefined,
    style: (searchParams.style as string) || undefined,
    search: (searchParams.search as string) || undefined,
    forSale:
        searchParams.forSale !== undefined
            ? searchParams.forSale === "true"
            : undefined,
};

    await queryClient.prefetchQuery({
        queryKey: ["artworks", filters],
        queryFn: () => fetchArtworks(filters),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <GalerieClient initialFilters={filters} />
        </HydrationBoundary>
    );
}
