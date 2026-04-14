import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export function useLikeArtwork() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ artworkId, liked }: { artworkId: string; liked: boolean }) => {
            if (liked) {
                await axios.post(`${API_BASE_URL}/artworks/${artworkId}/like`);
            } else {
                await axios.delete(`${API_BASE_URL}/artworks/${artworkId}/like`);
            }
        },
        onSuccess: () => {
            // Invalidate queries to refresh the likesCount
            queryClient.invalidateQueries({ queryKey: ["artworks"] });
        },
    });
}
