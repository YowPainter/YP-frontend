'use client'
import { useState } from 'react'
import Image from 'next/image'
import FrameCard from '@/components/artdashboard/FrameCard'
import BagCard from '@/components/artdashboard/BagCard'
import TicketCard from '@/components/artdashboard/TicketCard'
import PostModal from '@/components/artdashboard/PostModal'
import { useAuthStore } from '@/store/authStore'
import { EditProfileModal } from '@/components/dashboard/EditProfileModal'
import { AnimatedBlob } from '@/components/ui/AnimatedBlob'
import { AbstractShapes } from '@/components/ui/AbstractShapes'
import Link from 'next/link'
import { LogOut, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Skeleton, SkeletonCircle } from '@/components/ui/Skeleton'
import { Work, Article } from '@/components/artdashboard/types'

import { useQuery } from '@tanstack/react-query'
import { ArtistsService } from '@/lib/services/ArtistsService'
import { ArtworksService } from '@/lib/services/ArtworksService'
import { ShopOrdersService } from '@/lib/services/ShopOrdersService'
import { EventsService } from '@/lib/services/EventsService'


/* ─────────────────────────────────────────────
   STATUS BADGE
 ───────────────────────────────────────────── */
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    'livré':    'bg-emerald-50 text-emerald-700',
    'expédié':  'bg-sky-50 text-sky-700',
    'en cours': 'bg-amber-50 text-amber-700',
    'en attente': 'bg-rose-50 text-rose-700',
  }
  return (
    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full uppercase tracking-wide ${map[status] || 'bg-gray-50 text-gray-700'}`}>
      {status}
    </span>
  )
}

const GRADIENTS = [
  'linear-gradient(135deg,#e8c4a0,#c8804a)',
  'linear-gradient(135deg,#a8c4d0,#5888a8)',
  'linear-gradient(135deg,#d4c4b8,#9a7060)',
  'linear-gradient(135deg,#c8d4a0,#7a9850)',
  'linear-gradient(135deg,#dcc8e0,#9870a8)',
]

/* ── Petits composants inline ── */
type Tab = 'oeuvres' | 'articles' | 'evenements'
type ModalState = { dataset: (Work | Article)[]; index: number } | null

function PlusIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  )
}

function CreateBtn({ label }: { label: string }) {
  return (
    <button className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-foreground text-background text-xs font-medium hover:bg-accent hover:text-white transition-colors shrink-0 shadow-sm">
      <PlusIcon/>{label}
    </button>
  )
}

export default function ArtistDashboardPage() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const displayName = user?.artistName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Artiste'
  const [tab, setTab]       = useState<Tab>('oeuvres')
  const [filter, setFilter] = useState<'tous' | 'vente' | 'vendus'>('tous')
  const [modal, setModal]   = useState<ModalState>(null)
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)

  // 1. Stats / Analytics
  const { data: analyticsData, isLoading: isAnalyticsLoading } = useQuery({
    queryKey: ['artist-analytics'],
    queryFn: () => ArtistsService.getMyAnalytics(),
    enabled: !!user,
  })

  // 2. Œuvres
  const { data: worksData, isLoading: isArtworksLoading } = useQuery({
    queryKey: ['artist-works', user?.id],
    queryFn: () => ArtworksService.getMyArtworks(),
    enabled: !!user,
  })

  // 3. Articles (Inventory)
  const { data: articlesData, isLoading: isInventoryLoading } = useQuery({
    queryKey: ['artist-inventory'],
    queryFn: () => ShopOrdersService.getInventory(),
    enabled: !!user,
  })

  // 4. Événements
  const { data: eventsData, isLoading: isEventsLoading } = useQuery({
    queryKey: ['artist-events', user?.id],
    queryFn: () => EventsService.getMyEvents(),
    enabled: !!user,
  })

  const WORKS: Work[] = (worksData || []).map((w, index) => ({
    id: w.id!,
    title: w.title!,
    type: w.imageUrls && w.imageUrls.length > 0 ? 'image' : 'video',
    bg: GRADIENTS[index % GRADIENTS.length],
    likes: w.likeCount || 0,
    comments: 0,
    shares: 0,
    date: new Date(w.publishedAt || w.createdAt!).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
    desc: w.description || '',
    tags: w.tags || [],
  }))

  const ARTICLES: Article[] = (articlesData || []).map((p, index) => ({
    id: p.id!,
    title: p.name!,
    type: 'Article',
    price: `${p.price} €`,
    sold: !p.active || p.stockQuantity === 0,
    bg: GRADIENTS[(index + 2) % GRADIENTS.length],
    handleColor: '#7a5030',
    likes: 0,
    comments: 0,
    shares: 0,
    date: '',
    desc: p.description || '',
    tags: [],
  }))

  const filtered = filter === 'vente' ? ARTICLES.filter(a => !a.sold)
                 : filter === 'vendus' ? ARTICLES.filter(a => a.sold)
                 : ARTICLES

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id:'oeuvres',    label:'Œuvres',     icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><rect x="6" y="6" width="12" height="12" rx="1"/></svg> },
    { id:'articles',   label:'Articles',   icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg> },
    { id:'evenements', label:'Évènements', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24"><path d="M2 9a2 2 0 0 1 0-4V3h20v2a2 2 0 0 1 0 4v2a2 2 0 0 1 0 4v2H2v-2a2 2 0 0 1 0-4V9z"/></svg> },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground antialiased font-sans canvas-texture canvas-grain relative selection:bg-accent/30">
      {/* ── Ambient Backgrounds artistiques ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden mix-blend-multiply dark:mix-blend-screen opacity-70">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(194,109,92,0.15),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_top_right,rgba(212,136,120,0.2),transparent_60%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(30,28,26,0.08),transparent_50%)] dark:bg-[radial-gradient(ellipse_at_bottom_left,rgba(245,244,240,0.05),transparent_50%)]"></div>
        
        {/* Formes Abstraites (Art) */}
        <AnimatedBlob className="top-[-10%] left-[-15%] w-[60vw] h-[60vw] blur-3xl opacity-20" color="accent" />
        <AnimatedBlob className="bottom-[10%] right-[-5%] w-[45vw] h-[45vw] blur-3xl opacity-30" color="slate" />
        <AnimatedBlob className="top-[30%] left-[20%] w-[35vw] h-[35vw] blur-2xl opacity-10" color="accent" />
        <AnimatedBlob className="bottom-[30%] left-[-10%] w-[25vw] h-[25vw] blur-xl opacity-15" color="slate" />
        <AbstractShapes />
      </div>

      {/* ── Topbar Harmonisée ── */}
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

      {/* ── Profil Harmonisé ── */}
      <div className="bg-background/60 backdrop-blur-md border-b border-foreground/10 relative z-10">
        <div className="h-[220px] w-full relative border-b border-foreground/10 shadow-inner">
          <Image src="/images/login-art.png" alt="Cover art" fill className="object-cover opacity-90 dark:opacity-60" />
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
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Modifier
            </button>
          </div>
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <div className="font-serif text-[25px] font-semibold leading-tight">{displayName}</div>
              <div className="text-[13px] text-foreground/50 mt-0.5">@{user?.email?.split('@')[0] || 'artiste'}</div>
            </div>
          </div>
          <p className="text-[13px] leading-relaxed text-foreground/70 mb-3.5 max-w-md">
            Peintre expressionniste. Huile &amp; acrylique. Je peins ce que les mots ne peuvent pas dire.
          </p>
          <div className="flex gap-6 pt-3 border-t border-foreground/10">
            {isAnalyticsLoading ? (
              <>
                <div className="w-16"><Skeleton className="h-4 w-full mb-1"/><Skeleton className="h-3 w-3/4"/></div>
                <div className="w-16"><Skeleton className="h-4 w-full mb-1"/><Skeleton className="h-3 w-3/4"/></div>
                <div className="w-16"><Skeleton className="h-4 w-full mb-1"/><Skeleton className="h-3 w-3/4"/></div>
              </>
            ) : analyticsData ? (
              <>
                <div>
                  <div className="font-serif text-xl font-semibold leading-none">{analyticsData.totalLikes || 0}</div>
                  <div className="text-[11px] text-foreground/50 mt-1 uppercase tracking-wider">Likes</div>
                </div>
                <div>
                  <div className="font-serif text-xl font-semibold leading-none">{analyticsData.totalSales || 0}</div>
                  <div className="text-[11px] text-foreground/50 mt-1 uppercase tracking-wider">Ventes</div>
                </div>
                <div>
                  <div className="font-serif text-xl font-semibold leading-none">{analyticsData.totalArtworks || 0}</div>
                  <div className="text-[11px] text-foreground/50 mt-1 uppercase tracking-wider">Œuvres</div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>

      {/* ── Tabnav Harmonisée ── */}
      <nav className="sticky top-[60px] z-40 glass-elegant shadow-sm">
        <div className="max-w-[900px] mx-auto px-4 md:px-8 flex overflow-x-auto no-scrollbar">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
                    className={`relative flex items-center gap-2 px-5 py-3.5 text-xs uppercase tracking-[0.06em] transition-colors whitespace-nowrap ${tab === t.id ? 'text-foreground font-semibold' : 'text-foreground/50 hover:text-foreground'}`}>
              {t.icon}{t.label}
              {tab === t.id && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent rounded-t"/>}
            </button>
          ))}
        </div>
      </nav>

      {/* ── Contenu ── */}
      <div className="pb-12 relative z-10 max-w-[900px] mx-auto px-4 md:px-8">
            {tab === 'oeuvres' && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
                {isArtworksLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="aspect-square wood-outer p-2.5 opacity-40"><Skeleton className="w-full h-full" /></div>
                  ))
                ) : WORKS.map((work, i) => (
                  <FrameCard key={work.id} work={work} onClick={() => setModal({ dataset: WORKS, index: i })} />
                ))}
              </div>
            )}
            {tab === 'articles' && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
                {isInventoryLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex flex-col gap-2 opacity-40"><Skeleton className="aspect-square rounded-xl" /><Skeleton className="h-8 w-full rounded-md" /></div>
                  ))
                ) : ARTICLES.map((art, i) => (
                  <BagCard key={art.id} article={art} onClick={() => setModal({ dataset: ARTICLES, index: i })} />
                ))}
              </div>
            )}
            {tab === 'evenements' && (
              <div className="flex flex-col gap-3">
                {isEventsLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full rounded-xl opacity-40" />
                  ))
                ) : (eventsData || []).map(evt => (
                  <TicketCard 
                    key={evt.id}
                    title={evt.name!}
                    subtitle={evt.location!}
                    date={evt.startDateTime ? new Date(evt.startDateTime).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Date à préciser'}
                    tickets={`🎟 ${evt.reservedCount || 0} / ${evt.maxCapacity || '∞'} billets`}
                    extra=""
                    status={evt.startDateTime && new Date(evt.startDateTime) > new Date() ? 'upcoming' : 'past'}
                  />
                ))}
                {(!isEventsLoading && (!eventsData || eventsData.length === 0)) && (
                  <p className="text-center py-12 text-muted text-sm">Aucun événement prévu.</p>
                )}
              </div>
            )}
      </div>

      {/* ── Modal ── */}
      {modal && (
        <PostModal dataset={modal.dataset} initialIndex={modal.index} onClose={() => setModal(null)}/>
      )}
      {/* ── Modal d'Édition Profil ── */}
      {isEditProfileOpen && (
        <EditProfileModal onClose={() => setIsEditProfileOpen(false)} />
      )}
    </div>
  )
}
