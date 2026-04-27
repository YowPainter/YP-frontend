'use client'
import { useRef, useState } from 'react'
import { EventsService }   from '@/lib/services/EventsService'
import { EventCreateRequest } from '@/lib/models/EventCreateRequest'
import {
  Overlay, ModalHeader, ModalFooter, Field, Toggle, inputCls,
} from './CreatePostModal'

type Props = { onClose: () => void; onCreated: () => void }
type CoverFile = { file: File; url: string }

const EVENT_TYPE_LABELS: Record<EventCreateRequest.type, string> = {
  EXHIBITION: 'Exposition',
  WORKSHOP:   'Atelier',
  AUCTION:    'Vente aux enchères',
  MEETUP:     'Rencontre',
  OTHER:      'Autre',
}

export default function CreateEventModal({ onClose, onCreated }: Props) {
  const [cover, setCover]       = useState<CoverFile | null>(null)
  const [name, setName]         = useState('')
  const [description, setDesc]  = useState('')
  const [startDateTime, setStart] = useState('')   // datetime-local
  const [endDateTime, setEnd]   = useState('')     // datetime-local
  const [location, setLocation] = useState('')
  const [type, setType]         = useState<EventCreateRequest.type>(EventCreateRequest.type.EXHIBITION)
  const [maxCapacity, setMax]   = useState('')
  const [ticketPrice, setPrice] = useState('')
  const [published, setPublished] = useState(false)

  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [dragOver, setDragOver] = useState(false)
  const fileRef                 = useRef<HTMLInputElement>(null)

  function handleFile(file: File) {
    if (!file.type.startsWith('image/')) { setError('Seules les images sont acceptées.'); return }
    setError('')
    setCover({ file, url: URL.createObjectURL(file) })
  }
  function onDrop(e: React.DragEvent) {
    e.preventDefault(); setDragOver(false)
    const f = e.dataTransfer.files[0]; if (f) handleFile(f)
  }

  const isPaid = !!ticketPrice

  async function submit() {
    if (!name.trim())  { setError('Le nom est requis.'); return }
    if (!startDateTime){ setError('La date de début est requise.'); return }
    if (!endDateTime)  { setError('La date de fin est requise.'); return }
    if (new Date(endDateTime) <= new Date(startDateTime)) {
      setError('La date de fin doit être après le début.'); return
    }
    setLoading(true); setError('')
    try {
      /* Étape 1 — Upload de l'affiche si fournie */
      let posterUrl: string | undefined
      if (cover) {
        // TODO: remplacer par l'endpoint d'upload (ex. MediaService.upload)
        // const formData = new FormData()
        // formData.append('file', cover.file)
        // const { url } = await MediaService.upload(formData)
        // posterUrl = url
        posterUrl = undefined // placeholder
      }

      /* Étape 2 — Création de l'évènement via EventsService.createEvent */
      const dto: EventCreateRequest = {
        name:          name.trim(),
        description:   description.trim() || undefined,
        posterUrl:     posterUrl,
        startDateTime: new Date(startDateTime).toISOString(),
        endDateTime:   new Date(endDateTime).toISOString(),
        location:      location.trim() || undefined,
        type,
        ...(maxCapacity ? { maxCapacity: Number(maxCapacity) } : {}),
        ...(ticketPrice  ? { ticketPrice:  Number(ticketPrice)  } : {}),
      }
      const created = await EventsService.createEvent(dto)

      /* Étape 3 — Publication immédiate si demandée */
      // TODO: si EventsService expose un updateStatus, l'appeler ici
      // if (published && created.id) await EventsService.updateStatus(created.id, 'PUBLISHED')
      void created

      onCreated(); onClose()
    } catch {
      setError('Une erreur est survenue, réessayez.')
    } finally {
      setLoading(false)
    }
  }

  const canSubmit = !!name.trim() && !!startDateTime && !!endDateTime && !loading

  return (
    <Overlay onClose={onClose}>
      <div className="flex flex-col md:flex-row w-full max-w-[860px] max-h-[90vh] bg-background rounded-none md:rounded-2xl shadow-2xl overflow-hidden">

        {/* LEFT — affiche */}
        <div className="relative bg-foreground/5 flex items-center justify-center shrink-0
                        w-full md:w-[300px] aspect-video md:aspect-auto md:self-stretch">
          {cover ? (
            <>
              <img src={cover.url} alt="cover" className="absolute inset-0 w-full h-full object-cover"/>
              <button
                onClick={() => { setCover(null); if (fileRef.current) fileRef.current.value = '' }}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors backdrop-blur-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
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
              <div className={`w-14 h-14 rounded-full border-2 border-dashed flex items-center justify-center transition-colors
                              ${dragOver ? 'border-accent text-accent' : 'border-foreground/20 text-foreground/30'}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
              <div className="text-center px-4">
                <p className="text-sm font-medium text-foreground/50">Affiche de l&apos;évènement</p>
                <p className="text-xs text-foreground/25 mt-1">Optionnel — JPG, PNG…</p>
              </div>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" className="hidden"
                 onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}/>
        </div>

        {/* RIGHT — formulaire */}
        <div className="flex flex-col flex-1 min-h-0 bg-background">
          <ModalHeader title="Nouvel évènement" onClose={onClose}/>

          <div className="flex-1 overflow-y-auto min-h-0 px-5 py-4 flex flex-col gap-4">

            <Field label="Nom *">
              <input value={name} onChange={e => setName(e.target.value)}
                     placeholder="ex. Vernissage — Série Printemps"
                     className={inputCls} maxLength={100}/>
            </Field>

            {/* Type (enum EventCreateRequest.type) */}
            <Field label="Type *">
              <div className="flex flex-wrap gap-2">
                {(Object.entries(EVENT_TYPE_LABELS) as [EventCreateRequest.type, string][]).map(([v, l]) => (
                  <button key={v} onClick={() => setType(v)}
                          className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                            type === v
                              ? 'bg-foreground text-background border-foreground'
                              : 'border-foreground/10 text-foreground/60 hover:border-foreground/30'
                          }`}>
                    {l}
                  </button>
                ))}
              </div>
            </Field>

            {/* Lieu */}
            <Field label="Lieu">
              <input value={location} onChange={e => setLocation(e.target.value)}
                     placeholder="ex. Galerie du Marais, Paris  /  En ligne"
                     className={inputCls} maxLength={150}/>
            </Field>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Début *">
                <input type="datetime-local" value={startDateTime}
                       onChange={e => setStart(e.target.value)}
                       min={new Date().toISOString().slice(0, 16)}
                       className={inputCls}/>
              </Field>
              <Field label="Fin *">
                <input type="datetime-local" value={endDateTime}
                       onChange={e => setEnd(e.target.value)}
                       min={startDateTime || new Date().toISOString().slice(0, 16)}
                       className={inputCls}/>
              </Field>
            </div>

            {/* Capacité + prix */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Capacité max">
                <input type="number" min="1" value={maxCapacity}
                       onChange={e => setMax(e.target.value)}
                       placeholder="Illimitée" className={inputCls}/>
              </Field>
              <Field label="Prix du billet (€)">
                <div className="relative">
                  <input type="number" min="0" step="0.01" value={ticketPrice}
                         onChange={e => setPrice(e.target.value)}
                         placeholder="Gratuit" className={inputCls}/>
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[13px] text-foreground/30">€</span>
                </div>
              </Field>
            </div>

            <Field label="Description">
              <textarea value={description} onChange={e => setDesc(e.target.value)}
                        placeholder="Programme, informations pratiques…"
                        rows={3} className={`${inputCls} resize-none`} maxLength={600}/>
            </Field>

            {/* Visibilité */}
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

          <ModalFooter error={error} loading={loading} disabled={!canSubmit}
                       onSubmit={submit} label="Créer l'évènement"/>
        </div>
      </div>
    </Overlay>
  )
}
