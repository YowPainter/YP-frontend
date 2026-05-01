'use client'

import { SafeImage } from '@/components/ui/SafeImage'
import Link from 'next/link'
import { useState, useRef } from 'react'
import type { Work } from './types'

interface ArtworkPostProps {
  work: Work
  artist: {
    name: string
    avatar?: string
    username?: string
    slug?: string
  }
  /** Si fourni → ouvre le modal (mode dashboard) */
  onClick?: () => void
  onDelete?: (id: string) => void
  /** Si true → mode public : pas de modal, commentaires inline */
  inlineComments?: boolean
}

export default function ArtworkPost({ work, artist, onClick, onDelete, inlineComments = false }: ArtworkPostProps) {
  const detailLink = `/${artist.slug || artist.username || 'gallery'}/gallery/${work.id}`
  const mainImage = work.imageUrls?.[0]
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(work.likes)
  const [expanded, setExpanded] = useState(false)
  const [commentOpen, setCommentOpen] = useState(false)
  const [commentInput, setCommentInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const DESC_LIMIT = 150
  const isLongDesc = (work.desc?.length || 0) > DESC_LIMIT

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    setLiked(prev => !prev)
    setLikes(prev => liked ? prev - 1 : prev + 1)
  }

  const handleCommentToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!inlineComments) {
      // Mode dashboard : ouvre le modal sur l'onglet commentaire
      onClick?.()
      return
    }
    setCommentOpen(prev => {
      if (!prev) setTimeout(() => inputRef.current?.focus(), 100)
      return !prev
    })
  }

  const handleSend = () => {
    if (!commentInput.trim()) return
    // TODO: appeler l'API de commentaire
    setCommentInput('')
    setCommentOpen(false)
  }

  return (
    <article className="bg-background border border-foreground/8 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 group flex flex-col">

      {/* ── Header: Profil ── */}
      <Link href={`/${artist.slug || artist.username || '#'}`} className="px-5 pt-5 pb-4 flex items-center gap-3 shrink-0 group/header">
        <div className="w-11 h-11 rounded-full bg-foreground/5 border border-foreground/10 flex items-center justify-center font-serif text-base font-semibold text-accent overflow-hidden shrink-0 group-hover/header:border-accent transition-colors">
          {artist.avatar ? (
            <SafeImage src={artist.avatar} alt={artist.name} width={44} height={44} sizes="44px" className="object-cover w-full h-full" />
          ) : (
            <span className="text-lg">{artist.name.charAt(0)}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-serif text-sm font-semibold leading-tight text-foreground truncate group-hover/header:text-accent transition-colors">{artist.name}</div>
          <div className="text-[10px] text-foreground/40 mt-0.5 uppercase tracking-widest font-bold truncate">
            {artist.username ? `@${artist.username}` : ''}{artist.username && work.date ? ' · ' : ''}{work.date}
          </div>
        </div>
      </Link>

      {/* ── Body: Texte ── */}
      <div
        className={`px-5 pb-4 ${onClick ? 'cursor-pointer' : ''}`}
        onClick={!inlineComments ? onClick : undefined}
      >
        <Link href={detailLink}>
          <h2 className="font-serif text-lg font-semibold leading-snug mb-2 group-hover:text-accent transition-colors duration-300">
            {work.title}
          </h2>
        </Link>
        {work.desc && (
          <div>
            <p className={`text-[13px] text-foreground/60 leading-relaxed font-light ${!expanded && isLongDesc ? 'line-clamp-3' : ''}`}>
              {work.desc}
            </p>
            {isLongDesc && (
              <button
                onClick={e => { e.stopPropagation(); setExpanded(p => !p) }}
                className="mt-1.5 text-[10px] font-black uppercase tracking-widest text-accent hover:text-accent/70 transition-colors"
              >
                {expanded ? 'Voir moins ↑' : 'Voir plus ↓'}
              </button>
            )}
          </div>
        )}
        {work.tags && work.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {work.tags.map(t => (
              <span key={t} className="text-[10px] font-bold text-accent/80 bg-accent/5 border border-accent/10 px-2.5 py-0.5 rounded-full uppercase tracking-widest">
                #{t.replace(/^#/, '')}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── Image ── */}
      {mainImage ? (
        <Link
          href={detailLink}
          className={`px-4 pb-3 ${onClick && !inlineComments ? 'cursor-pointer' : ''}`}
          onClick={!inlineComments ? onClick : undefined}
        >
          <div className="relative w-full aspect-[4/3] overflow-hidden rounded-xl border border-foreground/8 bg-foreground/[0.03]">
            <SafeImage
              src={mainImage}
              alt={work.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </Link>
      ) : (
        <div
          className={`mx-4 mb-3 rounded-xl h-48 flex items-center justify-center ${onClick && !inlineComments ? 'cursor-pointer' : ''}`}
          style={{ background: work.bg }}
          onClick={!inlineComments ? onClick : undefined}
        >
          <span className="font-serif text-white/60 text-sm italic">Aucune image</span>
        </div>
      )}

      {/* ── Footer: Actions ── */}
      <div className="px-5 py-3 border-t border-foreground/5 flex items-center gap-6 shrink-0">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-widest transition-all duration-200 ${
            liked ? 'text-accent' : 'text-foreground/40 hover:text-foreground/70'
          }`}
        >
          <svg className="w-4 h-4" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          {likes > 0 && <span>{likes}</span>}
        </button>

        <button
          onClick={handleCommentToggle}
          className={`flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-widest transition-colors ${
            commentOpen ? 'text-accent' : 'text-foreground/40 hover:text-foreground/70'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          {work.comments > 0 && <span>{work.comments}</span>}
        </button>

        {onDelete && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              if(confirm('Voulez-vous vraiment supprimer cette œuvre ?')) {
                onDelete(work.id);
              }
            }}
            className="ml-auto p-2 text-foreground/20 hover:text-rose-500 transition-colors"
            title="Supprimer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
            </svg>
          </button>
        )}
      </div>

      {/* ── Zone de commentaire inline (mode public uniquement) ── */}
      {inlineComments && commentOpen && (
        <div className="px-5 pb-5 border-t border-foreground/5 pt-4 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-foreground/5 border border-foreground/10 flex items-center justify-center text-[11px] font-bold text-accent shrink-0">
              {artist.name.charAt(0)}
            </div>
            <div className="flex-1 flex items-center gap-2 bg-foreground/[0.03] border border-foreground/10 rounded-full px-4 py-2.5 focus-within:border-accent transition-colors">
              <input
                ref={inputRef}
                value={commentInput}
                onChange={e => setCommentInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ajouter un commentaire…"
                className="flex-1 bg-transparent outline-none text-[13px] text-foreground placeholder:text-foreground/30"
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!commentInput.trim()}
              className="w-9 h-9 rounded-full bg-ink text-white flex items-center justify-center shrink-0 hover:bg-accent transition-colors shadow-md disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        </div>
      )}

    </article>
  )
}
