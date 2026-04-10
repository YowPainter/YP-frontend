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
        <div className="bg-white/80 backdrop-blur-md border border-foreground/5 p-4 md:p-6 rounded-2xl shadow-sm space-y-6 transition-all">
            <div className="flex flex-col lg:flex-row gap-4">
                {/* Barre de recherche */}
                <div className="relative flex-1 group">
                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                        <Search className="w-5 h-5 text-foreground/40 group-focus-within:text-accent transition-colors" />
                    </div>
                    <input
                        type="text"
                        value={filters.search}
                        onChange={(e) => handleChange('search', e.target.value)}
                        placeholder="Rechercher un événement, un lieu..."
                        className="w-full bg-foreground/5 border-none rounded-full py-3.5 pl-12 pr-6 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                    />
                </div>

                {/* Filtres par type (Pills) */}
                <div className="flex bg-foreground/5 p-1 rounded-full overflow-x-auto hide-scrollbar">
                    {['', 'FREE', 'PAID', 'PRIVATE'].map((type) => (
                        <button
                            key={type}
                            onClick={() => handleChange('eventType', type)}
                            className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                                filters.eventType === type
                                    ? 'bg-white shadow-sm text-foreground'
                                    : 'text-foreground/50 hover:text-foreground hover:bg-foreground/5'
                            }`}
                        >
                            {type === '' ? 'Tous les types' : type === 'FREE' ? 'Gratuits' : type === 'PAID' ? 'Payants' : 'Privés'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Toggle Switch */}
            <div className="flex items-center justify-between pt-4 border-t border-foreground/5">
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-foreground/40" />
                    <span className="text-sm font-medium text-foreground/60 hidden sm:inline">Filtres additionnels</span>
                </div>

                <label className="flex items-center gap-3 cursor-pointer group">
                    <span className="text-sm font-medium text-foreground/70 group-hover:text-foreground transition-colors">
                        Événements à venir uniquement
                    </span>
                    <div className={`relative w-12 h-6 rounded-full transition-colors duration-300 ease-in-out ${filters.upcoming ? 'bg-accent' : 'bg-foreground/20'}`}>
                        <input
                            type="checkbox"
                            checked={filters.upcoming}
                            onChange={(e) => handleChange('upcoming', e.target.checked)}
                            className="sr-only"
                        />
                        <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow-sm transition-transform duration-300 ease-in-out ${filters.upcoming ? 'translate-x-6' : 'translate-x-0'}`} />
                    </div>
                </label>
            </div>
        </div>
    );
}