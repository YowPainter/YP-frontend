'use client'
import { useEffect, useRef, useState } from 'react'
import type { Work, Article } from './types'
import { ArtworksService } from '@/lib/services/ArtworksService'
import { toast } from '@/lib/toast'
import { useQueryClient } from '@tanstack/react-query'
import { Loader2, Edit2, ShoppingBag, ChevronDown, CheckCircle2, MessageSquare, Trash2, X } from 'lucide-react'
import Image from 'next/image'
import { useAuthStore } from '@/store/authStore'
import { useQuery } from '@tanstack/react-query'

type Item = Work | Article
type Comment = { name: string; initials: string; text: string; time: string }

const SAMPLE: Comment[] = [
  { name: 'Sophie R.',  initials: 'SR', text: 'Absolument magnifique, cette profondeur est saisissante.',                        time: 'il y a 2h' },
  { name: 'Lucas M.',   initials: 'LM', text: "La technique est impeccable, j\u2019adore la façon dont la lumière est traitée.", time: 'il y a 5h' },
  { name: 'Amara D.',   initials: 'AD', text: 'Cela me touche beaucoup, merci pour ce partage.',                                 time: 'il y a 1j' },
  { name: 'Pierre L.',  initials: 'PL', text: 'Tu as encore surpassé toi-même avec cette œuvre.',                               time: 'il y a 2j' },
]

export default function PostModal({ dataset, initialIndex, onClose, onEdit, onSell, onDelete }: {
  dataset: Item[]; initialIndex: number; onClose: () => void; onEdit?: (item: any) => void; onSell?: (item: any) => void; onDelete?: (item: any) => void
}) {
  const [idx, setIdx]         = useState(initialIndex)
  const [liked, setLiked]     = useState(false)
  const [likes, setLikes]     = useState(0)
  const [input, setInput]     = useState('')
  const bodyRef               = useRef<HTMLDivElement>(null)
  const touchY                = useRef(0)
  const queryClient           = useQueryClient()
  const { user }              = useAuthStore()
  const [updatingStatus, setUpdatingStatus] = useState(false)
  
  const item                  = dataset[idx] as any
  const isVideo               = item.type === 'video'

  // Fetch real comments
  const { data: realComments, isLoading: isCommentsLoading } = useQuery({
    queryKey: ['artwork-comments', item.id],
    queryFn: () => ArtworksService.getComments(user?.slug || '', item.id),
    enabled: !!user?.slug && !!item.id,
  })

  const displayName = user?.artistName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Artiste'

  useEffect(() => {
    setLiked(false)
    setLikes(item.likes)
    if (bodyRef.current) bodyRef.current.scrollTop = 0
  }, [idx, item])

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

  const toggleLike = () => {
    setLiked(p => { setLikes(l => l + (p ? -1 : 1)); return !p })
  }

  const send = () => {
    if (!input.trim()) return
    // TODO: Implement ArtworksService.addComment mutation
    toast.success("Commentaire envoyé (simulé)")
    setInput('')
  }

  const STATUS_MAP: Record<string, any> = {
    'Brouillon': 'DRAFT',
    'Publié': 'PUBLISHED',
    'En Vente': 'ON_SALE',
    'Vendu': 'SOLD',
    'Archivé': 'ARCHIVED'
  }

  const handleStatusChange = async (label: string) => {
    const techStatus = STATUS_MAP[label] || label
    try {
      setUpdatingStatus(true)
      await ArtworksService.updateStatus(item.id, techStatus)
      toast.success(`Statut mis à jour : ${label}`)
      queryClient.invalidateQueries({ queryKey: ['artist-works'] })
    } catch (err) {
      toast.error(err, "Mise à jour du statut")
    } finally {
      setUpdatingStatus(false)
    }
  }

  const ArrowBtn = ({ dir }: { dir: -1 | 1 }) => (
    <button
      onClick={() => go(dir)}
      disabled={dir === -1 ? idx === 0 : idx === dataset.length - 1}
      className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-white border border-black/10 shadow-sm hover:bg-cream transition-colors disabled:opacity-0 shrink-0"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        {dir === -1
          ? <polyline points="15 18 9 12 15 6"/>
          : <polyline points="9 6 15 12 9 18"/>}
      </svg>
    </button>
  )

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="flex items-center gap-4 w-full max-w-6xl justify-center">
        <ArrowBtn dir={-1} />

        {/* ── modal card ── */}
        <div className="bg-background w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col md:flex-row h-full md:h-[85vh] max-h-[90vh]">

          {/* LEFT — image container */}
          <div
            className="w-full md:w-1/2 bg-foreground/5 relative flex items-center justify-center shrink-0 min-h-[300px] group/img"
            onTouchStart={e => { touchY.current = e.touches[0].clientY }}
            onTouchEnd={e => { const dy = e.changedTouches[0].clientY - touchY.current; if (Math.abs(dy) > 50) go(dy > 0 ? -1 : 1) }}
          >
            {/* Background Blur Effect */}
            {item.imageUrls?.[0] && (
              <div className="absolute inset-0 opacity-30 blur-2xl scale-110 pointer-events-none">
                <Image src={item.imageUrls[0]} alt="" fill sizes="100vw" className="object-cover" />
              </div>
            )}

            {/* Main Image Container */}
            {item.imageUrls?.[0] ? (
              <div className="relative w-full h-full flex items-center justify-center bg-[#FDFCFB] overflow-hidden group/img">
                {/* Subtle inner shadow for depth */}
                <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.03)] z-0" />
                <Image 
                  src={item.imageUrls[0]} 
                  alt={item.title} 
                  fill 
                  sizes="100vw"
                  className="object-contain p-12 drop-shadow-2xl z-10 transition-transform duration-700 group-hover/img:scale-[1.02]" 
                />
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center font-display text-xl text-white/40"
                   style={{ background: item.bg }}>
                {item.title}
              </div>
            )}

            {isVideo && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                <div className="w-16 h-16 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center backdrop-blur-md shadow-2xl">
                  <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                </div>
              </div>
            )}
            
            <div className="absolute top-4 left-4 bg-black/40 text-white/90 text-[10px] px-3 py-1 rounded-full uppercase tracking-[0.2em] backdrop-blur-md border border-white/10 z-20 font-bold">
              {isVideo ? '▶ Vidéo' : 'Œuvre'}
            </div>
          </div>

          {/* RIGHT — info panel */}
          <div className="w-full md:w-1/2 flex flex-col h-full overflow-hidden bg-background">

            {/* header auteur */}
            <div className="px-6 py-5 border-b border-foreground/10 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center font-display text-base font-semibold text-accent shrink-0 overflow-hidden border border-foreground/10">
                  {user?.profilePictureUrl ? (
                    <Image src={user.profilePictureUrl} alt="" width={40} height={40} className="object-cover" />
                  ) : (
                    displayName.charAt(0)
                  )}
                </div>
                <div>
                  <div className="font-serif text-lg font-semibold leading-tight">{displayName}</div>
                  <div className="text-[10px] text-foreground/40 mt-0.5 uppercase tracking-widest">
                    @{user?.email?.split('@')[0]} · {item.date} · {idx + 1}/{dataset.length}
                  </div>
                </div>
              </div>
              <button onClick={onClose}
                      className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center hover:bg-foreground/10 transition-colors shrink-0">
                <X size={20} />
              </button>
            </div>

            {/* scrollable — titre + desc + tags + commentaires */}
            <div ref={bodyRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              <div>
                <h2 className="font-serif text-2xl font-semibold leading-snug mb-3">{item.title}</h2>
                <p className="text-sm leading-relaxed text-foreground/70 font-light mb-4">{item.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {(item.tags || []).map((t: string, i: number) => (
                    <span key={t} className="flex items-center gap-1.5 px-3 py-1 bg-foreground/5 text-foreground/70 text-[11px] rounded-full border border-foreground/10 uppercase tracking-wider font-bold">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="border-t border-foreground/10"/>
              
              <div className="flex flex-col gap-5">
                <h3 className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em]">Commentaires</h3>
                {isCommentsLoading ? (
                  <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 animate-spin text-accent/30" /></div>
                ) : realComments && realComments.length > 0 ? (
                  realComments.map((c: any, i: number) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-foreground/5 shrink-0 flex items-center justify-center text-[11px] font-semibold text-accent font-display overflow-hidden border border-foreground/10">
                        {c.userProfilePictureUrl ? (
                          <Image src={c.userProfilePictureUrl} alt="" width={32} height={32} className="object-cover" />
                        ) : (
                          (c.userFullName || 'A').charAt(0)
                        )}
                      </div>
                      <div className="flex-1 bg-foreground/5 p-3 rounded-xl rounded-tl-sm">
                        <div className="text-xs font-bold mb-1">{c.userFullName}</div>
                        <div className="text-sm leading-relaxed text-foreground/80 font-light">{c.content}</div>
                        <div className="text-[10px] text-foreground/40 mt-2 uppercase tracking-widest">{new Date(c.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center opacity-40">
                    <MessageSquare size={32} strokeWidth={1} className="mb-3" />
                    <p className="text-sm italic font-light">Aucun commentaire pour le moment.</p>
                  </div>
                )}
              </div>
            </div>

            {/* ── Footer: Admin Actions (Artist Only) ── */}
            {onEdit && item.type !== 'Article' && (
              <div className="px-6 py-5 border-t border-foreground/10 flex flex-col gap-4 shrink-0 bg-foreground/[0.02]">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em]">Statut de l'œuvre</label>
                  <div className="relative w-[180px]">
                    <select 
                      value={Object.keys(STATUS_MAP).find(k => STATUS_MAP[k] === item.status) || 'Brouillon'}
                      disabled={updatingStatus}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      className="w-full appearance-none bg-white border border-foreground/10 py-2 pl-4 pr-8 rounded-full text-xs font-semibold focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all cursor-pointer disabled:opacity-50 shadow-sm"
                    >
                      {Object.keys(STATUS_MAP).map(label => (
                        <option key={label} value={label}>{label}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-foreground/40" />
                  </div>
                </div>
                
                <div className="flex gap-2.5">
                  <button 
                    onClick={() => onEdit?.(item)}
                    className="flex-1 py-2.5 px-3 border border-foreground/10 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-foreground hover:text-white transition-all flex items-center justify-center gap-1.5 bg-white shadow-sm text-foreground/80"
                  >
                    <Edit2 size={14} /> <span className="hidden sm:inline">Modifier</span>
                  </button>
                  <button 
                    onClick={() => onSell?.(item)}
                    className="flex-[1.2] py-2.5 px-3 bg-ink text-white rounded-full text-[10px] font-bold uppercase tracking-widest shadow-md hover:bg-accent hover:shadow-lg transition-all flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag size={14} /> Boutique
                  </button>
                  {onDelete && (
                    <button 
                      onClick={() => {
                        if(confirm('Voulez-vous vraiment supprimer cette œuvre ?')) {
                          onDelete(item);
                        }
                      }}
                      className="flex-1 py-2.5 px-3 border border-red-100 bg-red-50 text-red-600 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Trash2 size={14} /> <span className="hidden sm:inline">Supprimer</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* likes / commentaires / partages — sous le scroll, toujours visible */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-foreground/10 shrink-0 bg-background">
              <div className="flex items-center gap-6">
                <button onClick={toggleLike}
                        className={`flex items-center gap-2 text-sm font-medium transition-colors ${liked ? 'text-accent' : 'text-foreground/60 hover:text-foreground'}`}>
                  <svg className="w-5 h-5" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                  {likes}
                </button>
                <button className="flex items-center gap-2 text-sm font-medium text-foreground/60 hover:text-foreground transition-colors">
                  <MessageSquare size={18} strokeWidth={1.8} />
                  {item.comments}
                </button>
              </div>
              <button className="flex items-center gap-2 text-sm font-medium text-foreground/60 hover:text-foreground transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
                {item.shares}
              </button>
            </div>

            {/* input commentaire — toujours visible */}
            <div className="flex items-center gap-3 px-6 py-4 border-t border-foreground/10 shrink-0 bg-background">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder="Ajouter un commentaire…"
                className="flex-1 bg-foreground/5 border border-foreground/10 rounded-full px-5 py-3 text-sm outline-none focus:border-accent transition-colors"
              />
              <button onClick={send}
                      className="w-11 h-11 rounded-full bg-ink text-white flex items-center justify-center shrink-0 hover:bg-accent transition-colors shadow-md">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>

          </div>
        </div>

        <ArrowBtn dir={1} />
      </div>
    </div>
  )
}
