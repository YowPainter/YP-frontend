import ArtworkCardSkeleton from "./ArtworkCardSkeleton";

export default function GallerySkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
            {[...Array(8)].map((_, i) => (
                <ArtworkCardSkeleton key={i} />
            ))}
        </div>
    );
}
