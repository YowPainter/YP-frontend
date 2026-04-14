export type ArtworkStatus = "PUBLISHED" | "DRAFT" | "ARCHIVED";

export interface Artist {
    id: string;
    artistName: string;
    slug: string;
    avatar?: string;
}

export interface Artwork {
    id: string;
    title: string;
    description: string;
    images: string[];
    price?: number;
    technique: string;
    style: string;
    status: ArtworkStatus;
    likesCount: number;
    commentsCount: number;
    artist: Artist;
    createdAt: string;
}

export interface PaginatedResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

export interface FilterParams {
    page?: number;
    size?: number;
    sort?: string;
    technique?: string;
    style?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    forSale?: boolean;
}
