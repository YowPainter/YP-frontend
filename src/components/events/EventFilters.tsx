// src/components/events/EventFilters.tsx
'use client';

import { Search, Filter } from 'lucide-react';

interface EventFiltersProps {
    filters: {
        eventType: string;
        upcoming: boolean;
        search: string;
    };
    onFilterChange: (filters: any) => void;
}

export function EventFilters({ filters, onFilterChange }: EventFiltersProps) {
    const handleChange = (key: string, value: any) => {
        onFilterChange({ ...filters, [key]: value });
    };

    return (
        <div className="glass-elegant border border-foreground/10 dark:border-white/5 p-6 shadow-xl dark:shadow-2xl space-y-6 transition-all duration-500 rounded-lg">
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Barre de recherche */}
                <div className="relative flex-1 group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Search className="w-5 h-5 text-foreground/30 dark:text-white/20 group-focus-within:text-accent transition-colors" />
                    </div>
                    <input
                        type="text"
                        value={filters.search}
                        onChange={(e) => handleChange('search', e.target.value)}
                        placeholder="Rechercher par titre ou mot-clé..."
                        className="w-full bg-transparent border-b border-foreground/10 dark:border-white/10 py-3.5 pl-12 pr-4 text-foreground placeholder:text-foreground/30 dark:placeholder:text-white/40 focus:outline-none focus:border-accent transition-all text-sm tracking-wide"
                    />
                </div>

                {/* Filtres par type (Pills sharp) */}
                <div className="flex flex-wrap gap-2 overflow-x-auto hide-scrollbar">
                    {['', 'FREE', 'PAID'].map((type) => (
                        <button
                            key={type}
                            onClick={() => handleChange('eventType', type)}
                            className={`px-6 py-2.5 text-[10px] font-black whitespace-nowrap uppercase tracking-[0.2em] border transition-all duration-500 ${
                                filters.eventType === type
                                    ? 'bg-foreground text-background border-foreground dark:bg-accent dark:text-white dark:border-accent'
                                    : 'bg-transparent text-foreground/40 dark:text-white/40 border-foreground/10 dark:border-white/10 hover:border-accent hover:text-accent'
                            }`}
                        >
                            {type === '' ? 'TOUS' : type === 'FREE' ? 'GRATUITS' : 'PAYANTS'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Toggle Switch */}
            <div className="flex items-center justify-between pt-6 border-t border-foreground/5 dark:border-white/5">
                <div className="flex items-center gap-3">
                    <Filter className="w-4 h-4 text-foreground/30 dark:text-white/40" />
                    <span className="text-[10px] font-bold text-foreground/40 dark:text-white/50 uppercase tracking-[0.2em] hidden sm:inline">Options de filtrage</span>
                </div>

                <label className="flex items-center gap-4 cursor-pointer group">
                    <span className="text-[10px] font-bold text-foreground/50 dark:text-white/60 group-hover:text-accent uppercase tracking-widest transition-colors">
                        À venir uniquement
                    </span>
                    <div className={`relative w-11 h-5 border transition-all duration-500 ${filters.upcoming ? 'bg-accent border-accent' : 'bg-transparent border-foreground/20 dark:border-white/20'}`}>
                        <input
                            type="checkbox"
                            checked={filters.upcoming}
                            onChange={(e) => handleChange('upcoming', e.target.checked)}
                            className="sr-only"
                        />
                        <div className={`absolute left-0.5 top-0.5 bg-white w-3.5 h-3.5 transition-transform duration-500 ease-out ${filters.upcoming ? 'translate-x-[24px]' : 'translate-x-0'}`} />
                    </div>
                </label>
            </div>
        </div>
    );
}