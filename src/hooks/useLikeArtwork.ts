import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArtworksService } from "@/lib/services/ArtworksService";
import { toast } from "@/lib/toast";

export function useLikeArtwork() {
    const queryClient = useQueryClient();

    return useMutation({
        meta: { suppressError: true },
        mutationFn: async ({ artistSlug, artworkId }: { artistSlug: string; artworkId: string }) => {
            await ArtworksService.toggleLike(artistSlug, artworkId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["artworks"] });
        },
        onError: (err) => {
            toast.error(err, 'Action like');
        },
    });
}
