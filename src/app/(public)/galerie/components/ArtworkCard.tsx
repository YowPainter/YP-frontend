"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, Heart, MessageCircle, SendHorizonal } from "lucide-react";
import type { GalleryArtwork } from "@/lib/services/ArtworksService";
import { useLikeArtwork } from "@/hooks/useLikeArtwork";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ArtworkCardProps {
    artwork: GalleryArtwork;
    isLoggedIn?: boolean;
}

const isValidImageSrc = (value?: string) => {
    if (!value) return false;

    try {
        const url = new URL(value);
        const allowedHosts = new Set([
            "res.cloudinary.com",
            "images.unsplash.com",
        ]);

        const hasImageExtension = /\.(jpg|jpeg|png|webp|gif|avif|svg)$/i.test(url.pathname);
        return allowedHosts.has(url.hostname) || hasImageExtension;
    } catch {
        return value.startsWith("/");
    }
};

const formatArtworkDate = (value?: string) => {
    if (!value) return "Date inconnue";

    return new Date(value).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

const getArtistInitial = (name?: string) => {
    const trimmed = name?.trim();
    return trimmed ? trimmed.charAt(0).toUpperCase() : "A";
};

export default function ArtworkCard({ artwork, isLoggedIn = false }: ArtworkCardProps) {
    const { mutate: toggleLike } = useLikeArtwork();
    const [isLiked, setIsLiked] = useState(false);
    const [localLikes, setLocalLikes] = useState(artwork.likeCount || 0);
    const [comment, setComment] = useState("");

    const handleLike = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isLoggedIn) {
            alert("Veuillez vous connecter pour liker cette œuvre.");
            return;
        }

        if (!artwork.id || !artwork.artistSlug) {
            return;
        }

        const newLikedState = !isLiked;
        setIsLiked(newLikedState);
        setLocalLikes((prev) => (newLikedState ? prev + 1 : Math.max(prev - 1, 0)));
        toggleLike({ artworkId: artwork.id, artistSlug: artwork.artistSlug });
    };

    const description = artwork.description || "";
    const artistPath = artwork.artistSlug ? `/${artwork.artistSlug}` : "/galerie";
    const detailPath = artwork.artistSlug && artwork.id
        ? `${artistPath}/gallery/${artwork.id}`
        : artistPath;

    const primaryArtworkImage = artwork.imageUrls?.[0];
    const artworkImageSrc: string =
        primaryArtworkImage && isValidImageSrc(primaryArtworkImage)
            ? primaryArtworkImage
            : "/images/placeholder.png";

    const artistProfileImage = artwork.artistProfilePictureUrl;
    const artistImageSrc: string =
        artistProfileImage && isValidImageSrc(artistProfileImage)
            ? artistProfileImage
            : "/images/avatar-placeholder.png";

    const hasArtistPhoto = artistImageSrc !== "/images/avatar-placeholder.png";
    const publishedLabel = formatArtworkDate(artwork.publishedAt || artwork.createdAt);
    const hasDescription = description.trim().length > 0;

    return (
        <article className="group flex relative h-full flex-col overflow-hidden border border-white/10 bg-[#f7f2ea] text-[#1f1a17] shadow-[0_2px_10px_rgba(0,0,0,0.05)] transition-transform duration-300 hover:-translate-y-1">
            {/* Header */}
            <div className="flex items-center gap-3 px-4 pt-4 pb-2">
                <Link href={artistPath} className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-black/10 bg-black/5">
                    {hasArtistPhoto ? (
                        <Image
                            src={artistImageSrc}
                            alt={artwork.artistName || "Unknown Artist"}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <span className="font-semibold text-sm text-black/60">
                            {getArtistInitial(artwork.artistName)}
                        </span>
                    )}
                </Link>

                <div className="min-w-0 flex-1">
                    <Link href={artistPath} className="block truncate text-[15px] font-semibold hover:text-accent transition-colors leading-tight">
                        {artwork.artistName || "Unknown Artist"}
                    </Link>
                    <p className="text-xs text-black/50 mt-0.5">
                        {publishedLabel}
                    </p>
                </div>
            </div>

            {/* Description */}
            <div className="px-4 pb-3 pt-1">
                <p className="text-[14px] leading-relaxed text-black/90 line-clamp-3">
                    {artwork.title && <strong className="font-semibold">{artwork.title}</strong>}
                    {artwork.title && hasDescription && " — "}
                    {hasDescription ? description : "Aucune description fournie pour cette œuvre."}
                </p>
            </div>

            {/* Image */}
            <Link href={detailPath} className="relative block w-full bg-black/5 aspect-square sm:aspect-[4/5] object-cover">
                <Image
                    src={artworkImageSrc}
                    alt={artwork.title || "Untitled"}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                />
            </Link>

            {/* Footer / Interaction */}
            <div className="flex flex-col px-4 py-3 bg-[#f7f2ea]">
                {/* Stats */}
                <div className="mb-2 flex items-center justify-between text-xs text-black/50">
                    <div className="flex gap-3">
                        <span>{localLikes} mentions J&apos;aime</span>
                        <span>•</span>
                        <span>{artwork.viewCount || 0} vues</span>
                    </div>
                    {artwork.status === "ON_SALE" && (
                        <span className="font-semibold text-accent">
                            En vente
                        </span>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between border-b border-t border-black/6 py-1 text-[13px] font-medium text-black/60">
                    <button
                        onClick={handleLike}
                        disabled={!artwork.artistSlug}
                        className={cn(
                            "flex flex-1 items-center justify-center gap-2 rounded-sm py-2 transition-colors hover:bg-black/5",
                            isLiked ? "text-accent" : "hover:text-black/80",
                            !artwork.artistSlug && "cursor-not-allowed opacity-50"
                        )}
                    >
                        <Heart className={cn("h-[18px] w-[18px]", isLiked && "fill-current")} />
                        <span>J&apos;aime</span>
                    </button>
                    <Link
                        href={detailPath}
                        className="flex flex-1 items-center justify-center gap-2 rounded-sm py-2 transition-colors hover:bg-black/5 hover:text-black/80"
                    >
                        <MessageCircle className="h-[18px] w-[18px]" />
                        <span>Commenter</span>
                    </Link>
                    <Link
                        href={detailPath}
                        className="flex flex-1 items-center justify-center gap-2 rounded-sm py-2 transition-colors hover:bg-black/5 hover:text-black/80"
                    >
                        <Eye className="h-[18px] w-[18px]" />
                        <span>Voir</span>
                    </Link>
                </div>

                {/* Comment Input */}
                <div className="mt-3 flex items-center gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/5 text-xs font-semibold text-black/60">
                        {getArtistInitial(artwork.artistName)}
                    </div>
                    <div className="flex flex-1 items-center rounded-full bg-white border border-black/10 px-3 py-1.5 focus-within:ring-1 focus-within:ring-black/20 transition-all shadow-sm">
                        <input
                            type="text"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Ajouter un commentaire..."
                            className="w-full bg-transparent text-[13px] text-black/80 outline-none placeholder:text-black/40"
                        />
                        <button
                            type="button"
                            className="ml-2 flex items-center justify-center text-black/40 transition-colors hover:text-accent"
                            aria-label="Envoyer un commentaire"
                        >
                            <SendHorizonal className="h-[16px] w-[16px]" />
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
}
