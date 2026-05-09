'use client'
import { useState } from 'react'
import { ArtworksService } from '@/lib/services/ArtworksService'
import type { Work } from '@/lib/types/types'
import {
  Overlay, ModalHeader, ModalFooter, Field, inputCls
} from './CreatePostModal'

type Props = {
  works: Work[]          // Artworks avec status PUBLISHED — à sélectionner
  onClose: () => void
  onCreated: () => void
}

/* ─── Workflow "article" côté back ────────────────────────
   Un article = un Artwork passé en status ON_SALE.
   Le prix et le type de produit ne sont pas dans ArtworkResponse
   actuellement → stockés dans la description selon convention
   à aligner avec le back-end (champ dédié à venir).
───────────────────────────────────────────────────────── */

const PRODUCT_TYPES = [
  'Impression', 'Toile originale', 'Affiche A3',
  'Tote bag', 'Carnet', 'Autre',
] as const
type ProductType = typeof PRODUCT_TYPES[number]

export default function CreateArticleModal({ works, onClose, onCreated }: Props) {
  const [selectedWork, setSelectedWork] = useState<Work | null>(null)
  const [productType, setProductType]   = useState<ProductType>('Impression')
  const [price, setPrice]               = useState('')
  const [stock, setStock]               = useState('1')
  const [desc, setDesc]                 = useState('')
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState('')

  async function submit() {
    if (!selectedWork)                        { setError('Sélectionnez une œuvre.'); return }
    if (!price.trim() || isNaN(Number(price))){ setError('Prix invalide.'); return }
    if (Number(price) < 0)                    { setError('Le prix doit être positif.'); return }
    setLoading(true); setError('')
    try {
      /* Workflow :
         1. Passer l'artwork en ON_SALE via updateStatus
         2. TODO: si le back ajoute un endpoint dédié product/price, l'appeler ici
            ex. ProductsService.createProduct({ artworkId, price, productType, stock, desc })
         Note : le prix et le type de produit sont pour l'instant encodés
         dans la description en attendant l'endpoint dédié.
         Format convenu : "[PRODUCT:Impression|PRICE:85|STOCK:10] description libre"
      */
      const priceN = Number(price)
      const stockN = Number(stock) || 1

      // Mise à jour de la description pour encoder les métadonnées produit
      // TODO: remplacer par l'endpoint produit dédié quand disponible
      const updatedDesc = `[PRODUCT:${productType}|PRICE:${priceN}|STOCK:${stockN}] ${desc.trim()}`
      await ArtworksService.updateArtwork(selectedWork.id, {
        title:       selectedWork.title,
        technique:   selectedWork.technique ?? 'OTHER' as any,
        style:       selectedWork.style ?? 'OTHER' as any,
        description: updatedDesc,
        tags:        selectedWork.tags.map(t => t.replace(/^#/, '')),
      })

      // Passage en ON_SALE
      await ArtworksService.updateStatus(selectedWork.id, 'ON_SALE')

      onCreated(); onClose()
    } catch {
      setError('Une erreur est survenue, réessayez.')
    } finally {
      setLoading(false)
    }
  }

  const canSubmit = !!selectedWork && !!price.trim() && !isNaN(Number(price)) && !loading

  // Seuls les tableaux publiés peuvent être mis en vente
  const eligibleWorks = works.filter(w =>
    w.status === 'PUBLISHED' || w.status === 'ON_SALE'
  )

  return (
    <Overlay onClose={onClose}>
      <div className="flex flex-col w-full max-w-[560px] max-h-[90vh] bg-background rounded-none md:rounded-2xl shadow-2xl overflow-hidden">
        <ModalHeader title="Mettre en vente" onClose={onClose}/>

        <div className="flex-1 overflow-y-auto min-h-0 px-5 py-4 flex flex-col gap-5">

          {/* Sélection de l'œuvre */}
          <Field label="Choisir l'œuvre *">
            {eligibleWorks.length === 0 ? (
              <p className="text-xs text-foreground/40 py-4 text-center">
                Aucune œuvre publiée. Créez et publiez d&apos;abord un post.
              </p>
            ) : (
              <div className="grid grid-cols-4 gap-2.5 mt-0.5">
                {eligibleWorks.map(w => (
                  <button
                    key={w.id}
                    onClick={() => setSelectedWork(w)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all
                                ${selectedWork?.id === w.id
                                  ? 'border-accent scale-[1.03]'
                                  : 'border-transparent hover:border-foreground/20'}`}
                  >
                    {w.imageUrl
                      ? <img src={w.imageUrl} alt={w.title} className="absolute inset-0 w-full h-full object-cover"/>
                      : <div className="absolute inset-0" style={{ background: w.bg }}/>
                    }
                    {/* Badge ON_SALE */}
                    {w.status === 'ON_SALE' && (
                      <div className="absolute top-1 left-1 bg-accent text-white text-[8px] px-1.5 py-0.5 rounded-full font-medium">
                        En vente
                      </div>
                    )}
                    {selectedWork?.id === w.id && (
                      <div className="absolute inset-0 bg-accent/25 flex items-center justify-center">
                        <svg className="w-5 h-5 text-white drop-shadow" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
            {selectedWork && (
              <p className="text-[11px] text-foreground/50 mt-1">
                Sélectionné : <span className="text-accent font-medium">{selectedWork.title}</span>
                {selectedWork.dimensions && <span className="text-foreground/30"> · {selectedWork.dimensions}</span>}
              </p>
            )}
          </Field>

          {/* Type de produit */}
          <Field label="Type de produit *">
            <div className="flex flex-wrap gap-2">
              {PRODUCT_TYPES.map(t => (
                <button key={t} onClick={() => setProductType(t)}
                        className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                          productType === t
                            ? 'bg-foreground text-background border-foreground'
                            : 'border-foreground/10 text-foreground/60 hover:border-foreground/30'
                        }`}>
                  {t}
                </button>
              ))}
            </div>
          </Field>

          {/* Prix & stock */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Prix (€) *">
              <div className="relative">
                <input type="number" min="0" step="0.01" value={price}
                       onChange={e => setPrice(e.target.value)}
                       placeholder="85" className={inputCls}/>
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[13px] text-foreground/30">€</span>
              </div>
            </Field>
            <Field label="Stock">
              <input type="number" min="1" value={stock}
                     onChange={e => setStock(e.target.value)}
                     placeholder="1" className={inputCls}/>
            </Field>
          </div>

          {/* Description produit */}
          <Field label="Description du produit">
            <textarea value={desc} onChange={e => setDesc(e.target.value)}
                      placeholder="Format, support, numérotation, livraison…"
                      rows={3} className={`${inputCls} resize-none`} maxLength={400}/>
          </Field>

          {/* Note info */}
          <p className="text-[11px] text-foreground/35 -mt-2">
            L&apos;œuvre passera au statut <span className="font-mono">ON_SALE</span>. Elle restera visible dans vos posts.
          </p>

        </div>

        <ModalFooter error={error} loading={loading} disabled={!canSubmit} onSubmit={submit} label="Mettre en vente"/>
      </div>
    </Overlay>
  )
}
