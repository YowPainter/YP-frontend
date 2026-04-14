export default function GallerySkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
            {[...Array(8)].map((_, i) => (
                <div key={i} className="flex flex-col gap-6 animate-pulse">
                    <div className="aspect-square md:aspect-[3/4] bg-foreground/5 rounded-sm"></div>
                    <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                            <div className="h-6 w-2/3 bg-foreground/5 rounded"></div>
                            <div className="h-4 w-12 bg-foreground/5 rounded"></div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="h-4 w-1/3 bg-foreground/5 rounded"></div>
                            <div className="h-5 w-20 bg-foreground/5 rounded"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
