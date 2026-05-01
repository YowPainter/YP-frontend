"use client";

export default function ArtworkCardSkeleton() {
    return (
        <article className="bg-background border border-foreground/8 rounded-2xl overflow-hidden shadow-sm flex flex-col shimmer">
            
            {/* Header: Profil */}
            <div className="px-5 pt-5 pb-4 flex items-center gap-3 shrink-0">
                <div className="w-11 h-11 rounded-full bg-foreground/10 shrink-0"></div>
                <div className="flex-1 min-w-0 flex flex-col gap-2">
                    <div className="h-4 w-32 bg-foreground/10 rounded"></div>
                    <div className="h-3 w-20 bg-foreground/5 rounded"></div>
                </div>
            </div>

            {/* Body: Texte */}
            <div className="px-5 pb-4 flex flex-col gap-3 shrink-0">
                <div className="h-6 w-3/4 bg-foreground/10 rounded"></div>
                <div className="h-4 w-full bg-foreground/5 rounded"></div>
                <div className="h-4 w-5/6 bg-foreground/5 rounded"></div>
                
                {/* Tags */}
                <div className="flex gap-2 mt-2">
                    <div className="h-5 w-16 bg-foreground/5 rounded-full"></div>
                    <div className="h-5 w-20 bg-foreground/5 rounded-full"></div>
                </div>
            </div>

            {/* Image */}
            <div className="px-4 pb-3">
                <div className="w-full aspect-[4/3] rounded-xl bg-foreground/5"></div>
            </div>

            {/* Footer: Actions */}
            <div className="px-5 py-3 flex items-center gap-6 border-t border-foreground/5">
                <div className="h-8 w-16 bg-foreground/5 rounded-full"></div>
                <div className="h-8 w-16 bg-foreground/5 rounded-full"></div>
                <div className="h-8 w-16 bg-foreground/5 rounded-full ml-auto"></div>
            </div>
            
        </article>
    );
}
