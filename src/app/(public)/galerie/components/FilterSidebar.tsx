"use client";

import { useForm } from "react-hook-form";
import { FilterParams } from "@/types/artwork";
import { ChevronDown, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface FilterSidebarProps {
    initialFilters: FilterParams;
    onFilterChange: (filters: FilterParams) => void;
    onReset: () => void;
}

const TECHNIQUES = ["Huile", "Acrylique", "Aquarelle", "Biseautage", "Digital", "Sculpture"];
const STYLES = ["Abstrait", "Réaliste", "Minimaliste", "Impressionniste", "Surréaliste"];

export default function FilterSidebar({ initialFilters, onFilterChange, onReset }: FilterSidebarProps) {
    const { register, handleSubmit, reset } = useForm<FilterParams>({
        defaultValues: initialFilters,
    });

    const [openSections, setOpenSections] = useState({
        technique: true,
        style: true,
        price: true,
        status: true,
    });

    const toggleSection = (section: keyof typeof openSections) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const onSubmit = (data: FilterParams) => {
        onFilterChange(data);
    };

    return (
        <div className="w-full lg:w-72 flex flex-col gap-10">
            <div className="flex items-center justify-between pb-4 border-b border-foreground/10">
                <h2 className="font-serif text-2xl font-medium tracking-tight">Filtres</h2>
                <button
                    onClick={() => { reset(); onReset(); }}
                    className="text-foreground/40 hover:text-accent flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors"
                >
                    <RotateCcw className="w-3 h-3" />
                    Réinitialiser
                </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
                {/* Technique */}
                <div className="flex flex-col gap-4">
                    <button
                        type="button"
                        onClick={() => toggleSection("technique")}
                        className="flex items-center justify-between w-full group"
                    >
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/60 group-hover:text-foreground transition-colors">Technique</span>
                        <ChevronDown className={cn("w-4 h-4 text-foreground/30 transition-transform duration-300", !openSections.technique && "-rotate-90")} />
                    </button>

                    {openSections.technique && (
                        <div className="grid grid-cols-1 gap-3 pl-1">
                            {TECHNIQUES.map((tech) => (
                                <label key={tech} className="flex items-center gap-3 group cursor-pointer">
                                    <input
                                        type="radio"
                                        value={tech}
                                        {...register("technique")}
                                        onChange={handleSubmit(onSubmit)}
                                        className="w-4 h-4 border-foreground/20 text-accent focus:ring-accent accent-accent transition-all"
                                    />
                                    <span className="text-sm text-foreground/50 group-hover:text-foreground transition-colors font-light italic">{tech}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* Style */}
                <div className="flex flex-col gap-4">
                    <button
                        type="button"
                        onClick={() => toggleSection("style")}
                        className="flex items-center justify-between w-full group"
                    >
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/60 group-hover:text-foreground transition-colors">Style</span>
                        <ChevronDown className={cn("w-4 h-4 text-foreground/30 transition-transform duration-300", !openSections.style && "-rotate-90")} />
                    </button>

                    {openSections.style && (
                        <div className="grid grid-cols-1 gap-3 pl-1">
                            {STYLES.map((style) => (
                                <label key={style} className="flex items-center gap-3 group cursor-pointer">
                                    <input
                                        type="radio"
                                        value={style}
                                        {...register("style")}
                                        onChange={handleSubmit(onSubmit)}
                                        className="w-4 h-4 border-foreground/20 text-accent focus:ring-accent accent-accent transition-all"
                                    />
                                    <span className="text-sm text-foreground/50 group-hover:text-foreground transition-colors font-light italic">{style}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* Prix */}
                <div className="flex flex-col gap-4">
                    <button
                        type="button"
                        onClick={() => toggleSection("price")}
                        className="flex items-center justify-between w-full group"
                    >
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/60 group-hover:text-foreground transition-colors">Fourchette de Prix</span>
                        <ChevronDown className={cn("w-4 h-4 text-foreground/30 transition-transform duration-300", !openSections.price && "-rotate-90")} />
                    </button>

                    {openSections.price && (
                        <div className="flex flex-col gap-4 pl-1 mt-2">
                            <div className="flex items-center gap-4">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    {...register("minPrice")}
                                    className="w-full bg-white dark:bg-background border border-foreground/10 py-2 px-3 text-sm font-light focus:outline-none focus:border-accent transition-colors"
                                />
                                <span className="text-foreground/20">—</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    {...register("maxPrice")}
                                    className="w-full bg-white dark:bg-background border border-foreground/10 py-2 px-3 text-sm font-light focus:outline-none focus:border-accent transition-colors"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleSubmit(onSubmit)}
                                className="w-full bg-foreground text-background py-2 text-[10px] uppercase font-bold tracking-widest hover:bg-accent transition-all"
                            >
                                Appliquer
                            </button>
                        </div>
                    )}
                </div>

                {/* Status */}
                <div className="flex flex-col gap-4">
                    <label className="flex items-center gap-3 group cursor-pointer">
                        <input
                            type="checkbox"
                            {...register("forSale")}
                            onChange={handleSubmit(onSubmit)}
                            className="w-4 h-4 border-foreground/20 text-accent focus:ring-accent accent-accent rounded-none transition-all"
                        />
                        <span className="text-xs font-bold uppercase tracking-widest text-foreground/60 group-hover:text-accent transition-colors">Uniquement en vente</span>
                    </label>
                </div>
            </form>
        </div>
    );
}
