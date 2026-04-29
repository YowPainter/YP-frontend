"use client";

import { Skeleton } from "@/components/ui/Skeleton";

export default function ArtworkCardSkeleton() {
    return (
        <div className="flex flex-col h-full">
            {/* Container Image Skeleton */}
            <div className="relative aspect-square md:aspect-[3/4] overflow-hidden bg-foreground/5 art-frame mb-6 shimmer">
                {/* Artist Info Top Left Skeleton */}
                <div className="absolute top-4 left-4 z-20 flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-full py-1.5 pl-1.5 pr-4 border border-white/20">
                    <div className="w-8 h-8 rounded-full bg-white/20"></div>
                    <div className="h-2 w-16 bg-white/20 rounded"></div>
                </div>
            </div>

            {/* Details Skeleton */}
            <div className="flex flex-col gap-3 flex-1">
                <div className="flex justify-between items-start">
                    <Skeleton className="h-7 w-3/4 mb-1" />
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-10" />
                    </div>
                </div>

                {/* Technique/Style Row Skeleton */}
                <div className="mt-auto pt-4 flex items-center justify-between border-t border-foreground/5">
                    <Skeleton className="h-3 w-1/4" />
                    <div className="h-2 w-2 rounded-full bg-foreground/5"></div>
                    <Skeleton className="h-3 w-1/4" />
                </div>
            </div>
        </div>
    );
}
