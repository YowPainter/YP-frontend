'use client'
import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { useAuthStore } from '@/store/authStore'
import { EditProfileModal } from '@/components/dashboard/EditProfileModal'
import { AnimatedBlob } from '@/components/ui/AnimatedBlob'
import { AbstractShapes } from '@/components/ui/AbstractShapes'
import { useQuery } from '@tanstack/react-query'
import { BuyerProfileService } from '@/lib/services/BuyerProfileService'
import { ShopOrdersService } from '@/lib/services/ShopOrdersService'
import { getMyTickets } from '@/lib/api/events'
import Link from 'next/link'
import { LogOut, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Skeleton, SkeletonCircle } from '@/components/ui/Skeleton'
import { formatPrice } from '@/lib/utils'

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
export type LikedItem = {
  id: string
  kind: 'work' | 'article'
  artist: string
  artistHandle: string
  artistInitial: string
  title: string
  bg: string
  mediaType: 'image' | 'video'
  duration?: string
  date: string
  desc: string
  tags: string[]
  likes: number
  comments: number
  shares: number
  price?: string
  articleType?: string
}

type Purchase = {
  id: string
  title: string
  articleType: string
  price: string
  bg: string
  handleColor: string
  artist: string
  status: 'livré' | 'expédié' | 'en cours' | 'en attente'
  purchasedAt: string
}

type MyTicket = {
  id: string
  title: string
  artist: string
  date: string
  location: string
  status: 'upcoming' | 'past'
  ref: string
}
type DashComment = { name: string; initials: string; text: string; time: string }

const LIKED: LikedItem[] = []

const PURCHASES: Purchase[] = [

]

const MY_TICKETS: MyTicket[] = [
]

const SAMPLE_COMMENTS: DashComment[] = [

]

/* ─────────────────────────────────────────────
   STATUS BADGE
 ───────────────────────────────────────────── */
function StatusBadge({ status }: { status: Purchase['status'] }) {
  const map = {
    'livré': 'bg-emerald-50 text-emerald-700',
    'expédié': 'bg-sky-50 text-sky-700',
    'en cours': 'bg-amber-50 text-amber-700',
    'en attente': 'bg-rose-50 text-rose-700',
  }
  return (
    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full uppercase tracking-wide ${map[status]}`}>
      {status}
    </span>
  )
}

function EmptyState({ title, message, actionLabel, actionHref }: { title: string; message: string; actionLabel: string; actionHref: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-foreground/5 flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-foreground/20" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" /><path d="M8 12h8" />
        </svg>
      </div>
      <h3 className="font-serif text-lg font-semibold mb-1">{title}</h3>
      <p className="text-sm text-muted mb-6 max-w-xs">{message}</p>
      <Link href={actionHref} className="text-xs uppercase tracking-widest font-bold bg-ink text-cream px-6 py-2.5 rounded-full hover:bg-accent transition-colors">
        {actionLabel}
      </Link>
    </div>
  )
}

/* ─────────────────────────────────────────────
   LIKED GRID — cadres pour works, sacs pour articles
───────────────────────────────────────────── */
function LikedGrid({ items, onOpen }: { items: LikedItem[]; onOpen: (i: number) => void }) {
  if (items.length === 0)
    return <EmptyState
      title="Aucun favori"
      message="Vous n'avez pas encore d'œuvres favorites. Explorez la galerie pour découvrir des pépites."
      actionLabel="Explorer la galerie"
      actionHref="/galerie"
    />

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-5">
      {items.map((item, i) => (
        item.kind === 'work'
          ? <WorkCard key={item.id} item={item} onClick={() => onOpen(i)} />
          : <ArticleCard key={item.id} item={item} onClick={() => onOpen(i)} />
      ))}
    </div>
  )
}

function WorkCard({ item, onClick }: { item: LikedItem; onClick: () => void }) {
  return (
    <div className="cursor-pointer" onClick={onClick}>
      <div className="wood-outer relative overflow-hidden rounded-sm p-2.5 transition-shadow">
        <div className="wood-inner rounded-px p-0.5">
          <div className="relative aspect-square overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center font-display text-xs text-white/80 text-center p-2"
              style={{ background: item.bg }} />
            {/* gradient stats */}
            <div className="absolute bottom-0 left-0 right-0 flex items-center gap-2.5 px-2 pb-1.5 pt-5"
              style={{ background: 'linear-gradient(to top,rgba(20,16,12,.75),transparent)' }}>
              {/* artist avatar */}
              <div className="w-5 h-5 rounded-full bg-light flex items-center justify-center font-display text-[10px] font-semibold text-accent mr-auto">
                {item.artistInitial}
              </div>
              <span className="flex items-center gap-1 text-[11px] text-white/90">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {item.likes}
              </span>
            </div>
            {item.mediaType === 'video' && (
              <div className="absolute top-1.5 right-1.5 flex items-center gap-1 bg-black/60 text-white/80 text-[10px] px-1.5 py-0.5 rounded backdrop-blur-sm">
                <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                {item.duration}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ArticleCard({ item, onClick }: { item: LikedItem; onClick: () => void }) {
  return (
    <div className="flex flex-col cursor-pointer" onClick={onClick}>
      <svg className="block mx-auto w-[52%]" viewBox="0 0 80 28" fill="none"
        style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,.08))' }}>
        <path d="M10 26 Q10 4 40 4 Q70 4 70 26" stroke="#7a6050" strokeWidth="5" strokeLinecap="round" />
      </svg>
      <div className="relative rounded-xl -mt-0.5 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="w-full aspect-square flex items-center justify-center font-display text-sm text-white/80"
          style={{ background: item.bg }}>
          {item.title}
        </div>
        <div className="bg-ink px-2.5 py-2 flex items-center justify-between">
          <span className="text-[11px] text-white/50">{item.articleType}</span>
          <span className="text-xs text-light font-medium">{item.price}</span>
        </div>
        {/* artist name */}
        <div className="absolute top-2 left-2 bg-black/55 text-white/70 text-[10px] px-2 py-0.5 rounded backdrop-blur-sm">
          {item.artistInitial}
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   PURCHASES TAB
───────────────────────────────────────────── */
function PurchasesTab({ purchases }: { purchases: Purchase[] }) {
  if (purchases.length === 0)
    return <EmptyState
      title="Aucun achat"
      message="Vous n'avez pas encore effectué d'achats. Vos futures acquisitions apparaîtront ici."
      actionLabel="Faire un tour en boutique"
      actionHref="/shop"
    />

  return (
    <div className="flex flex-col gap-3">
      {purchases.map(p => (
        <div key={p.id} className="flex items-center gap-4 p-4 rounded-xl border border-black/[0.07] bg-cream hover:border-black/[0.15] transition-colors">
          {/* mini sac */}
          <div className="shrink-0 w-16">
            <svg className="block mx-auto w-[60%]" viewBox="0 0 80 28" fill="none">
              <path d="M10 26 Q10 4 40 4 Q70 4 70 26" stroke={p.handleColor} strokeWidth="6" strokeLinecap="round" />
            </svg>
            <div className="relative rounded-lg -mt-0.5 overflow-hidden shadow-sm">
              <div className="w-full aspect-square" style={{ background: p.bg }} />
              <div className="bg-ink h-3" />
            </div>
          </div>
          {/* infos */}
          <div className="flex-1 min-w-0">
            <div className="font-display text-base font-semibold truncate">{p.title}</div>
            <div className="text-[12px] text-muted mt-0.5">{p.articleType} · {p.artist}</div>
            <div className="text-[11px] text-muted mt-1">Commandé le {p.purchasedAt}</div>
          </div>
          {/* prix + statut */}
          <div className="shrink-0 flex flex-col items-end gap-1.5">
            <span className="font-display text-base font-semibold text-accent">{p.price}</span>
            <StatusBadge status={p.status} />
          </div>
        </div>
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────────
   TICKETS TAB
───────────────────────────────────────────── */
function QRCode({ value }: { value: string }) {
  // QR fictif en SVG — grille de carrés pseudo-aléatoire basée sur la ref
  const size = 7
  const cells = Array.from({ length: size * size }, (_, i) => {
    const c = value.charCodeAt(i % value.length)
    return (c + i * 13) % 3 !== 0
  })
  return (
    <div className="grid gap-[1px] bg-white p-1.5 rounded" style={{ gridTemplateColumns: `repeat(${size},1fr)`, width: 52, height: 52 }}>
      {cells.map((on, i) => (
        <div key={i} className={`rounded-[1px] ${on ? 'bg-ink' : 'bg-white'}`} />
      ))}
    </div>
  )
}

function TicketsTab({ tickets }: { tickets: MyTicket[] }) {
  if (tickets.length === 0)
    return <EmptyState
      title="Aucun billet"
      message="Vous n'avez pas encore de billets pour des expositions. Réservez votre prochaine visite dès maintenant."
      actionLabel="Voir les expositions"
      actionHref="/events"
    />

  const upcoming = tickets.filter(t => t.status === 'upcoming')
  const past = tickets.filter(t => t.status === 'past')

  const TicketRow = ({ t }: { t: MyTicket }) => (
    <div className={`rounded-xl overflow-hidden border border-black/[0.07] ${t.status === 'past' ? 'opacity-60' : ''}`}>
      {/* header sombre */}
      <div className="bg-ink px-4 py-3 flex items-start justify-between gap-3">
        <div>
          <div className="text-sm text-cream font-medium leading-snug">{t.title}</div>
          <div className="text-[11px] text-light/60 mt-0.5">{t.artist}</div>
        </div>
        <span className={`text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider font-medium shrink-0 mt-0.5 ${t.status === 'upcoming' ? 'bg-accent/25 text-light' : 'bg-white/[0.08] text-white/35'
          }`}>
          {t.status === 'upcoming' ? 'À venir' : 'Passé'}
        </span>
      </div>
      {/* zone ticket */}
      <div className="relative bg-cream px-4 py-3">
        {/* encoches */}
        <div className="absolute -top-2 -left-2 w-4 h-4 rounded-full bg-white border border-black/[0.07]" />
        <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-white border border-black/[0.07]" />
        <div className="border-t border-dashed border-black/[0.12] mb-3" />
        <div className="flex items-end justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-1.5 text-xs text-muted mb-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {t.date}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted mb-2">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
              </svg>
              {t.location}
            </div>
            <div className="text-[10px] text-muted/70 font-mono tracking-wider">{t.ref}</div>
          </div>
          {/* QR code fictif */}
          <QRCode value={t.ref} />
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col gap-6">
      {upcoming.length > 0 && (
        <div>
          <div className="text-[11px] uppercase tracking-[0.08em] text-muted mb-3">À venir</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {upcoming.map(t => <TicketRow key={t.id} t={t} />)}
          </div>
        </div>
      )}
      {past.length > 0 && (
        <div>
          <div className="text-[11px] uppercase tracking-[0.08em] text-muted mb-3">Passés</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {past.map(t => <TicketRow key={t.id} t={t} />)}
          </div>
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────
   MODAL LECTURE (likes)
───────────────────────────────────────────── */
function LikeModal({ dataset, initialIndex, onClose }: {
  dataset: LikedItem[]; initialIndex: number; onClose: () => void
}) {
  const [idx, setIdx] = useState(initialIndex)
  const [liked, setLiked] = useState(true)      // déjà liké par définition
  const [likes, setLikes] = useState(0)
  const [comments, setComs] = useState<DashComment[]>([])
  const [input, setInput] = useState('')
  const bodyRef = useRef<HTMLDivElement>(null)
  const touchY = useRef(0)
  const item = dataset[idx]

  useEffect(() => {
    setLiked(true)
    setLikes(item.likes)
    setComs(SAMPLE_COMMENTS.slice(0, Math.min(item.comments, 4)))
    if (bodyRef.current) bodyRef.current.scrollTop = 0
  }, [idx, item])

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') go(-1)
      if (e.key === 'ArrowRight') go(1)
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  })

  const go = (d: number) => { const n = idx + d; if (n >= 0 && n < dataset.length) setIdx(n) }

  const toggleLike = () => setLiked(p => { setLikes(l => l + (p ? -1 : 1)); return !p })

  const send = () => {
    if (!input.trim()) return
    setComs(c => [{ name: 'Julien B.', initials: 'JB', text: input.trim(), time: "à l\u2019instant" }, ...c] as DashComment[])
    setInput('')
  }

  const ArrowBtn = ({ dir }: { dir: -1 | 1 }) => (
    <button onClick={() => go(dir)} disabled={dir === -1 ? idx === 0 : idx === dataset.length - 1}
      className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-white border border-black/10 shadow-sm hover:bg-cream transition-colors disabled:opacity-0 shrink-0">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        {dir === -1 ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 6 15 12 9 18" />}
      </svg>
    </button>
  )

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="flex items-center gap-3 w-full max-w-[940px] px-2 md:px-0">
        <ArrowBtn dir={-1} />

        <div className="flex-1 bg-cream flex flex-col md:flex-row overflow-hidden rounded-none md:rounded-xl shadow-2xl h-screen md:h-auto md:max-h-[88vh]">

          {/* LEFT — image */}
          <div className="relative bg-ink flex items-center justify-center shrink-0 w-full md:w-[440px] aspect-square md:aspect-auto md:self-stretch"
            onTouchStart={e => { touchY.current = e.touches[0].clientY }}
            onTouchEnd={e => { const dy = e.changedTouches[0].clientY - touchY.current; if (Math.abs(dy) > 50) go(dy > 0 ? -1 : 1) }}>
            <div className="absolute inset-0 flex items-center justify-center font-display text-xl text-white/40"
              style={{ background: item.bg }}>{item.title}</div>
            {item.mediaType === 'video' && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-14 h-14 rounded-full bg-white/15 border-2 border-white/30 flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                </div>
              </div>
            )}
            <div className="absolute top-3 left-3 bg-black/55 text-white/70 text-[10px] px-2 py-0.5 rounded uppercase tracking-widest backdrop-blur-sm">
              {item.kind === 'article' ? item.articleType : (item.mediaType === 'video' ? '▶ Vidéo' : 'Image')}
            </div>
            <div className="absolute bottom-3 inset-x-0 text-center text-[11px] text-white/50 pointer-events-none md:hidden">
              ← glisser pour naviguer →
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex flex-col flex-1 min-h-0 bg-cream md:h-[440px]">

            {/* auteur */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-black/[0.09] shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-light flex items-center justify-center font-display text-base font-semibold text-accent shrink-0">
                  {item.artistInitial}
                </div>
                <div>
                  <div className="text-sm font-medium">{item.artist}</div>
                  <div className="text-[11px] text-muted">{item.artistHandle} · {item.date} · {idx + 1}/{dataset.length}</div>
                </div>
              </div>
              <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full text-muted hover:bg-black/[0.07] hover:text-ink transition-colors shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* scroll — titre + desc + tags + commentaires */}
            <div ref={bodyRef} className="flex-1 overflow-y-auto min-h-0 px-4">
              <div className="pt-3.5 pb-2">
                <h2 className="font-display text-xl font-semibold leading-snug mb-2">{item.title}</h2>
                {item.kind === 'article' && item.price && (
                  <div className="inline-block font-display text-base font-semibold text-accent mb-2">{item.price}</div>
                )}
                <p className="text-[13px] leading-relaxed text-[#4a4340] mb-2.5">{item.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.map((t, i) => (
                    <span key={t} className={`text-[11px] px-2.5 py-0.5 rounded-full ${i === 0 ? 'bg-accent/10 text-accent' : 'bg-black/[0.06] text-muted'}`}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="border-t border-black/[0.07] my-2" />
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

            {/* likes / com / partages */}
            <div className="flex items-center gap-4 px-4 py-2.5 border-t border-black/[0.09] shrink-0">
              <button onClick={toggleLike}
                className={`flex items-center gap-1.5 text-[13px] font-medium transition-colors ${liked ? 'text-accent' : 'text-muted hover:text-ink'}`}>
                <svg className="w-5 h-5" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {likes}
              </button>
              <button className="flex items-center gap-1.5 text-[13px] font-medium text-muted hover:text-ink transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                {item.comments}
              </button>
              <button className="flex items-center gap-1.5 text-[13px] font-medium text-muted hover:text-ink transition-colors ml-auto">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
                {item.shares}
              </button>
            </div>

            {/* input */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-t border-black/[0.09] bg-cream shrink-0">
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
                placeholder="Ajouter un commentaire…"
                className="flex-1 border border-black/[0.09] rounded-full px-4 py-2 text-[13px] bg-cream outline-none focus:border-accent transition-colors" />
              <button onClick={send}
                className="w-8 h-8 rounded-full bg-ink text-cream flex items-center justify-center shrink-0 hover:bg-accent transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
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

/* ─────────────────────────────────────────────
   PAGE PRINCIPALE
───────────────────────────────────────────── */
type Tab = 'likes' | 'achats' | 'billets'
type ModalState = { index: number } | null

const GRADIENTS = [
  'linear-gradient(135deg,#e8c4a0,#c8804a)',
  'linear-gradient(135deg,#a8c4d0,#5888a8)',
  'linear-gradient(135deg,#d4c4b8,#9a7060)',
  'linear-gradient(135deg,#c8d4a0,#7a9850)',
  'linear-gradient(135deg,#dcc8e0,#9870a8)',
]

export default function AmateurDashboardPage() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('likes')
  const [modal, setModal] = useState<ModalState>(null)
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
  const { user, logout } = useAuthStore()

  // 1. Profil
  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['buyer-profile'],
    queryFn: () => BuyerProfileService.getMe(),
    enabled: !!user,
  })
  const status = isProfileLoading ? 'loading' : 'success'

  // 2. Achats
  const { data: purchasesData, isLoading: isPurchasesLoading } = useQuery({
    queryKey: ['buyer-purchases'],
    queryFn: () => ShopOrdersService.getMyPurchases(),
    enabled: !!user,
  })

  // 3. Billets
  const { data: ticketsData, isLoading: isTicketsLoading } = useQuery({
    queryKey: ['buyer-tickets'],
    queryFn: () => getMyTickets(),
    enabled: !!user,
  })

  const PURCHASES: Purchase[] = (purchasesData || []).map((ord, idx) => ({
    id: ord.id!,
    title: ord.items?.[0]?.productName || 'Commande Art',
    articleType: 'Article',
    price: formatPrice(ord.totalAmount || 0),
    bg: GRADIENTS[idx % GRADIENTS.length],
    handleColor: '#6a6058',
    artist: 'Artiste Yow',
    status: ord.status === 'DELIVERED' ? 'livré' : (ord.status === 'SHIPPED' ? 'expédié' : (ord.status === 'PENDING_PAYMENT' ? 'en attente' : 'en cours')),
    purchasedAt: new Date(ord.createdAt!).toLocaleDateString('fr-FR'),
  }))

  const MY_TICKETS: MyTicket[] = (ticketsData || []).map(t => ({
    id: t.id!,
    title: t.eventTitle!,
    artist: 'Yow Painter',
    date: new Date(t.purchasedAt!).toLocaleDateString('fr-FR'),
    location: 'Lieu de l\'événement',
    status: 'upcoming',
    ref: t.id!,
  }))

  const displayName = `${profile?.firstName || user?.firstName || ''} ${profile?.lastName || user?.lastName || ''}`.trim() || 'Amateur'

  const TABS: { id: Tab; label: string; count: number; icon: React.ReactNode }[] = [
    {
      id: 'likes', label: 'Likes', count: LIKED.length,
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>,
    },
    {
      id: 'achats', label: 'Achats', count: PURCHASES.length,
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>,
    },
    {
      id: 'billets', label: 'Billets', count: MY_TICKETS.length,
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24"><path d="M2 9a2 2 0 0 1 0-4V3h20v2a2 2 0 0 1 0 4v2a2 2 0 0 1 0 4v2H2v-2a2 2 0 0 1 0-4V9z" /></svg>,
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground antialiased font-sans canvas-texture canvas-grain relative selection:bg-accent/30">
      {/* ── Ambient Backgrounds artistiques ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden mix-blend-multiply dark:mix-blend-screen opacity-70">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(194,109,92,0.15),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_top_right,rgba(212,136,120,0.2),transparent_60%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(30,28,26,0.08),transparent_50%)] dark:bg-[radial-gradient(ellipse_at_bottom_left,rgba(245,244,240,0.05),transparent_50%)]"></div>

        {/* Formes Abstraites (Art) */}
        <AnimatedBlob className="top-[-5%] right-[-10%] w-[50vw] h-[50vw] blur-3xl opacity-30" color="slate" />
        <AnimatedBlob className="bottom-[20%] left-[-20%] w-[60vw] h-[60vw] blur-3xl opacity-20" color="accent" />
        <AnimatedBlob className="top-[40%] right-[10%] w-[30vw] h-[30vw] blur-2xl opacity-10" color="slate" />
        <AnimatedBlob className="top-[60%] left-[5%] w-[25vw] h-[25vw] blur-2xl opacity-15" color="accent" />
        <AbstractShapes />
      </div>

      {/* Topbar Harmonisée */}
      <header className="sticky top-0 z-50 bg-background border-b border-foreground/10 px-4 md:px-8 shadow-sm relative">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-accent via-accent-light to-accent"></div>
        <div className="max-w-[900px] mx-auto h-[64px] flex items-center justify-between">
          <Link href="/" className="font-serif text-[24px] font-bold tracking-wide hover:opacity-80 transition-opacity">
            Yow<span className="italic text-accent">Painter</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-[13px] font-medium text-foreground/70 hover:text-accent transition-colors hidden sm:flex items-center gap-1.5 border border-foreground/10 px-4 py-1.5 rounded-full hover:border-accent">
              <LogOut size={14} className="rotate-180" />
              Retour galerie
            </Link>
            <div className="flex items-center gap-3 pl-4 border-l border-foreground/10">
              <button
                onClick={() => {
                  logout()
                  router.push('/')
                }}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-foreground/5 text-foreground/60 hover:text-rose-500 hover:bg-rose-500/10 transition-all hover:scale-105"
                title="Déconnexion"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Profil Harmonisé */}
      <div className="bg-background/60 backdrop-blur-md border-b border-foreground/10 relative z-10">
        <div className="h-[200px] w-full relative border-b border-foreground/10 shadow-inner">
          <Image src="/images/register-art.png" alt="Cover art" fill className="object-cover opacity-90 dark:opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
        </div>
        <div className="max-w-[900px] mx-auto px-4 md:px-8 pb-5 relative">
          <div className="flex items-end justify-between -mt-[46px] mb-3">
            <div className="w-[84px] h-[84px] rounded-full bg-background border-[4px] border-background flex items-center justify-center font-serif text-3xl font-semibold text-accent shadow-lg overflow-hidden relative z-10">
              {status === 'loading' ? (
                <SkeletonCircle className="w-full h-full" />
              ) : user?.profilePictureUrl ? (
                <Image src={user.profilePictureUrl} alt="Avatar" width={72} height={72} className="object-cover w-full h-full" />
              ) : (
                <span className="flex items-center justify-center w-full h-full bg-foreground/5 text-foreground/40 text-xl font-sans"><User /></span>
              )}
            </div>
            <button
              onClick={() => setIsEditProfileOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 border border-foreground/20 rounded-full text-xs font-medium hover:border-accent hover:text-accent hover:bg-accent/5 transition-all relative z-10 bg-background"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Modifier
            </button>
          </div>
          <div className="font-serif text-2xl font-semibold leading-tight">{displayName}</div>
          <div className="text-[13px] text-foreground/50 mt-0.5 mb-2">@{user?.email?.split('@')[0] || 'amateur'}</div>
          <p className="text-[13px] leading-relaxed text-foreground/70 mb-3.5 max-w-md">
            {user?.bio || "Amateur d'art et de peinture contemporaine. Collectionneur débutant."}
          </p>
          {/* stats */}
          <div className="flex gap-6 pt-3 border-t border-foreground/10">
            {isProfileLoading ? (
              <>
                <div className="w-16"><Skeleton className="h-4 w-full mb-1" /><Skeleton className="h-3 w-3/4" /></div>
                <div className="w-16"><Skeleton className="h-4 w-full mb-1" /><Skeleton className="h-3 w-3/4" /></div>
                <div className="w-16"><Skeleton className="h-4 w-full mb-1" /><Skeleton className="h-3 w-3/4" /></div>
              </>
            ) : (
              <>
                <div>
                  <div className="font-serif text-xl font-semibold leading-none">{LIKED.length}</div>
                  <div className="text-[11px] text-foreground/50 mt-1 uppercase tracking-wider">Likes</div>
                </div>
                <div>
                  <div className="font-serif text-xl font-semibold leading-none">{PURCHASES.length}</div>
                  <div className="text-[11px] text-foreground/50 mt-1 uppercase tracking-wider">Achats</div>
                </div>
                <div>
                  <div className="font-serif text-xl font-semibold leading-none">{MY_TICKETS.length}</div>
                  <div className="text-[11px] text-foreground/50 mt-1 uppercase tracking-wider">Billets</div>
                </div>
                <div>
                  <div className="font-serif text-xl font-semibold leading-none">0</div>
                  <div className="text-[11px] text-foreground/50 mt-1 uppercase tracking-wider">Suivis</div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tabnav Harmonisé */}
      <nav className="sticky top-[60px] z-40 glass-elegant shadow-sm">
        <div className="max-w-[900px] mx-auto px-4 md:px-8 flex overflow-x-auto no-scrollbar">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`relative flex items-center gap-2 px-5 py-3.5 text-xs uppercase tracking-[0.06em] transition-colors whitespace-nowrap ${tab === t.id ? 'text-foreground font-semibold' : 'text-foreground/50 hover:text-foreground'}`}>
              {t.icon}
              {t.label}
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium transition-colors ${tab === t.id ? 'bg-foreground text-background' : 'bg-foreground/5 text-foreground/60'}`}>
                {(t.id === 'likes' && false) || (t.id === 'achats' && isPurchasesLoading) || (t.id === 'billets' && isTicketsLoading) ? '…' : t.count}
              </span>
              {tab === t.id && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent rounded-t" />}
            </button>
          ))}
        </div>
      </nav>

      {/* Contenu */}
      <div className="max-w-[900px] mx-auto px-4 md:px-8 py-6 pb-16 relative z-10">

        {tab === 'likes' && (
          <LikedGrid items={LIKED} onOpen={i => setModal({ index: i })} />
        )}
        {tab === 'achats' && (
          isPurchasesLoading ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-xl opacity-40" />)}
            </div>
          ) : <PurchasesTab purchases={PURCHASES} />
        )}
        {tab === 'billets' && (
          isTicketsLoading ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-xl opacity-40" />)}
            </div>
          ) : <TicketsTab tickets={MY_TICKETS} />
        )}

      </div>

      {/* Modal Lecture */}
      {modal && (
        <LikeModal dataset={LIKED} initialIndex={modal.index} onClose={() => setModal(null)} />
      )}

      {/* Modal Edition Profil */}
      {isEditProfileOpen && (
        <EditProfileModal onClose={() => setIsEditProfileOpen(false)} />
      )}
    </div>
  )
}
