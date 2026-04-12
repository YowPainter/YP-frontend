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
        <div className="bg-white/90 backdrop-blur-md border border-foreground/10 p-6 shadow-sm space-y-6 transition-all">
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Barre de recherche */}
                <div className="relative flex-1 group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Search className="w-5 h-5 text-foreground/40 group-focus-within:text-accent transition-colors" />
                    </div>
                    <input
                        type="text"
                        value={filters.search}
                        onChange={(e) => handleChange('search', e.target.value)}
                        placeholder="Rechercher un événement, un lieu..."
                        className="w-full bg-transparent border-b border-foreground/20 py-3.5 pl-12 pr-4 text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-accent transition-all"
                    />
                </div>

                {/* Filtres par type (Pills sharp) */}
                <div className="flex flex-wrap gap-2 overflow-x-auto hide-scrollbar">
                    {['', 'FREE', 'PAID', 'PRIVATE'].map((type) => (
                        <button
                            key={type}
                            onClick={() => handleChange('eventType', type)}
                            className={`px-6 py-2.5 text-sm font-medium whitespace-nowrap uppercase tracking-widest border transition-all duration-300 ${
                                filters.eventType === type
                                    ? 'bg-foreground text-background border-foreground'
                                    : 'bg-transparent text-foreground/60 border-foreground/20 hover:border-foreground hover:text-foreground'
                            }`}
                        >
                            {type === '' ? 'TOUS' : type === 'FREE' ? 'GRATUITS' : type === 'PAID' ? 'PAYANTS' : 'PRIVÉS'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Toggle Switch */}
            <div className="flex items-center justify-between pt-6 border-t border-foreground/10">
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-foreground/40" />
                    <span className="text-sm font-medium text-foreground/60 uppercase tracking-wider hidden sm:inline">Options de filtrage</span>
                </div>

                <label className="flex items-center gap-4 cursor-pointer group">
                    <span className="text-sm font-medium text-foreground/70 group-hover:text-foreground uppercase tracking-wider transition-colors">
                        À venir uniquement
                    </span>
                    <div className={`relative w-12 h-6 border transition-colors duration-300 ease-in-out ${filters.upcoming ? 'bg-foreground border-foreground' : 'bg-transparent border-foreground/30'}`}>
                        <input
                            type="checkbox"
                            checked={filters.upcoming}
                            onChange={(e) => handleChange('upcoming', e.target.checked)}
                            className="sr-only"
                        />
                        <div className={`absolute left-1 top-1 bg-background border border-foreground/10 w-4 h-4 transition-transform duration-300 ease-in-out ${filters.upcoming ? 'translate-x-[22px]' : 'translate-x-0'}`} />
                    </div>
                </label>
            </div>
        </div>
    );
}