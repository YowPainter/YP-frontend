'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ArtworksService } from '@/lib/services/ArtworksService'
import type { Work, Article } from '@/lib/types/types'

type Item = Work | Article
type Comment = { name: string; initials: string; text: string; time: string }

const SAMPLE: Comment[] = [
  { name: 'Sophie R.',  initials: 'SR', text: 'Absolument magnifique, cette profondeur est saisissante.',                        time: 'il y a 2h' },
  { name: 'Lucas M.',   initials: 'LM', text: "La technique est impeccable, j\u2019adore la façon dont la lumière est traitée.", time: 'il y a 5h' },
  { name: 'Amara D.',   initials: 'AD', text: 'Cela me touche beaucoup, merci pour ce partage.',                                 time: 'il y a 1j' },
  { name: 'Pierre L.',  initials: 'PL', text: 'Tu as encore surpassé toi-même avec cette œuvre.',                               time: 'il y a 2j' },
]

/* ── Média : vidéo > image > gradient fallback ── */
function MediaArea({ item }: { item: Item }) {
  const work     = item as Work
  const isVideo  = work.type === 'video'
  const hasVideo = isVideo && !!work.videoUrl
  const hasImage = !isVideo && !!(work.imageUrl ?? (item as Article).imageUrl)
  const imgSrc   = work.imageUrl ?? (item as Article).imageUrl

  return (
    <>
      {hasVideo ? (
        <video
          key={work.videoUrl}           /* remonte à zéro si l'url change */
          src={work.videoUrl}
          controls
          className="absolute inset-0 w-full h-full object-contain bg-black"
          playsInline
        />
      ) : hasImage ? (
        <Image
          src={imgSrc!}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 100vw, 440px"
          className="object-cover"
          priority
        />
      ) : (
        /* fallback gradient */
        <div
          className="absolute inset-0 flex items-center justify-center font-display text-xl text-white/40"
          style={{ background: item.bg }}
        >
          {item.title}
        </div>
      )}

      {/* Bouton play décoratif uniquement si vidéo sans url (pas encore uploadée) */}
      {isVideo && !hasVideo && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-14 h-14 rounded-full bg-white/15 border-2 border-white/30 flex items-center justify-center backdrop-blur-sm">
            <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
          </div>
        </div>
      )}

      {/* Pill type */}
      <div className="absolute top-3 left-3 bg-black/55 text-white/70 text-[10px] px-2 py-0.5 rounded uppercase tracking-widest backdrop-blur-sm pointer-events-none">
        {isVideo ? '▶ Vidéo' : 'Image'}
      </div>
    </>
  )
}

export default function PostModal({ dataset, initialIndex, onClose,
  authorName = 'Marie Lecomte', authorHandle = '@marielecomte', authorInitial = 'M',
  isOwner = false,          // true = dashboard artiste → affiche toggle visibilité
  onTogglePublished,        // callback optionnel quand l'artiste change la visibilité
}: {
  dataset: Item[]
  initialIndex: number
  onClose: () => void
  authorName?: string
  authorHandle?: string
  authorInitial?: string
  isOwner?: boolean
  onTogglePublished?: (id: string, published: boolean) => void
}) {
  const [idx, setIdx]           = useState(initialIndex)
  const [liked, setLiked]       = useState(false)
  const [likes, setLikes]       = useState(0)
  const [comments, setComs]     = useState<Comment[]>([])
  const [input, setInput]       = useState('')
  const [toggling, setToggling] = useState(false)
  const bodyRef                 = useRef<HTMLDivElement>(null)
  const touchY                  = useRef(0)
  const item                    = dataset[idx]
  const work                    = item as Work
  // état local de visibilité (Work only)
  const [published, setPublished] = useState<boolean>(work.published ?? false)

  useEffect(() => {
    setLiked(false)
    setLikes(item.likes)
    setComs(SAMPLE.slice(0, Math.min(item.comments, SAMPLE.length)))
    setPublished((item as Work).published ?? false)
    if (bodyRef.current) bodyRef.current.scrollTop = 0
  }, [idx, item])

  async function handleTogglePublished() {
    setToggling(true)
    const next = !published
    try {
      const nextStatus = next ? 'PUBLISHED' : 'DRAFT'
      await ArtworksService.updateStatus(item.id, nextStatus)
      setPublished(next)
      onTogglePublished?.(item.id, next)
    } finally {
      setToggling(false)
    }
  }

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'Escape')     onClose()
      if (e.key === 'ArrowLeft')  go(-1)
      if (e.key === 'ArrowRight') go(1)
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  })

  const go = (dir: number) => {
    const n = idx + dir
    if (n >= 0 && n < dataset.length) setIdx(n)
  }

  const toggleLike = () => setLiked(p => { setLikes(l => l + (p ? -1 : 1)); return !p })

  const send = () => {
    if (!input.trim()) return
    setComs(c => [{ name: authorName, initials: authorInitial, text: input.trim(), time: "à l\u2019instant" }, ...c])
    setInput('')
  }

  const ArrowBtn = ({ dir }: { dir: -1 | 1 }) => (
    <button
      onClick={() => go(dir)}
      disabled={dir === -1 ? idx === 0 : idx === dataset.length - 1}
      className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-white border border-black/10 shadow-sm hover:bg-cream transition-colors disabled:opacity-0 shrink-0"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        {dir === -1 ? <polyline points="15 18 9 12 15 6"/> : <polyline points="9 6 15 12 9 18"/>}
      </svg>
    </button>
  )

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="flex items-center gap-3 w-full max-w-[940px] px-2 md:px-0">
        <ArrowBtn dir={-1}/>

        {/* ── Modal card ── */}
        <div className="flex-1 bg-cream flex flex-col md:flex-row overflow-hidden rounded-none md:rounded-xl shadow-2xl h-screen md:h-auto md:max-h-[88vh]">

          {/* ── LEFT : média ── */}
          <div
            className="relative bg-ink flex items-center justify-center shrink-0 w-full md:w-[440px] aspect-square md:aspect-auto md:self-stretch"
            onTouchStart={e => { touchY.current = e.touches[0].clientY }}
            onTouchEnd={e => {
              const dy = e.changedTouches[0].clientY - touchY.current
              if (Math.abs(dy) > 50) go(dy > 0 ? -1 : 1)
            }}
          >
            <MediaArea item={item}/>
            <div className="absolute bottom-3 inset-x-0 text-center text-[11px] text-white/50 pointer-events-none md:hidden">
              ← glisser pour naviguer →
            </div>
          </div>

          {/* ── RIGHT : info panel ── */}
          {/* flex-col + hauteur fixe : comments scrollent, actions + input toujours visibles */}
          <div className="flex flex-col flex-1 min-h-0 bg-cream md:h-[440px]">

            {/* Auteur + (si owner) badge visibilité */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-black/[0.09] shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-light flex items-center justify-center font-display text-base font-semibold text-accent shrink-0">
                  {authorInitial}
                </div>
                <div>
                  <div className="text-sm font-medium flex items-center gap-2">
                    {authorName}
                    {/* Badge visibilité — visible seulement pour l'artiste */}
                    {isOwner && (
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full uppercase tracking-wide font-medium ${
                        published
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-foreground/[0.07] text-foreground/40'
                      }`}>
                        {published ? 'Public' : 'Brouillon'}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-muted">
                    {authorHandle} · {item.date} · {idx + 1}/{dataset.length}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Bouton toggle visibilité — owner only */}
                {isOwner && (
                  <button
                    onClick={handleTogglePublished}
                    disabled={toggling}
                    title={published ? 'Passer en brouillon' : 'Rendre public'}
                    className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors
                                ${published
                                  ? 'text-emerald-500 hover:bg-emerald-50'
                                  : 'text-foreground/30 hover:bg-foreground/[0.07] hover:text-foreground/60'}
                                ${toggling ? 'opacity-40 cursor-not-allowed' : ''}`}
                  >
                    {published ? (
                      /* eye open */
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    ) : (
                      /* eye off */
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    )}
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="w-7 h-7 flex items-center justify-center rounded-full text-muted hover:bg-black/[0.07] hover:text-ink transition-colors shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Scrollable : titre + desc + tags + commentaires */}
            <div ref={bodyRef} className="flex-1 overflow-y-auto min-h-0 px-4">
              <div className="pt-3.5 pb-2">
                <h2 className="font-display text-xl font-semibold leading-snug mb-2">{item.title}</h2>
                <p className="text-[13px] leading-relaxed text-[#4a4340] mb-2.5">{item.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.map((t, i) => (
                    <span key={t} className={`text-[11px] px-2.5 py-0.5 rounded-full ${
                      i === 0 ? 'bg-accent/10 text-accent' : 'bg-black/[0.06] text-muted'
                    }`}>{t}</span>
                  ))}
                </div>
              </div>
              <div className="border-t border-black/[0.07] my-2"/>
              <div className="flex flex-col gap-3.5 pb-3">
                {comments.map((c, i) => (
                  <div key={i} className="flex gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-light shrink-0 flex items-center justify-center text-[11px] font-semibold text-accent font-display">
                      {c.initials}
                    </div>
                    <div>
                      <div className="text-xs font-medium">{c.name}</div>
                      <div className="text-xs leading-relaxed text-[#4a4340]">{c.text}</div>
                      <div className="text-[10px] text-muted mt-0.5">{c.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions — sous le scroll, toujours visible */}
            <div className="flex items-center gap-4 px-4 py-2.5 border-t border-black/[0.09] shrink-0">
              <button
                onClick={toggleLike}
                className={`flex items-center gap-1.5 text-[13px] font-medium transition-colors ${liked ? 'text-accent' : 'text-muted hover:text-ink'}`}
              >
                <svg className="w-5 h-5" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                {likes}
              </button>
              <button className="flex items-center gap-1.5 text-[13px] font-medium text-muted hover:text-ink transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                {item.comments}
              </button>
              <button className="flex items-center gap-1.5 text-[13px] font-medium text-muted hover:text-ink transition-colors ml-auto">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
                {item.shares}
              </button>
            </div>

            {/* Input commentaire — toujours visible */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-t border-black/[0.09] bg-cream shrink-0">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder="Ajouter un commentaire…"
                className="flex-1 border border-black/[0.09] rounded-full px-4 py-2 text-[13px] bg-cream outline-none focus:border-accent transition-colors"
              />
              <button
                onClick={send}
                className="w-8 h-8 rounded-full bg-ink text-cream flex items-center justify-center shrink-0 hover:bg-accent transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>

          </div>
        </div>

        <ArrowBtn dir={1}/>
      </div>
    </div>
  )
}
