"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useArtworks } from "@/hooks/useArtworks";
import ArtworkGrid from "./components/ArtworkGrid";
import FilterSidebar from "./components/FilterSidebar";
import SearchBar from "./components/SearchBar";
import { ChevronRight, Filter } from "lucide-react";
import { Pagination } from "@/components/ui/Pagination";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import type { FilterParams } from "@/types/artwork";

interface GalerieClientProps {
    initialFilters: FilterParams;
}

const sanitizeFilters = (filters: FilterParams): FilterParams =>
    Object.fromEntries(
        Object.entries(filters).filter(
            ([, value]) =>
                value !== undefined &&
                value !== null &&
                value !== "" &&
                value !== false
        )
    ) as FilterParams;

export default function GalerieClient({ initialFilters }: GalerieClientProps) {
    const router = useRouter();
    const [filters, setFilters] = useState<FilterParams>(sanitizeFilters(initialFilters));
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 12;

    const { data, isLoading, isError, refetch } = useArtworks(filters);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filters]);

    const paginatedArtworks = data ? data.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE) : [];
    const totalPages = data ? Math.ceil(data.length / ITEMS_PER_PAGE) : 0;

    const filterString = JSON.stringify(filters);
    // Update URL when filters change
    useEffect(() => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "" && value !== false) {
                params.set(key, value.toString());
            }
        });
        const queryString = params.toString();
        router.push(queryString ? `/galerie?${queryString}` : "/galerie", { scroll: false });
    }, [filterString, router, filters]);

    const handleFilterChange = (newFilters: Partial<FilterParams>) => {
        setFilters(prev => sanitizeFilters({ ...prev, ...newFilters }));
    };

    const handleSearch = (search: string) => {
        setFilters(prev => sanitizeFilters({ ...prev, search }));
    };

    const handleReset = () => {
        setFilters({});
    };

    return (
        <div className="w-full pt-32 pb-24 px-6 sm:px-12 max-w-[1400px] mx-auto min-h-screen canvas-texture canvas-grain relative">

            {/* Éléments de Décoration SVGs (Style Kandinsky/Miro) */}
            <div className="absolute inset-0 z-[-5] pointer-events-none overflow-hidden">
                <svg className="absolute top-[5%] left-[-5%] w-[30vw] h-[30vw] text-accent/10 opacity-60 transform -rotate-12" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <path fill="none" stroke="currentColor" strokeWidth="1" d="M10,190 Q90,10 190,190" strokeDasharray="10,15" strokeLinecap="round" />
                </svg>
                <div className="absolute top-[40%] right-[-5%] w-32 h-32 rounded-full border border-accent/20 opacity-40"></div>
                <svg className="absolute bottom-[10%] left-[5%] w-[15vw] h-[15vw] text-foreground/5 opacity-80" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <line x1="0" y1="20" x2="100" y2="20" stroke="currentColor" strokeWidth="2" />
                    <line x1="0" y1="40" x2="100" y2="40" stroke="currentColor" strokeWidth="2" />
                    <line x1="0" y1="60" x2="100" y2="60" stroke="currentColor" strokeWidth="2" />
                </svg>
            </div>

            {/* Fil d'Ariane & Titre */}
            <div className="flex flex-col gap-6 mb-16 reveal relative z-10">
                <nav className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] font-bold text-foreground/30">
                    <Link href="/" className="hover:text-accent transition-colors">YowPainter</Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-accent">La Galerie</span>
                </nav>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="relative">
                        <h1 className="font-serif text-6xl md:text-8xl font-light tracking-tighter text-foreground">
                            L&apos;Art <span className="italic font-normal">Libéré.</span>
                        </h1>
                        <div className="absolute -bottom-2 left-0 w-32 h-[1px] bg-accent"></div>
                    </div>
                    <p className="text-foreground/40 max-w-sm font-light italic text-lg leading-tight">
                        Explorez notre collection d&apos;œuvres uniques provenant d&apos;artistes du monde entier.
                    </p>
                </div>
            </div>

            {/* Barre de Recherche (Flottante ou Fixe) */}
            <div className="mb-16 reveal reveal-delay-1">
                <SearchBar initialValue={filters.search || ""} onSearch={handleSearch} />
            </div>

            <div className="flex flex-col lg:flex-row gap-16 relative">

                {/* Bouton Filtres Mobile */}
                <button
                    onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                    className="lg:hidden flex items-center justify-center gap-3 bg-foreground text-background py-4 px-8 rounded-full text-xs font-bold uppercase tracking-widest shadow-xl sticky top-24 z-30"
                >
                    <Filter className="w-4 h-4" />
                    {isMobileFiltersOpen ? "Fermer les Filtres" : "Filtres & Styles"}
                </button>

                {/* Sidebar Filtres */}
                <aside className={cn(
                    "lg:block lg:sticky lg:top-32 h-fit transition-all duration-500 z-20",
                    isMobileFiltersOpen ? "block" : "hidden"
                )}>
                    <FilterSidebar
                        initialFilters={filters}
                        onFilterChange={handleFilterChange}
                        onReset={handleReset}
                    />
                </aside>

                {/* Grille principale */}
                <div className="flex-1">
                    {isError ? (
                        <div className="w-full py-20 flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 rounded-full border border-rose-500/20 flex items-center justify-center mb-6">
                                <span className="text-rose-500">!</span>
                            </div>
                            <h3 className="font-serif text-3xl mb-4">Une erreur est survenue</h3>
                            <p className="text-foreground/40 max-w-sm mb-8">
                                Impossible de charger les œuvres. Veuillez vérifier votre connexion.
                            </p>
                            <button
                                onClick={() => refetch()}
                                className="px-8 py-3 bg-foreground text-background hover:bg-accent transition-all text-sm uppercase tracking-widest font-bold"
                            >
                                Réessayer
                            </button>
                        </div>
                    ) : (
                        <>
                            <ArtworkGrid
                                artworks={paginatedArtworks}
                                isLoading={isLoading}
                                isLoggedIn={false} // Would be dynamic based on auth
                            />

                            {!isLoading && totalPages > 1 && (
                                <Pagination 
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={(p) => {
                                        setCurrentPage(p);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className="mt-16"
                                />
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Background Shapes (Matches Homepage) */}
            <div className="fixed inset-0 z-[-10] pointer-events-none opacity-20">
                <div className="absolute top-[20%] right-[-10%] w-[50vw] h-[50vw] bg-accent/10 blur-[120px] animate-blob-delayed" style={{ borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" }}></div>
                <div className="absolute bottom-0 left-[-5%] w-[40vw] h-[40vw] bg-slate-400/10 blur-[100px] animate-blob" style={{ borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%" }}></div>
            </div>
        </div>
    );
}
