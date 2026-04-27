'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { LogOut, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import FrameCard from '@/components/artdashboard/FrameCard'
import BagCard   from '@/components/artdashboard/BagCard'
import TicketCard from '@/components/artdashboard/TicketCard'
import PostModal         from '@/components/artdashboard/PostModal'
import CreatePostModal   from '@/components/artdashboard/CreatePostModal'
import CreateArticleModal from '@/components/artdashboard/CreateArticleModal'
import CreateEventModal  from '@/components/artdashboard/CreateEventModal'
import WalletPanel       from '@/components/artdashboard/WalletPanel'

import { useAuthStore }       from '@/store/authStore'
import { EditProfileModal }   from '@/components/dashboard/EditProfileModal'
import { AnimatedBlob }       from '@/components/ui/AnimatedBlob'
import { AbstractShapes }     from '@/components/ui/AbstractShapes'
import { Skeleton, SkeletonCircle } from '@/components/ui/Skeleton'

import { ArtistsService }   from '@/lib/services/ArtistsService'
import { ArtworksService }   from '@/lib/services/ArtworksService'
import { EventsService }     from '@/lib/services/EventsService'
import { ArtworkResponse }   from '@/lib/models/ArtworkResponse'

import type { Work, Article } from '@/lib/types/types'

/* ─────────────────────────────────────────────
   Helpers — décode les métadonnées produit
   encodées dans description par CreateArticleModal
   Format : "[PRODUCT:Impression|PRICE:85|STOCK:10] texte libre"
───────────────────────────────────────────── */
function parseProductMeta(description: string | undefined, key: string): string | null {
  if (!description) return null
  const match = description.match(new RegExp(`\\[.*${key}:([^|\\]]+)`))
  return match?.[1]?.trim() ?? null
}
function parseCleanDesc(description: string | undefined): string {
  if (!description) return ''
  return description.replace(/^\[.*?\]\s*/, '')
}

/* ─────────────────────────────────────────────
   Gradients fallback (si pas encore d'image)
───────────────────────────────────────────── */
const GRADIENTS = [
  'linear-gradient(135deg,#e8c4a0,#c8804a)',
  'linear-gradient(135deg,#a8c4d0,#5888a8)',
  'linear-gradient(135deg,#d4c4b8,#9a7060)',
  'linear-gradient(135deg,#c8d4a0,#7a9850)',
  'linear-gradient(135deg,#dcc8e0,#9870a8)',
]

const HANDLE_COLORS = ['#7a5030','#6a6058','#8a6840','#587030','#7a5888']

/* ─────────────────────────────────────────────
   Petits composants partagés
───────────────────────────────────────────── */
type Tab        = 'oeuvres' | 'articles' | 'evenements'
type ModalState = { dataset: (Work | Article)[]; index: number } | null

function PlusIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5"  y1="12" x2="19" y2="12"/>
    </svg>
  )
}

function CreateBtn({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-foreground text-background text-xs font-medium hover:bg-accent hover:text-white transition-colors shrink-0 shadow-sm"
    >
      <PlusIcon/>{label}
    </button>
  )
}

/* ─────────────────────────────────────────────
   Page
───────────────────────────────────────────── */
export default function ArtistDashboardPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { user, logout } = useAuthStore()
  const displayName = user?.artistName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Artiste'

  const [tab, setTab]             = useState<Tab>('oeuvres')
  const [filter, setFilter]       = useState<'tous' | 'vente' | 'vendus'>('tous')
  const [modal, setModal]         = useState<ModalState>(null)
  const [isEditProfileOpen, setIsEditProfileOpen]     = useState(false)
  const [isCreatePostOpen, setIsCreatePostOpen]       = useState(false)
  const [isCreateArticleOpen, setIsCreateArticleOpen] = useState(false)
  const [isCreateEventOpen, setIsCreateEventOpen]     = useState(false)

  /* ── Queries ── */
  const { data: analyticsData, isLoading: isAnalyticsLoading } = useQuery({
    queryKey: ['artist-analytics'],
    queryFn: () => ArtistsService.getMyAnalytics(),
    enabled: !!user,
  })
  const { data: worksData, isLoading: isArtworksLoading } = useQuery({
    queryKey: ['artist-works', user?.id],
    queryFn:  () => ArtworksService.getMyArtworks(),
    enabled:  !!user,
  })
  const { data: eventsData, isLoading: isEventsLoading } = useQuery({
    queryKey: ['artist-events', user?.id],
    queryFn:  () => EventsService.getMyEvents(),
    enabled:  !!user,
  })

  /* ── Mapping ArtworkResponse → types UI ──────────────────────────────
     Un ArtworkResponse peut être un Work (post) ou un Article (en vente)
     selon son status :
       DRAFT / PUBLISHED / SUSPENDED → Work
       ON_SALE / SOLD                → Work ET Article
  ──────────────────────────────────────────────────────────────────── */
  const WORKS: Work[] = (worksData || []).map((w, i) => ({
    id:         w.id!,
    title:      w.title!,
    type:       'image' as const,          // videoUrl non prévu par ArtworkResponse actuel
    bg:         GRADIENTS[i % GRADIENTS.length],
    imageUrl:   w.imageUrls?.[0] ?? undefined,
    videoUrl:   undefined,
    published:  w.status === ArtworkResponse.status.PUBLISHED
             || w.status === ArtworkResponse.status.ON_SALE,
    status:     w.status!,
    technique:  w.technique,
    style:      w.style,
    dimensions: w.dimensions,
    likes:      w.likeCount || 0,
    comments:   w.viewCount || 0,           // viewCount utilisé en attendant commentCount
    shares:     0,
    date:       w.publishedAt
                  ? new Date(w.publishedAt).toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' })
                  : w.createdAt
                    ? new Date(w.createdAt).toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' })
                    : '',
    desc:       w.description || '',
    tags:       (w.tags || []).map(t => t.startsWith('#') ? t : `#${t}`),
  }))

  // Les articles = œuvres passées en ON_SALE ou SOLD
  const ARTICLES: Article[] = (worksData || [])
    .filter(w => w.status === ArtworkResponse.status.ON_SALE
              || w.status === ArtworkResponse.status.SOLD)
    .map((w, i) => ({
      id:          w.id!,
      title:       w.title!,
      // Le type produit et le prix sont encodés dans la description
      // Format : "[PRODUCT:Impression|PRICE:85|STOCK:10] description libre"
      type:        parseProductMeta(w.description, 'PRODUCT') || 'Article',
      price:       parseProductMeta(w.description, 'PRICE')
                     ? `${parseProductMeta(w.description, 'PRICE')} €`
                     : '—',
      sold:        w.status === ArtworkResponse.status.SOLD,
      bg:          GRADIENTS[(i + 2) % GRADIENTS.length],
      imageUrl:    w.imageUrls?.[0] ?? undefined,
      handleColor: HANDLE_COLORS[i % HANDLE_COLORS.length],
      likes:       w.likeCount || 0,
      comments:    0,
      shares:      0,
      date:        '',
      desc:        parseCleanDesc(w.description),
      tags:        (w.tags || []).map(t => t.startsWith('#') ? t : `#${t}`),
    }))

  const filtered = filter === 'vente'  ? ARTICLES.filter(a => !a.sold)
                 : filter === 'vendus' ? ARTICLES.filter(a =>  a.sold)
                 : ARTICLES

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id:'oeuvres',    label:'Œuvres',     icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><rect x="6" y="6" width="12" height="12" rx="1"/></svg> },
    { id:'articles',   label:'Articles',   icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg> },
    { id:'evenements', label:'Évènements', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24"><path d="M2 9a2 2 0 0 1 0-4V3h20v2a2 2 0 0 1 0 4v2a2 2 0 0 1 0 4v2H2v-2a2 2 0 0 1 0-4V9z"/></svg> },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground antialiased font-sans canvas-texture canvas-grain relative selection:bg-accent/30">

      {/* ── Ambient backgrounds ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden mix-blend-multiply dark:mix-blend-screen opacity-70">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(194,109,92,0.15),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_top_right,rgba(212,136,120,0.2),transparent_60%)]"/>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(30,28,26,0.08),transparent_50%)] dark:bg-[radial-gradient(ellipse_at_bottom_left,rgba(245,244,240,0.05),transparent_50%)]"/>
        <AnimatedBlob className="top-[-10%] left-[-15%] w-[60vw] h-[60vw] blur-3xl opacity-20" color="accent"/>
        <AnimatedBlob className="bottom-[10%] right-[-5%] w-[45vw] h-[45vw] blur-3xl opacity-30" color="slate"/>
        <AnimatedBlob className="top-[30%] left-[20%] w-[35vw] h-[35vw] blur-2xl opacity-10" color="accent"/>
        <AnimatedBlob className="bottom-[30%] left-[-10%] w-[25vw] h-[25vw] blur-xl opacity-15" color="slate"/>
        <AbstractShapes/>
      </div>

      {/* ── Topbar ── */}
      <header className="sticky top-0 z-50 glass-elegant border-b border-foreground/10 shadow-sm px-4 md:px-8">
        <div className="max-w-[900px] mx-auto h-[60px] flex items-center justify-between">
          <Link href="/" className="font-serif text-[21px] font-semibold tracking-wide">
            Yow<span className="italic text-accent">Painter</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-[13px] font-medium text-foreground/70 hover:text-accent transition-colors hidden sm:flex items-center gap-1.5 border border-foreground/10 px-4 py-1.5 rounded-full hover:border-accent">
              <LogOut size={14} className="rotate-180"/>
              Retour galerie
            </Link>
            <div className="flex items-center gap-3 pl-4 border-l border-foreground/10">
              <button
                onClick={() => { logout(); router.push('/') }}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-foreground/5 text-foreground/60 hover:text-rose-500 hover:bg-rose-500/10 transition-all hover:scale-105"
                title="Déconnexion"
              >
                <LogOut size={16}/>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Profil ── */}
      <div className="bg-background/60 backdrop-blur-md border-b border-foreground/10 relative z-10">
        <div className="h-[220px] w-full relative border-b border-foreground/10 shadow-inner">
          <Image src="/images/login-art.png" alt="Cover art" fill className="object-cover opacity-90 dark:opacity-60"/>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"/>
        </div>
        <div className="max-w-[900px] mx-auto px-4 md:px-8 pb-5 relative">
          <div className="flex items-end justify-between -mt-[46px] mb-3">
            <div className="w-[84px] h-[84px] rounded-full bg-background border-[4px] border-background flex items-center justify-center font-serif text-3xl font-semibold text-accent shadow-lg overflow-hidden relative z-10">
              {user?.profilePictureUrl ? (
                <Image src={user.profilePictureUrl} alt="Avatar" width={72} height={72} className="object-cover w-full h-full"/>
              ) : (
                <span className="flex items-center justify-center w-full h-full bg-foreground/5 text-foreground/40 text-xl font-sans">
                  <User/>
                </span>
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
          <div className="mb-2">
            <div className="font-serif text-[25px] font-semibold leading-tight">{displayName}</div>
            <div className="text-[13px] text-foreground/50 mt-0.5">@{user?.email?.split('@')[0] || 'artiste'}</div>
          </div>
          <p className="text-[13px] leading-relaxed text-foreground/70 mb-3.5 max-w-md">
            Peintre expressionniste. Huile &amp; acrylique. Je peins ce que les mots ne peuvent pas dire.
          </p>
          <div className="flex gap-6 pt-3 border-t border-foreground/10">
            {isAnalyticsLoading ? (
              <>
                {[0,1,2].map(i => <div key={i} className="w-16"><Skeleton className="h-4 w-full mb-1"/><Skeleton className="h-3 w-3/4"/></div>)}
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

          {/* ── Porte-monnaie ── */}
          <div className="mt-4">
            <WalletPanel/>
          </div>
        </div>
      </div>

      {/* ── Tabnav ── */}
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
      <div className="relative z-10 max-w-[900px] mx-auto px-4 md:px-8 pb-16">

        {/* ─── Œuvres ─── */}
        {tab === 'oeuvres' && (
          <>
            <div className="flex items-center justify-between py-6 gap-3">
              <div>
                <div className="font-serif text-[26px] italic">Œuvres</div>
                <div className="text-xs text-foreground/50 mt-0.5">
                  {isArtworksLoading ? '…' : `${WORKS.length} publication${WORKS.length !== 1 ? 's' : ''}`}
                </div>
              </div>
              {/* Ouvre le modal de création d'œuvre */}
              <CreateBtn label="Publier une œuvre" onClick={() => setIsCreatePostOpen(true)}/>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
              {isArtworksLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="aspect-square wood-outer p-2.5 opacity-40">
                      <Skeleton className="w-full h-full"/>
                    </div>
                  ))
                : WORKS.map((work, i) => (
                    <FrameCard key={work.id} work={work} onClick={() => setModal({ dataset: WORKS, index: i })}/>
                  ))
              }
            </div>
          </>
        )}

        {/* ─── Articles ─── */}
        {tab === 'articles' && (
          <>
            <div className="flex items-center justify-between py-6 gap-3">
              <div>
                <div className="font-serif text-[26px] italic">Articles</div>
                <div className="text-xs text-foreground/50 mt-0.5">
                  {isArtworksLoading ? '…' : `${ARTICLES.length} article${ARTICLES.length !== 1 ? 's' : ''}`}
                </div>
              </div>
              {/* Ouvre le modal de création d'article */}
              <CreateBtn label="Mettre en vente" onClick={() => setIsCreateArticleOpen(true)}/>
            </div>
            {/* Filtres */}
            <div className="flex gap-2 mb-5">
              {(['tous','vente','vendus'] as const).map(v => (
                <button key={v} onClick={() => setFilter(v)}
                        className={`px-3.5 py-1 rounded-full text-xs border transition-all ${filter === v ? 'bg-foreground text-background border-foreground' : 'border-foreground/10 text-foreground/50 hover:border-foreground/30'}`}>
                  {v === 'tous' ? 'Tous' : v === 'vente' ? 'En vente' : 'Vendus'}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
              {isArtworksLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex flex-col gap-2 opacity-40">
                      <Skeleton className="aspect-square rounded-xl"/>
                      <Skeleton className="h-8 w-full rounded-md"/>
                    </div>
                  ))
                : filtered.map((art, i) => (
                    <BagCard key={art.id} article={art} onClick={() => setModal({ dataset: filtered, index: i })}/>
                  ))
              }
            </div>
          </>
        )}

        {/* ─── Évènements ─── */}
        {tab === 'evenements' && (
          <>
            <div className="flex items-center justify-between py-6 gap-3">
              <div>
                <div className="font-serif text-[26px] italic">Évènements</div>
                <div className="text-xs text-foreground/50 mt-0.5">
                  {isEventsLoading ? '…' : `${(eventsData || []).length} évènement${(eventsData || []).length !== 1 ? 's' : ''}`}
                </div>
              </div>
              {/* Ouvre le modal de création d'évènement */}
              <CreateBtn label="Créer un évènement" onClick={() => setIsCreateEventOpen(true)}/>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {isEventsLoading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-40 w-full rounded-xl opacity-40"/>
                  ))
                : (eventsData || []).map(evt => (
                    // evt est déjà typé Event depuis EventsService
                    <TicketCard key={evt.id} event={evt}/>
                  ))
              }
              {!isEventsLoading && (!eventsData || eventsData.length === 0) && (
                <p className="col-span-2 text-center py-12 text-foreground/40 text-sm">Aucun évènement prévu.</p>
              )}
            </div>
          </>
        )}
      </div>

      {/* ── Modals lecture ── */}
      {modal && (
        <PostModal
          dataset={modal.dataset}
          initialIndex={modal.index}
          onClose={() => setModal(null)}
          authorName={displayName}
          authorHandle={`@${user?.email?.split('@')[0] || 'artiste'}`}
          authorInitial={displayName.charAt(0).toUpperCase()}
          isOwner
          onTogglePublished={(id, next) => {
            // Optimistic update : bascule le status sans refetch
            const nextStatus = next
              ? ArtworkResponse.status.PUBLISHED
              : ArtworkResponse.status.DRAFT
            queryClient.setQueryData(
              ['artist-works', user?.id],
              (old: ArtworkResponse[] | undefined) =>
                old?.map(w => w.id === id ? { ...w, status: nextStatus } : w)
            )
          }}
        />
      )}

      {/* ── Modals création ── */}
      {isCreatePostOpen && (
        <CreatePostModal
          onClose={() => setIsCreatePostOpen(false)}
          onCreated={() => queryClient.invalidateQueries({ queryKey: ['artist-works', user?.id] })}
        />
      )}
      {isCreateArticleOpen && (
        <CreateArticleModal
          works={WORKS}
          onClose={() => setIsCreateArticleOpen(false)}
          onCreated={() => queryClient.invalidateQueries({ queryKey: ['artist-works', user?.id] })}
        />
      )}
      {isCreateEventOpen && (
        <CreateEventModal
          onClose={() => setIsCreateEventOpen(false)}
          onCreated={() => queryClient.invalidateQueries({ queryKey: ['artist-events', user?.id] })}
        />
      )}

      {isEditProfileOpen && (
        <EditProfileModal onClose={() => setIsEditProfileOpen(false)}/>
      )}
    </div>
  )
}
