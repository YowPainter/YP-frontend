import ArtworkCardSkeleton from "./ArtworkCardSkeleton";

export default function GallerySkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[...Array(4)].map((_, i) => (
                <ArtworkCardSkeleton key={i} />
            ))}
        </div>
    );
}
