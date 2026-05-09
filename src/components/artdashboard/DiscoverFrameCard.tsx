'use client'
import Image from 'next/image'
import { useState } from 'react'
import type { Work } from './types'

type Artist = {
  name: string
  handle: string
  avatarUrl?: string
  slug: string
}

type Props = {
  work: Work
  artist: Artist
  onClick: () => void
  onArtistClick?: () => void
}

export default function DiscoverFrameCard({ work, artist, onClick, onArtistClick }: Props) {
  const [liked,   setLiked]   = useState(false)
  const [likes,   setLikes]   = useState(work.likes)
  const [comment, setComment] = useState('')

  function toggleLike(e: React.MouseEvent) {
    e.stopPropagation()
    setLiked(p => { setLikes(l => l + (p ? -1 : 1)); return !p })
    // TODO: ArtworksService.toggleLike(artist.slug, work.id)
  }

  function sendComment(e?: React.MouseEvent) {
    e?.stopPropagation()
    if (!comment.trim()) return
    // TODO: ArtworksService.addComment(artist.slug, work.id, { content: comment })
    setComment('')
  }

  return (
    <div className="flex flex-col">

      {/* ── En-tête artiste ── */}
      <div
        className="flex items-center gap-2.5 px-1 pb-2.5 cursor-pointer group/artist"
        onClick={e => { e.stopPropagation(); onArtistClick?.() }}
      >
        {/* Avatar */}
        <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0
                        ring-2 ring-transparent group-hover/artist:ring-accent transition-all">
          {artist.avatarUrl ? (
            <Image src={artist.avatarUrl} alt={artist.name} fill className="object-cover"/>
          ) : (
            <div className="w-full h-full bg-light flex items-center justify-center
                            font-serif text-sm font-semibold text-accent">
              {artist.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        {/* Nom + handle */}
        <div className="min-w-0">
          <p className="font-serif text-sm font-semibold text-ink leading-none truncate
                        group-hover/artist:text-accent transition-colors">
            {artist.name}
          </p>
          <p className="text-[10px] text-ink/40 mt-0.5 truncate">{artist.handle}</p>
        </div>
        {/* Flèche subtile */}
        <svg className="w-3.5 h-3.5 text-ink/20 group-hover/artist:text-accent transition-colors ml-auto shrink-0"
             fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <polyline points="9 6 15 12 9 18"/>
        </svg>
      </div>

      {/* ── Cadre bois ── */}
      <div className="wood-outer relative overflow-hidden rounded-sm p-2.5 transition-shadow cursor-pointer"
           onClick={onClick}>
        <div className="wood-inner rounded-px p-0.5">
          <div className="relative aspect-square overflow-hidden">

            {/* Média */}
            {work.type === 'video' && work.videoUrl ? (
              <video src={work.videoUrl}
                     className="absolute inset-0 w-full h-full object-cover"
                     muted playsInline preload="metadata"/>
            ) : work.imageUrl ? (
              <Image src={work.imageUrl} alt={work.title} fill
                     sizes="(max-width: 768px) 50vw, 25vw"
                     className="object-cover"/>
            ) : (
              <div className="absolute inset-0" style={{ background: work.bg }}/>
            )}

            {/* Badge vidéo */}
            {work.type === 'video' && (
              <div className="absolute top-1.5 right-1.5 flex items-center gap-1
                              bg-black/60 text-white/80 text-[10px] px-1.5 py-0.5
                              rounded backdrop-blur-sm">
                <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
                {work.duration ?? 'Vidéo'}
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ── Pieds du chevalet ── */}
      <div className="relative w-full" style={{ height: 28 }}>
        <svg viewBox="0 0 100 28" fill="none" className="absolute inset-0 w-full h-full"
             preserveAspectRatio="none">
          <line x1="30" y1="0" x2="8"  y2="28" stroke="#a06838" strokeWidth="3.5" strokeLinecap="round"/>
          <line x1="50" y1="0" x2="50" y2="28" stroke="#8a5828" strokeWidth="3"   strokeLinecap="round"/>
          <line x1="70" y1="0" x2="92" y2="28" stroke="#a06838" strokeWidth="3.5" strokeLinecap="round"/>
          <path d="M10 26 Q50 22 90 26" stroke="#7d4e2d" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        </svg>
      </div>

      {/* ── Zone infos ── */}
      <div className="rounded-b-xl rounded-t-sm border border-t-0 border-foreground/[0.08]
                      bg-[#FAF9F6] px-3 pt-2.5 pb-3 -mt-0.5 flex flex-col gap-2">

        {/* Titre */}
        <p className="font-serif text-sm font-semibold leading-snug text-ink truncate">
          {work.title}
        </p>

        {/* Description */}
        {work.desc && (
          <p className="text-[11px] leading-relaxed text-ink/55 line-clamp-2">
            {work.desc}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-0.5">

          {/* Like interactif */}
          <button
            onClick={toggleLike}
            className={`flex items-center gap-1 text-[11px] font-medium transition-colors
                        ${liked ? 'text-accent' : 'text-ink/45 hover:text-accent'}`}
          >
            <svg className="w-3.5 h-3.5" fill={liked ? 'currentColor' : 'none'}
                 stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            {likes}
          </button>

          {/* Partages */}
          <span className="flex items-center gap-1 text-[11px] text-ink/45">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
              <line x1="15.41" y1="6.51"  x2="8.59"  y2="10.49"/>
            </svg>
            {work.shares}
          </span>

          {/* Voir commentaires → PostModal */}
          <button
            onClick={onClick}
            className="flex items-center gap-1 text-[11px] text-ink/35
                       hover:text-accent transition-colors ml-auto"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            {work.comments}
          </button>

        </div>

        {/* Zone commentaire */}
        <div className="flex items-center gap-2 mt-0.5"
             onClick={e => e.stopPropagation()}>
          <input
            value={comment}
            onChange={e => setComment(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendComment()}
            placeholder="Laisser un commentaire…"
            className="flex-1 text-[11px] bg-foreground/[0.03] border border-foreground/[0.08]
                       rounded-full px-3 py-1.5 outline-none focus:border-accent
                       text-ink placeholder:text-ink/30 transition-colors"
          />
          {comment.trim() && (
            <button
              onClick={sendComment}
              className="w-6 h-6 rounded-full bg-ink text-cream flex items-center justify-center
                         shrink-0 hover:bg-accent transition-colors"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          )}
        </div>

      </div>
    </div>
  )
}
