import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArtworksService } from "@/lib/services/ArtworksService";

export function useLikeArtwork() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ artworkId, artistSlug }: { artworkId: string; artistSlug: string }) => {
            await ArtworksService.toggleLike(artistSlug, artworkId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["artworks"] });
            queryClient.invalidateQueries({ queryKey: ["artwork-detail"] });
        },
        // onError: (err) => {
        //     toast.error(err, 'Action like');
        // },
    });
}
