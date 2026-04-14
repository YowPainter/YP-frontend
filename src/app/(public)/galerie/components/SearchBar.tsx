"use client";

import { Search } from "lucide-react";
import { useForm } from "react-hook-form";

interface SearchBarProps {
    initialValue: string;
    onSearch: (value: string) => void;
}

export default function SearchBar({ initialValue, onSearch }: SearchBarProps) {
    const { register, handleSubmit } = useForm({
        defaultValues: {
            search: initialValue,
        },
    });

    const onSubmit = (data: { search: string }) => {
        onSearch(data.search);
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="relative w-full max-w-2xl mx-auto group"
        >
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-foreground/30 group-focus-within:text-accent transition-colors" />
            </div>

            <input
                {...register("search")}
                type="text"
                placeholder="Rechercher une œuvre, un artiste, une technique..."
                className="w-full bg-white dark:bg-white/5 border border-foreground/10 rounded-full py-5 pl-16 pr-14 text-lg font-light placeholder:text-foreground/30 focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all shadow-sm"
            />

            <button
                type="submit"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-foreground text-background dark:bg-accent dark:text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-accent hover:text-white dark:hover:bg-foreground transition-all shadow-md"
            >
                Rechercher
            </button>
        </form>
    );
}
