'use client'
import { useRef, useState } from 'react'
import { ArtworksService }   from '@/lib/services/ArtworksService'
import { ArtworkCreateRequest } from '@/lib/models/ArtworkCreateRequest'

type Props = { onClose: () => void; onCreated: () => void }
type MediaFile = { file: File; url: string; kind: 'image' | 'video' }

/* ─── Labels FR pour les enums ─── */
const TECHNIQUE_LABELS: Record<ArtworkCreateRequest.technique, string> = {
  OIL:         'Huile',
  ACRYLIC:     'Acrylique',
  WATERCOLOR:  'Aquarelle',
  GOUACHE:     'Gouache',
  PASTEL:      'Pastel',
  CHARCOAL:    'Fusain',
  PENCIL:      'Crayon',
  MIXED_MEDIA: 'Technique mixte',
  OTHER:       'Autre',
}
const STYLE_LABELS: Record<ArtworkCreateRequest.style, string> = {
  ABSTRACT:     'Abstrait',
  FIGURATIVE:   'Figuratif',
  PORTRAIT:     'Portrait',
  LANDSCAPE:    'Paysage',
  STILL_LIFE:   'Nature morte',
  SURREALISM:   'Surréalisme',
  IMPRESSIONISM:'Impressionnisme',
  POP_ART:      'Pop Art',
  CONTEMPORARY: 'Contemporain',
  OTHER:        'Autre',
}

export default function CreatePostModal({ onClose, onCreated }: Props) {
  const [media, setMedia]       = useState<MediaFile | null>(null)
  const [title, setTitle]       = useState('')
  const [desc, setDesc]         = useState('')
  const [technique, setTechnique] = useState<ArtworkCreateRequest.technique>(ArtworkCreateRequest.technique.OIL)
  const [style, setStyle]       = useState<ArtworkCreateRequest.style>(ArtworkCreateRequest.style.ABSTRACT)
  const [dimensions, setDimensions] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags]         = useState<string[]>([])
  const [published, setPublished] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  /* ── Gestion fichier ── */
  function handleFile(file: File) {
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      setError('Seules les images et vidéos sont acceptées.')
      return
    }
    setError('')
    setMedia({ file, url: URL.createObjectURL(file), kind: file.type.startsWith('video/') ? 'video' : 'image' })
  }
  function onDrop(e: React.DragEvent) {
    e.preventDefault(); setDragOver(false)
    const f = e.dataTransfer.files[0]; if (f) handleFile(f)
  }

  /* ── Tags ── */
  function addTag(e: React.KeyboardEvent) {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault()
      const t = tagInput.trim().startsWith('#') ? tagInput.trim() : `#${tagInput.trim()}`
      if (!tags.includes(t)) setTags(p => [...p, t])
      setTagInput('')
    }
  }

  /* ── Soumission ──
     Workflow :
       1. Upload du fichier média → récupérer l'URL (endpoint séparé à confirmer)
       2. POST /api/artworks avec ArtworkCreateRequest + imageUrls
       3. Si published → PATCH /api/artworks/{id}/status?status=PUBLISHED
  ── */
  async function submit() {
    if (!media)        { setError('Ajoutez une image ou une vidéo.'); return }
    if (!title.trim()) { setError('Le titre est requis.'); return }
    setLoading(true); setError(''); setUploadProgress(0)

    try {
      /* Étape 1 — Upload média */
      // TODO: remplacer par l'endpoint d'upload de fichier (ex. MediaService.upload)
      // const formData = new FormData()
      // formData.append('file', media.file)
      // const { url: uploadedUrl } = await MediaService.upload(formData, p => setUploadProgress(p))
      const uploadedUrl = '' // placeholder — remplacer par l'URL retournée
      setUploadProgress(100)

      /* Étape 2 — Création de l'œuvre */
      const dto: ArtworkCreateRequest = {
        title:       title.trim(),
        description: desc.trim() || undefined,
        technique,
        style,
        dimensions:  dimensions.trim() || undefined,
        tags:        tags.map(t => t.replace(/^#/, '')), // back attend sans #
        imageUrls:   uploadedUrl ? [uploadedUrl] : undefined,
      }
      const created = await ArtworksService.createArtwork(dto)

      /* Étape 3 — Publication immédiate si demandée */
      if (published && created.id) {
        await ArtworksService.updateStatus(created.id, 'PUBLISHED')
      }

      onCreated(); onClose()
    } catch {
      setError('Une erreur est survenue, réessayez.')
    } finally {
      setLoading(false); setUploadProgress(null)
    }
  }

  const canSubmit = !!media && !!title.trim() && !loading

  return (
    <Overlay onClose={onClose}>
      <div className="flex flex-col md:flex-row w-full max-w-[860px] max-h-[90vh] bg-background rounded-none md:rounded-2xl shadow-2xl overflow-hidden">

        {/* LEFT — aperçu média */}
        <div className="relative bg-foreground/5 flex items-center justify-center shrink-0
                        w-full md:w-[380px] aspect-square md:aspect-auto md:self-stretch">
          {media ? (
            <>
              {media.kind === 'image'
                ? <img src={media.url} alt="preview" className="absolute inset-0 w-full h-full object-cover"/>
                : <video src={media.url} className="absolute inset-0 w-full h-full object-cover" muted playsInline controls/>
              }
              <button
                onClick={() => { setMedia(null); if (fileRef.current) fileRef.current.value = '' }}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors backdrop-blur-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
              {/* Barre de progression upload */}
              {uploadProgress !== null && uploadProgress < 100 && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
                  <div className="h-full bg-accent transition-all" style={{ width: `${uploadProgress}%` }}/>
                </div>
              )}
            </>
          ) : (
            <div
              onDrop={onDrop}
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onClick={() => fileRef.current?.click()}
              className={`absolute inset-0 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors
                          ${dragOver ? 'bg-accent/10' : 'hover:bg-foreground/[0.04]'}`}
            >
              <div className={`w-16 h-16 rounded-full border-2 border-dashed flex items-center justify-center transition-colors
                              ${dragOver ? 'border-accent text-accent' : 'border-foreground/20 text-foreground/30'}`}>
                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              </div>
              <div className="text-center px-6">
                <p className="text-sm font-medium text-foreground/60">Déposer ou cliquer pour uploader</p>
                <p className="text-xs text-foreground/30 mt-1">Image ou vidéo — JPG, PNG, MP4, MOV…</p>
              </div>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}/>
        </div>

        {/* RIGHT — formulaire */}
        <div className="flex flex-col flex-1 min-h-0 bg-background">
          <ModalHeader title="Nouvelle œuvre" onClose={onClose}/>

          <div className="flex-1 overflow-y-auto min-h-0 px-5 py-4 flex flex-col gap-4">

            <Field label="Titre *">
              <input value={title} onChange={e => setTitle(e.target.value)}
                     placeholder="ex. Série Rouge #4"
                     className={inputCls} maxLength={80}/>
            </Field>

            {/* Technique */}
            <Field label="Technique *">
              <div className="flex flex-wrap gap-1.5">
                {(Object.keys(TECHNIQUE_LABELS) as ArtworkCreateRequest.technique[]).map(t => (
                  <button key={t} onClick={() => setTechnique(t)}
                          className={`px-2.5 py-1 rounded-full text-xs border transition-all ${
                            technique === t
                              ? 'bg-foreground text-background border-foreground'
                              : 'border-foreground/10 text-foreground/60 hover:border-foreground/30'
                          }`}>
                    {TECHNIQUE_LABELS[t]}
                  </button>
                ))}
              </div>
            </Field>

            {/* Style */}
            <Field label="Style *">
              <div className="flex flex-wrap gap-1.5">
                {(Object.keys(STYLE_LABELS) as ArtworkCreateRequest.style[]).map(s => (
                  <button key={s} onClick={() => setStyle(s)}
                          className={`px-2.5 py-1 rounded-full text-xs border transition-all ${
                            style === s
                              ? 'bg-foreground text-background border-foreground'
                              : 'border-foreground/10 text-foreground/60 hover:border-foreground/30'
                          }`}>
                    {STYLE_LABELS[s]}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Dimensions">
              <input value={dimensions} onChange={e => setDimensions(e.target.value)}
                     placeholder="ex. 80×80 cm"
                     className={inputCls} maxLength={40}/>
            </Field>

            <Field label="Description">
              <textarea value={desc} onChange={e => setDesc(e.target.value)}
                        placeholder="Contexte, matériaux, série…"
                        rows={3} className={`${inputCls} resize-none`} maxLength={500}/>
            </Field>

            <Field label="Tags">
              <div className={`${inputCls} flex flex-wrap gap-1.5 min-h-[40px] cursor-text`}
                   onClick={() => document.getElementById('tag-input')?.focus()}>
                {tags.map(t => (
                  <span key={t} className="flex items-center gap-1 bg-accent/10 text-accent text-[11px] px-2 py-0.5 rounded-full">
                    {t}
                    <button onClick={() => setTags(p => p.filter(x => x !== t))} className="hover:text-accent/60">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </span>
                ))}
                <input id="tag-input" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={addTag}
                       placeholder={tags.length === 0 ? 'Entrée ou virgule pour ajouter…' : ''}
                       className="flex-1 min-w-[80px] bg-transparent outline-none text-[13px] text-foreground placeholder:text-foreground/25"/>
              </div>
            </Field>

            {/* Toggle visibilité */}
            <div className="flex items-center justify-between py-3 border-t border-foreground/[0.07]">
              <div>
                <div className="text-sm font-medium">Publier immédiatement</div>
                <div className="text-[11px] text-foreground/40 mt-0.5">
                  {published
                    ? 'Statut : PUBLISHED — visible par le grand public'
                    : 'Statut : DRAFT — enregistré en brouillon'}
                </div>
              </div>
              <Toggle value={published} onChange={setPublished}/>
            </div>

          </div>

          <ModalFooter error={error} loading={loading} disabled={!canSubmit} onSubmit={submit} label="Publier"/>
        </div>
      </div>
    </Overlay>
  )
}

/* ─────────────────────────────────────────────────────────
   Sous-composants partagés — importés par les autres modals
───────────────────────────────────────────────────────── */
export function Overlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end md:items-center justify-center"
         onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      {children}
    </div>
  )
}
export function ModalHeader({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className="flex items-center justify-between px-5 py-3.5 border-b border-foreground/[0.09] shrink-0">
      <h2 className="font-serif text-lg font-semibold">{title}</h2>
      <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full text-foreground/40 hover:bg-foreground/[0.07] hover:text-foreground transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  )
}
export function ModalFooter({ error, loading, disabled, onSubmit, label }: {
  error: string; loading: boolean; disabled: boolean; onSubmit: () => void; label: string
}) {
  return (
    <div className="px-5 py-3.5 border-t border-foreground/[0.09] shrink-0">
      {error && <p className="text-xs text-rose-500 mb-2">{error}</p>}
      <button onClick={onSubmit} disabled={disabled}
              className="w-full py-2.5 rounded-full bg-foreground text-background text-sm font-medium
                         hover:bg-accent hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
        {loading ? <span className="flex items-center justify-center gap-2"><Spinner/> Envoi en cours…</span> : label}
      </button>
    </div>
  )
}
export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-foreground/60 uppercase tracking-wider">{label}</label>
      {children}
    </div>
  )
}
export const inputCls = `w-full px-3.5 py-2 rounded-xl border border-foreground/[0.1] bg-foreground/[0.03]
  text-[13px] text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-accent transition-colors`

export function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)}
            className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${value ? 'bg-accent' : 'bg-foreground/15'}`}>
      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${value ? 'left-[22px]' : 'left-0.5'}`}/>
    </button>
  )
}
export function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/>
    </svg>
  )
}
