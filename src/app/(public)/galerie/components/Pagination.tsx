"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="flex items-center justify-center gap-4 mt-20">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="p-3 border border-foreground/10 hover:border-accent hover:text-accent disabled:opacity-30 disabled:hover:border-foreground/10 disabled:hover:text-foreground/40 transition-all rounded-full group"
            >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </button>

            <div className="flex items-center gap-2">
                {pages.map((page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page - 1)}
                        className={cn(
                            "w-12 h-12 flex items-center justify-center font-serif text-lg transition-all border rounded-full",
                            currentPage === page - 1
                                ? "bg-foreground text-background border-foreground shadow-lg scale-110"
                                : "border-transparent hover:border-foreground/20 hover:text-accent"
                        )}
                    >
                        {page.toString().padStart(2, '0')}
                    </button>
                ))}
            </div>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                className="p-3 border border-foreground/10 hover:border-accent hover:text-accent disabled:opacity-30 disabled:hover:border-foreground/10 disabled:hover:text-foreground/40 transition-all rounded-full group"
            >
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
    );
}
