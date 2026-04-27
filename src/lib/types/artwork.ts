// lib/types/artwork.ts

export type ArtworkType = 'IMAGE' | 'VIDEO'
export type ArtworkStatus = 'DRAFT' | 'PUBLISHED'

export interface Artwork {
  id: string
  title: string
  description: string
  type: ArtworkType
  imageUrls: string[]         // plusieurs angles possibles
  videoUrl: string | null
  duration: string | null     // ex. "2:14" pour les vidéos
  status: ArtworkStatus
  tags: string[]
  likeCount: number
  commentCount: number
  shareCount: number
  artistId: string
  artistName: string
  artistSlug: string
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateArtworkDTO {
  title: string
  description: string
  tags: string[]
  status: ArtworkStatus      // 'DRAFT' | 'PUBLISHED'
  // Le fichier image/vidéo est envoyé en multipart — pas dans ce DTO JSON
}

export interface UpdateArtworkStatusDTO {
  status: ArtworkStatus
}
