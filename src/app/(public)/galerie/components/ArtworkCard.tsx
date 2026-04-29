"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, Heart } from "lucide-react";
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
        setLocalLikes(prev => newLikedState ? prev + 1 : Math.max(prev - 1, 0));
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
    const hasArtistPhoto = artistImageSrc !== "/images/placeholder.png";
    const publishedLabel = formatArtworkDate(artwork.publishedAt || artwork.createdAt);
    const hasDescription = description.trim().length > 0;

    return (
        <article className="group flex h-full flex-col overflow-hidden border border-white/10 bg-[#f7f2ea] text-[#1f1a17] shadow-[0_20px_50px_rgba(0,0,0,0.18)] transition-transform duration-300 hover:-translate-y-1">
            <div className="flex items-start gap-3 border-b border-black/6 px-5 py-4">
                <Link href={artistPath} className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-black/10 bg-black/5">
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
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <Link href={artistPath} className="block truncate text-sm font-semibold hover:text-accent transition-colors">
                                {artwork.artistName || "Unknown Artist"}
                            </Link>
                            <p className="mt-0.5 text-xs text-black/50">
                                Artiste · {publishedLabel}
                            </p>
                        </div>
                        {artwork.status === "ON_SALE" && (
                            <span className="shrink-0 rounded-full bg-accent/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
                                En vente
                            </span>
                        )}
                    </div>
                    <Link href={detailPath} className="mt-2 block">
                        <h3 className="font-serif text-[30px] leading-none tracking-tight transition-colors group-hover:text-accent">
                            {artwork.title || "Untitled"}
                        </h3>
                    </Link>
                </div>
            </div>

            <div className="px-5 pt-4">
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-black/45">
                    Publication artistique
                </p>
                <p className="text-sm leading-relaxed text-black/75">
                    {hasDescription ? description : "Aucune description fournie pour cette œuvre."}
                </p>
            </div>

            <Link href={detailPath} className="relative mt-4 mx-5 block aspect-[1.12/1] overflow-hidden border border-black/6 bg-black/5">
                <Image
                    src={artworkImageSrc}
                    alt={artwork.title || "Untitled"}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                />
            </Link>

            <div className="flex flex-1 flex-col px-5 pb-4 pt-4">
                <div className="mb-4 flex items-center justify-between text-xs text-black/45">
                    <span>{localLikes} mentions J&apos;aime</span>
                    <span>{artwork.viewCount || 0} vues</span>
                </div>

                <div className="flex flex-wrap items-center gap-2 border-b border-black/6 pb-4">
                    <span className="rounded-full bg-black/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-black/60">
                        {artwork.technique || "Technique"}
                    </span>
                    <span className="rounded-full bg-black/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-black/60">
                        {artwork.style || "Style"}
                    </span>
                    {artwork.dimensions && artwork.dimensions !== "string" && (
                        <span className="rounded-full bg-black/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-black/60">
                            {artwork.dimensions}
                        </span>
                    )}
                </div>

                <div className="mt-4 flex items-center justify-between text-sm text-black/55">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleLike}
                            disabled={!artwork.artistSlug}
                            className={cn(
                                "flex items-center gap-1.5 transition-colors",
                                isLiked ? "text-accent" : "hover:text-accent",
                                !artwork.artistSlug && "cursor-not-allowed opacity-50"
                            )}
                        >
                            <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
                            <span>{localLikes}</span>
                        </button>
                        <span className="flex items-center gap-1.5">
                            <Eye className="h-4 w-4" />
                            {artwork.viewCount || 0}
                        </span>
                    </div>
                    <Link
                        href={detailPath}
                        className="text-xs font-bold uppercase tracking-[0.18em] text-accent transition-colors hover:text-[#9c5646]"
                    >
                        Voir l&apos;œuvre
                    </Link>
                </div>
            </div>
        </article>
    );
}
