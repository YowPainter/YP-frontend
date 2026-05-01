"use client";

import Image from "next/image";
import Link from "next/link";
import ShopArticleCard from "@/components/shop/ShopArticleCard";
import { AnimatedBlob } from "@/components/ui/AnimatedBlob";
import { useQuery } from "@tanstack/react-query";
import { ArtworksService } from "@/lib/services/ArtworksService";
import { ShopOrdersService } from "@/lib/services/ShopOrdersService";
import { ArtistsService } from "@/lib/services/ArtistsService";
import { Skeleton } from "@/components/ui/Skeleton";
import { Pagination } from "@/components/ui/Pagination";
import { useState } from "react";
import type { ArtistResponse } from "@/lib/models/ArtistResponse";
import type { ArtworkResponse } from "@/lib/models/ArtworkResponse";

export default function ShopIndexPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  // 1. Fetch Global Products
  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["shop-global-products"],
    queryFn: () => ShopOrdersService.getGlobalProducts(),
  });

  const paginatedProducts = products ? products.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE) : [];
  const totalPages = products ? Math.ceil(products.length / ITEMS_PER_PAGE) : 0;

  // 2. Batch Fetch Artist Info & Artworks
  const artistIds = Array.from(new Set(products?.map(p => p.artistId).filter(Boolean))) as string[];
  const artworkIds = Array.from(new Set(products?.map(p => p.artworkId).filter(Boolean))) as string[];

  const { data: artistsMap, isLoading: isLoadingArtists } = useQuery({
    queryKey: ["shop-artists", artistIds],
    queryFn: async () => {
      const map = new Map<string, ArtistResponse>();
      const results = await Promise.allSettled(artistIds.map(id => ArtistsService.getArtistById(id)));
      results.forEach((res, i) => {
        if (res.status === 'fulfilled') map.set(artistIds[i], res.value);
      });
      return map;
    },
    enabled: artistIds.length > 0,
  });

  const { data: artworksMap, isLoading: isLoadingArtworks } = useQuery({
    queryKey: ["shop-artworks", artworkIds],
    queryFn: async () => {
      const map = new Map<string, ArtworkResponse>();
      // Pour chaque artworkId, on tente de le récupérer. 
      // Note: On utilise un pattern de batching avec Promise.allSettled.
      // Comme on n'a pas getArtworkById(id) sans slug, on va utiliser getLatestArtworks 
      // et filtrer, ou espérer que l'API nous donne un moyen.
      // Ici, on va faire un petit hack: on récupère les dernières oeuvres globales et on les mappe.
      const latest = await ArtworksService.getLatestArtworks();
      latest.forEach(art => {
        if (art.id && artworkIds.includes(art.id)) map.set(art.id, art);
      });
      return map;
    },
    enabled: artworkIds.length > 0,
  });

  const isLoading = isLoadingProducts || (artistIds.length > 0 && isLoadingArtists) || (artworkIds.length > 0 && isLoadingArtworks);

  return (
    <div className="mx-auto w-full max-w-[1400px] px-6 sm:px-12 pt-32 pb-24 canvas-texture canvas-grain relative overflow-hidden">
      
      {/* Backgrounds */}
      <div className="absolute inset-0 z-[-5] pointer-events-none">
        <AnimatedBlob className="top-[-5%] right-[-10%] w-[40vw] h-[40vw]" color="accent" opacity={0.1} />
        <AnimatedBlob className="bottom-[10%] left-[5%] w-[30vw] h-[30vw]" color="amber" opacity={0.05} delay />
      </div>

      {/* Hero Section: Artistique & Épuré */}
      <section className="relative w-full min-h-[40vh] flex flex-col justify-center mb-24 reveal">
        
        {/* Lettrine Géante en Arrière-plan (Esprit du site) */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-16 font-serif text-[30rem] font-black text-foreground/[0.02] select-none pointer-events-none z-0 leading-none">
          S
        </div>

        <div className="relative z-10 max-w-4xl">
          <div className="flex items-center gap-6 mb-10">
            <span className="w-16 h-[1px] bg-accent"></span>
            <p className="text-[10px] uppercase tracking-[0.5em] font-black text-accent">
              YowPainter Fine Art Store
            </p>
          </div>
          
          <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl font-light leading-[0.9] tracking-tighter mb-8">
            Le goût de <br />
            <span className="italic font-normal text-accent relative">
              l'exceptionnel.
            </span>
          </h1>
        </div>
      </section>

      <div className="mb-16 flex flex-col md:flex-row justify-between items-end gap-10 border-b border-foreground/5 pb-12">
        <div className="max-w-md">
          <h2 className="font-serif text-5xl tracking-tighter mb-4">La Sélection</h2>
          <p className="text-foreground/30 font-light text-lg">Explorez les créations de nos artistes partenaires.</p>
        </div>
        
        {/* Filtre Raffiné */}
        <div className="flex items-center gap-8">
           <span className="text-[10px] uppercase tracking-[0.4em] font-black text-foreground/20">Trier par</span>
           <button className="text-[10px] uppercase tracking-[0.3em] font-bold text-foreground hover:text-accent transition-colors border-b border-foreground/20 pb-1">
             Pertinence
           </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i}>
              <Skeleton className="aspect-[4/5] rounded-2xl mb-4" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {paginatedProducts.map((product) => {
            const artist = product.artistId ? artistsMap?.get(product.artistId) : undefined;
            const artwork = product.artworkId ? artworksMap?.get(product.artworkId) : undefined;
            return (
              <ShopArticleCard 
                key={product.id} 
                product={product} 
                artwork={artwork}
                artist={artist ? {
                  name: artist.artistName || `${artist.firstName} ${artist.lastName}`.trim(),
                  avatar: artist.profilePictureUrl,
                  username: artist.email?.split('@')[0],
                  slug: artist.slug
                } : undefined}
              />
            );
          })}
        </section>
      )}

      {!isLoadingProducts && totalPages > 1 && (
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(p) => {
            setCurrentPage(p);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="mt-20"
        />
      )}

      {products?.length === 0 && !isLoadingProducts && (
        <div className="py-24 text-center border border-dashed border-foreground/10 rounded-[3rem]">
          <p className="text-foreground/40 italic">Aucun article n'est disponible pour le moment.</p>
        </div>
      )}
    </div>
  );
}


