"use client";

import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from "@tanstack/react-query";
import { useState } from "react";
import { initializeApi } from "@/lib/apiInit";
import { toast } from "@/lib/toast";

export function QueryProvider({ children }: { children: React.ReactNode }) {
    initializeApi();

    const [queryClient] = useState(
        () =>
            new QueryClient({
                queryCache: new QueryCache({
                    onError: (error, query) => {
                        // Avoid showing global toast if meta explicitly suppresses it, or if it's a 404
                        // since 404s might be expected in some queries (like checking if profile exists)
                        if (query.meta?.suppressError) return;
                        
                        const status = (error as any)?.status;
                        if (status === 404) return;
                        
                        toast.error(error);
                    },
                }),
                mutationCache: new MutationCache({
                    onError: (error, _variables, _context, mutation) => {
                        if (mutation.meta?.suppressError) return;
                        toast.error(error);
                    },
                }),
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000,
                        retry: 1,
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
