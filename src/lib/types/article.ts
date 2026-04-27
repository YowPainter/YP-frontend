// lib/types/article.ts

export type ArticleStatus = 'AVAILABLE' | 'SOLD_OUT' | 'ARCHIVED'

export type ProductType =
  | 'IMPRESSION'
  | 'ORIGINAL_CANVAS'
  | 'POSTER_A3'
  | 'TOTE_BAG'
  | 'NOTEBOOK'
  | 'OTHER'

// Labels FR pour affichage — à mapper depuis ProductType
export const PRODUCT_TYPE_LABELS: Record<ProductType, string> = {
  IMPRESSION:      'Impression',
  ORIGINAL_CANVAS: 'Toile originale',
  POSTER_A3:       'Affiche A3',
  TOTE_BAG:        'Tote bag',
  NOTEBOOK:        'Carnet',
  OTHER:           'Autre',
}

export interface Article {
  id: string
  name: string
  description: string
  productType: ProductType
  price: number
  stockQuantity: number
  active: boolean             // false = vendu / archivé
  status: ArticleStatus
  artworkId: string           // référence au post (Artwork) dont l'image est reprise
  artworkTitle: string
  imageUrl: string | null     // héritée du post lié
  artistId: string
  artistName: string
  artistSlug: string
  createdAt: string
  updatedAt: string
}

export interface CreateArticleDTO {
  artworkId: string
  name: string
  description: string
  productType: ProductType
  price: number
  stockQuantity: number
}
