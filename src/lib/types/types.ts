// types UI internes — mappés depuis ArtworkResponse / EventResponse

import type { ArtworkResponse } from '@/lib/models/ArtworkResponse'
import type { EventResponse }   from '@/lib/models/EventResponse'

// Re-export pour usage dans les composants sans dépendre directement du codegen
export type { ArtworkResponse, EventResponse }

/* ─── Work (tableau / post) ───────────────────────────────
   Correspond à ArtworkResponse avec status DRAFT | PUBLISHED | SUSPENDED
   Un Work avec status ON_SALE est aussi visible dans l'onglet Articles
──────────────────────────────────────────────────────────── */
export type Work = {
  id: string
  title: string
  type: 'image' | 'video'    // déduit : videoUrl présent → video
  bg: string                 // gradient fallback si pas d'imageUrl
  imageUrl?: string          // imageUrls[0] de ArtworkResponse
  videoUrl?: string          // non fourni par l'API actuelle — prévu futur
  duration?: string
  published: boolean         // true si status === PUBLISHED ou ON_SALE
  status: ArtworkResponse.status   // statut brut du back — utile pour le toggle
  technique?: ArtworkResponse.technique
  style?: ArtworkResponse.style
  dimensions?: string
  likes: number
  comments: number
  shares: number
  date: string
  desc: string
  tags: string[]
}

/* ─── Article (tableau mis en vente) ─────────────────────
   Même objet ArtworkResponse mais status === ON_SALE ou SOLD
   Le prix et le type de produit ne sont pas dans ArtworkResponse
   → ils sont stockés dans description (JSON stringifié) ou dans
     un champ à venir — le TODO est dans CreateArticleModal
──────────────────────────────────────────────────────────── */
export type Article = {
  id: string                 // même id que le Work source
  title: string
  type: string               // type de produit (Impression, Tote bag…) — UI only
  price: string              // "85 €" — prix formaté pour l'affichage
  sold: boolean              // status === SOLD
  bg: string
  imageUrl?: string          // imageUrls[0] — même image que le Work
  handleColor: string        // cosmétique pour le sac
  likes: number
  comments: number
  shares: number
  date: string
  desc: string
  tags: string[]
}
