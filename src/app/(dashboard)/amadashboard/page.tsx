'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogOut, User } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

import { useAuthStore }      from '@/store/authStore'
import { ShopOrdersService } from '@/lib/services/ShopOrdersService'
import { OrderResponse }     from '@/lib/models/OrderResponse'
import { Skeleton, SkeletonCircle } from '@/components/ui/Skeleton'
import { Pagination }        from '@/components/ui/Pagination'
import { AnimatedBlob }      from '@/components/ui/AnimatedBlob'
import { AbstractShapes }    from '@/components/ui/AbstractShapes'
import Navbar                from '@/components/layout/Navbar'
import DiscoverFrameCard     from '@/components/artdashboard/DiscoverFrameCard'
import { ArtworkResponse, Work } from '@/components/artdashboard/types'

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
type Tab = 'likes' | 'achats' | 'billets'

/* ─────────────────────────────────────────────
   MOCK DATA — likes
   TODO: remplacer quand l'endpoint /api/artworks/liked sera disponible
───────────────────────────────────────────── */
const MOCK_LIKED_WORKS: (Work & { artistName: string; artistHandle: string; artistInitial: string; artistAvatarUrl?: string; artistSlug: string })[] = [
  {
    id: '1', title: 'Série Rouge #3', type: 'image', bg: 'linear-gradient(135deg,#e8c4a0,#c8804a)',
    published: true, status: ArtworkResponse.status.PUBLISHED, likes: 342, comments: 28, shares: 14,
    date: '18 mars 2025', desc: 'Troisième volet de ma série Rouge. Huile sur toile, 80×80 cm.',
    tags: ['#expressionnisme','#huile','#rouge'],
    artistName: 'Marie Lecomte', artistHandle: '@marielecomte', artistInitial: 'M', artistSlug: 'marie-lecomte',
  },
  {
    id: '2', title: 'Brume #2', type: 'image', bg: 'linear-gradient(135deg,#c8d8e8,#6888a8)',
    published: true, status: ArtworkResponse.status.PUBLISHED, likes: 201, comments: 14, shares: 9,
    date: '15 mars 2025', desc: 'Paysages urbains noyés dans la brume matinale. Acrylique, 100×70 cm.',
    tags: ['#urbain','#brume'],
    artistName: 'Théo Marchand', artistHandle: '@theomarchand', artistInitial: 'T', artistSlug: 'theo-marchand',
  },
  {
    id: '3', title: "Éclat d'or", type: 'video', bg: 'linear-gradient(135deg,#f0e0a0,#d4a030)',
    published: true, status: ArtworkResponse.status.PUBLISHED, likes: 519, comments: 43, shares: 28,
    date: '12 mars 2025', desc: "Timelapse dorée à la feuille. Exploration de la lumière et de la matière.",
    tags: ['#gold','#timelapse'], duration: '1:58',
    artistName: 'Lena Voss', artistHandle: '@lenavoss', artistInitial: 'L', artistSlug: 'lena-voss',
  },
  {
    id: '4', title: 'Nocturne', type: 'image', bg: 'linear-gradient(135deg,#dcc8e0,#9870a8)',
    published: true, status: ArtworkResponse.status.PUBLISHED, likes: 143, comments: 22, shares: 11,
    date: '8 mars 2025', desc: 'La nuit comme espace mental. Technique mixte, 70×100 cm.',
    tags: ['#nuit','#violet'],
    artistName: 'Marie Lecomte', artistHandle: '@marielecomte', artistInitial: 'M', artistSlug: 'marie-lecomte',
  },
  {
    id: '5', title: 'Silence #5', type: 'image', bg: 'linear-gradient(135deg,#e8d0c8,#c09080)',
    published: true, status: ArtworkResponse.status.PUBLISHED, likes: 178, comments: 19, shares: 11,
    date: '10 mars 2025', desc: 'Cinquième tableau de la série Silence. Huile et encre, 60×60 cm.',
    tags: ['#silence','#mixte'],
    artistName: 'Lena Voss', artistHandle: '@lenavoss', artistInitial: 'L', artistSlug: 'lena-voss',
  },
  {
    id: '6', title: 'Reflet #2', type: 'image', bg: 'linear-gradient(135deg,#b8d8e0,#4878a0)',
    published: true, status: ArtworkResponse.status.PUBLISHED, likes: 112, comments: 17, shares: 8,
    date: '20 déc. 2024', desc: "Glacis successifs à l'acrylique. 40×40 cm.",
    tags: ['#eau','#reflet'],
    artistName: 'Théo Marchand', artistHandle: '@theomarchand', artistInitial: 'T', artistSlug: 'theo-marchand',
  },
]

/* ─────────────────────────────────────────────
   MOCK DATA — billets
   TODO: remplacer quand un endpoint /api/events/my-tickets sera disponible
   (EventsService.getReservations retourne les inscrits côté artiste,
    pas les réservations de l'amateur)
───────────────────────────────────────────── */
const MOCK_TICKETS = [
  {
    id: 't1', eventName: 'Atelier ouvert', artistName: 'Marie Lecomte',
    startDateTime: '2025-04-28T14:00:00', location: 'Lyon, Atelier du Parc',
    ticketPrice: 0, status: 'PUBLISHED' as const, ref: 'ML-AO-2025-012',
    posterUrl: null as string | null,
  },
  {
    id: 't2', eventName: 'Expo collective — Galerie Lumière', artistName: 'Marie Lecomte',
    startDateTime: '2025-05-10T18:00:00', location: 'Paris 11e, Galerie Lumière',
    ticketPrice: 1500, status: 'PUBLISHED' as const, ref: 'ML-EC-2025-047',
    posterUrl: null as string | null,
  },
  {
    id: 't3', eventName: 'Vernissage — Série Rouge', artistName: 'Marie Lecomte',
    startDateTime: '2025-03-12T19:00:00', location: 'Paris, Galerie du Marais',
    ticketPrice: 0, status: 'COMPLETED' as const, ref: 'ML-VS-2025-008',
    posterUrl: null as string | null,
  },
  {
    id: 't4', eventName: 'Workshop aquarelle', artistName: 'Lena Voss',
    startDateTime: '2025-02-05T10:00:00', location: 'En ligne',
    ticketPrice: 3000, status: 'COMPLETED' as const, ref: 'LV-WA-2025-031',
    posterUrl: null as string | null,
  },
]

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}
function fmtAmount(n: number) {
  return n.toLocaleString('fr-FR') + ' XAF'
}
function isUpcoming(iso: string) {
  return new Date(iso) > new Date()
}

/* ─────────────────────────────────────────────
   STATUS BADGES
───────────────────────────────────────────── */
const ORDER_STATUS_MAP: Record<OrderResponse.status, { label: string; cls: string }> = {
  PENDING_PAYMENT: { label: 'En attente',  cls: 'bg-amber-50 text-amber-700' },
  PAID:            { label: 'Payé',        cls: 'bg-sky-50 text-sky-700' },
  PROCESSING:      { label: 'En cours',    cls: 'bg-blue-50 text-blue-700' },
  SHIPPED:         { label: 'Expédié',     cls: 'bg-indigo-50 text-indigo-700' },
  DELIVERED:       { label: 'Livré',       cls: 'bg-emerald-50 text-emerald-700' },
  CANCELLED:       { label: 'Annulé',      cls: 'bg-rose-50 text-rose-700' },
  REFUNDED:        { label: 'Remboursé',   cls: 'bg-gray-50 text-gray-600' },
}
function OrderStatusBadge({ status }: { status: OrderResponse.status }) {
  const m = ORDER_STATUS_MAP[status] ?? { label: status, cls: 'bg-gray-50 text-gray-600' }
  return (
    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full uppercase tracking-wide ${m.cls}`}>
      {m.label}
    </span>
  )
}

/* ─────────────────────────────────────────────
   COMPOSANT BILLET AMATEUR
───────────────────────────────────────────── */
function MyTicketCard({ ticket }: { ticket: typeof MOCK_TICKETS[0] }) {
  const upcoming = isUpcoming(ticket.startDateTime)
  return (
    <div style={{ opacity: ticket.status === 'COMPLETED' ? 0.68 : 1 }}>
      <div className="rounded-xl overflow-visible relative shadow-sm bg-ink">
        {/* Visuel */}
        <div className="relative w-full rounded-t-xl overflow-hidden" style={{ aspectRatio: '16/7' }}>
          {ticket.posterUrl ? (
            <>
              <Image src={ticket.posterUrl} alt={ticket.eventName} fill className="object-cover"
                     sizes="(max-width: 640px) 100vw, 50vw"/>
              <div className="absolute inset-0 bg-black/20"/>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center font-display text-xs text-white/20"
                 style={{ background: 'linear-gradient(135deg,#2e2a27,#1E1C1A)' }}>
              {ticket.location}
            </div>
          )}
        </div>
        {/* Corps */}
        <div className="px-3.5 pb-3 pt-2.5 relative">
          <div className="absolute -top-2 -left-2 w-4 h-4 rounded-full bg-cream"/>
          <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-cream"/>
          <div className="border-t border-dashed border-white/[0.12] mb-2"/>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="text-[13px] text-cream font-medium leading-snug truncate">{ticket.eventName}</div>
              <div className="text-[11px] text-light/65 mt-0.5">{fmtDate(ticket.startDateTime)}</div>
              <div className="text-[10px] text-white/30 mt-0.5 truncate">📍 {ticket.location}</div>
            </div>
            <span className={`text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider font-medium shrink-0 mt-0.5 ${
              upcoming ? 'bg-accent/20 text-light' : 'bg-white/[0.07] text-white/35'
            }`}>
              {upcoming ? 'À venir' : 'Passé'}
            </span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-[11px] text-accent font-medium">
              {ticket.ticketPrice > 0 ? fmtAmount(ticket.ticketPrice) : 'Gratuit'}
            </span>
            {/* QR fictif — petite grille */}
            <QRMini value={ticket.ref}/>
          </div>
          <div className="text-[10px] font-mono tracking-wider text-white/20 mt-1">{ticket.ref}</div>
        </div>
      </div>
    </div>
  )
}

function QRMini({ value }: { value: string }) {
  const size = 6
  const cells = Array.from({ length: size * size }, (_, i) => {
    const c = value.charCodeAt(i % value.length)
    return (c + i * 13) % 3 !== 0
  })
  return (
    <div className="grid gap-[1px] bg-white p-1 rounded"
         style={{ gridTemplateColumns: `repeat(${size},1fr)`, width: 36, height: 36 }}>
      {cells.map((on, i) => (
        <div key={i} className={`rounded-[1px] ${on ? 'bg-ink' : 'bg-white'}`}/>
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────────
   PAGE PRINCIPALE
───────────────────────────────────────────── */
const ITEMS_PER_PAGE = 6

export default function AmateurDashboardPage() {
  const router              = useRouter()
  const { user, logout }    = useAuthStore()
  const displayName         = `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Amateur'

  const [tab, setTab]           = useState<Tab>('likes')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => { setCurrentPage(1) }, [tab])

  /* ── Commandes (ShopOrdersService.getMyPurchases) ── */
  const { data: ordersData, isLoading: isOrdersLoading } = useQuery({
    queryKey: ['my-purchases'],
    queryFn:  () => ShopOrdersService.getMyPurchases(),
    enabled:  !!user && tab === 'achats',
  })

  /* ── Totaux pour les stats ── */
  const totalLikes   = MOCK_LIKED_WORKS.length
  const totalOrders  = ordersData?.length ?? 0
  const totalTickets = MOCK_TICKETS.length

  /* ── Pagination ── */
  const likedPage  = MOCK_LIKED_WORKS.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
  const ordersPage = (ordersData || []).slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
  const ticketsPage = MOCK_TICKETS.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const TABS: { id: Tab; label: string; count: number; icon: React.ReactNode }[] = [
    {
      id: 'likes', label: 'Likes', count: totalLikes,
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
    },
    {
      id: 'achats', label: 'Achats', count: totalOrders,
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
    },
    {
      id: 'billets', label: 'Billets', count: totalTickets,
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24"><path d="M2 9a2 2 0 0 1 0-4V3h20v2a2 2 0 0 1 0 4v2a2 2 0 0 1 0 4v2H2v-2a2 2 0 0 1 0-4V9z"/></svg>,
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground antialiased font-sans canvas-texture canvas-grain relative selection:bg-accent/30">

      {/* Ambient backgrounds — identiques au dashboard artiste */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden mix-blend-multiply dark:mix-blend-screen opacity-70">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(194,109,92,0.15),transparent_60%)]"/>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(30,28,26,0.08),transparent_50%)]"/>
        <AnimatedBlob className="top-[-10%] left-[-15%] w-[60vw] h-[60vw] blur-3xl opacity-20" color="accent"/>
        <AnimatedBlob className="bottom-[10%] right-[-5%] w-[45vw] h-[45vw] blur-3xl opacity-30" color="slate"/>
        <AbstractShapes/>
      </div>

      <Navbar/>

      {/* ── Profil — même structure que dashboard artiste ── */}
      <div className="bg-background/60 backdrop-blur-md border-b border-foreground/10 relative z-10 pt-[88px]">
        {/* Bannière image */}
        <div className="h-[280px] w-full relative border-b border-foreground/10 shadow-inner">
          <Image src="/images/african-art-v2.png" alt="Cover" fill className="object-cover opacity-90 dark:opacity-60"/>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-90"/>
        </div>

        <div className="max-w-[1200px] mx-auto px-4 md:px-12 pb-8 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 -mt-[70px] relative z-10">

            {/* Avatar + infos */}
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6 md:gap-8">
              <div className="w-[130px] h-[130px] md:w-[150px] md:h-[150px] rounded-full bg-background
                              border-[6px] border-background flex items-center justify-center
                              font-serif text-4xl font-semibold text-accent shadow-xl overflow-hidden shrink-0">
                {!user ? <SkeletonCircle className="w-full h-full"/> :
                 user.profilePictureUrl
                   ? <Image src={user.profilePictureUrl} alt="Avatar" width={150} height={150} className="object-cover w-full h-full"/>
                   : <span className="flex items-center justify-center w-full h-full bg-foreground/5 text-foreground/40">
                       <User size={48}/>
                     </span>
                }
              </div>
              <div className="pb-2 flex flex-col gap-2">
                <h1 className="font-serif text-4xl md:text-5xl font-semibold leading-none tracking-tight">
                  {displayName}
                </h1>
                <div className="text-sm text-foreground/50 font-mono tracking-tight">
                  @{user?.email?.split('@')[0] || 'amateur'} · Amateur
                </div>
                <p className="text-sm md:text-base leading-relaxed text-foreground/70 max-w-2xl font-light mt-2 border-l-2 border-accent/30 pl-4">
                  {user?.bio || "Amateur d'art et de peinture contemporaine."}
                </p>
              </div>
            </div>

            {/* Stats + bouton */}
            <div className="flex flex-col items-start md:items-end gap-6 pb-2">
              <button className="flex items-center gap-2 px-6 py-2.5 border border-foreground/20 rounded-full text-xs uppercase tracking-widest font-bold hover:border-accent hover:text-white hover:bg-accent transition-all shadow-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Éditer le profil
              </button>

              {/* Bloc stats — même style que artiste */}
              <div className="flex gap-8 md:gap-12 bg-foreground/5 px-8 py-5 rounded-3xl border border-foreground/10 backdrop-blur-md shadow-sm">
                <div className="flex flex-col items-center">
                  <div className="font-serif text-3xl md:text-4xl font-semibold leading-none text-accent">{totalLikes}</div>
                  <div className="text-[10px] text-foreground/50 mt-2 uppercase tracking-[0.2em] font-bold">Likes</div>
                </div>
                <div className="w-px bg-foreground/10 self-stretch"/>
                <div className="flex flex-col items-center">
                  <div className="font-serif text-3xl md:text-4xl font-semibold leading-none">{totalOrders}</div>
                  <div className="text-[10px] text-foreground/50 mt-2 uppercase tracking-[0.2em] font-bold">Achats</div>
                </div>
                <div className="w-px bg-foreground/10 self-stretch"/>
                <div className="flex flex-col items-center">
                  <div className="font-serif text-3xl md:text-4xl font-semibold leading-none">{totalTickets}</div>
                  <div className="text-[10px] text-foreground/50 mt-2 uppercase tracking-[0.2em] font-bold">Billets</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Tabnav — même sticky top que artiste ── */}
      <nav className="sticky top-[80px] md:top-[88px] z-40 glass-elegant shadow-sm border-b border-foreground/10">
        <div className="max-w-[1200px] mx-auto px-4 md:px-12 flex overflow-x-auto no-scrollbar gap-4">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
                    className={`relative flex items-center gap-2 px-6 py-4 text-xs uppercase tracking-[0.1em] transition-all whitespace-nowrap ${
                      tab === t.id ? 'text-foreground font-bold' : 'text-foreground/50 hover:text-foreground'
                    }`}>
              {t.icon}
              {t.label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                tab === t.id ? 'bg-ink text-cream' : 'bg-foreground/[0.07] text-foreground/50'
              }`}>
                {t.count}
              </span>
              {tab === t.id && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent rounded-t"/>}
            </button>
          ))}
        </div>
      </nav>

      {/* ── Contenu ── */}
      <div className="pb-16 pt-8 relative z-10 max-w-[1200px] mx-auto px-4 md:px-12 space-y-10">

        {/* ─── Likes ─── */}
        {tab === 'likes' && (
          <div className="space-y-10">
            {/* Même grille que les œuvres artiste */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
              {likedPage.map(w => (
                <DiscoverFrameCard
                  key={w.id}
                  work={w}
                  artist={{
                    name:      w.artistName,
                    handle:    w.artistHandle,
                    avatarUrl: w.artistAvatarUrl,
                    slug:      w.artistSlug,
                  }}
                  onClick={() => {/* TODO: ouvrir PostModal */}}
                  onArtistClick={() => router.push(`/boutique/${w.artistSlug}`)}
                />
              ))}
            </div>
            {MOCK_LIKED_WORKS.length > ITEMS_PER_PAGE && (
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(MOCK_LIKED_WORKS.length / ITEMS_PER_PAGE)}
                onPageChange={setCurrentPage}
                className="pt-4"
              />
            )}
            {/* TODO: remplacer MOCK_LIKED_WORKS par useQuery quand
                l'endpoint GET /api/artworks/liked sera disponible */}
          </div>
        )}

        {/* ─── Achats (OrderResponse) ─── */}
        {tab === 'achats' && (
          <div className="space-y-10">
            {isOrdersLoading ? (
              <div className="flex flex-col gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full rounded-xl opacity-40"/>
                ))}
              </div>
            ) : !ordersData?.length ? (
              <p className="text-center py-16 text-foreground/40 text-sm">Aucun achat pour le moment.</p>
            ) : (
              <>
                <div className="flex flex-col gap-3">
                  {ordersPage.map(order => (
                    <div key={order.id}
                         className="rounded-xl border border-foreground/[0.07] bg-background hover:border-foreground/[0.15] transition-colors overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-foreground/[0.06] bg-foreground/[0.02]">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-[11px] text-foreground/40">#{order.id?.slice(0, 8)}</span>
                          {order.status && <OrderStatusBadge status={order.status}/>}
                        </div>
                        <div className="flex items-center gap-3">
                          {order.createdAt && (
                            <span className="text-[11px] text-foreground/40">
                              {new Date(order.createdAt).toLocaleDateString('fr-FR', { day:'numeric', month:'short', year:'numeric' })}
                            </span>
                          )}
                          <span className="font-serif text-base font-semibold text-accent">
                            {order.totalAmount != null ? fmtAmount(order.totalAmount) : '—'}
                          </span>
                        </div>
                      </div>
                      {order.items?.map((item, i) => (
                        <div key={i} className="flex items-center justify-between px-4 py-3 border-b border-foreground/[0.04] last:border-0">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-light/40 flex items-center justify-center shrink-0">
                              <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                                <line x1="3" y1="6" x2="21" y2="6"/>
                                <path d="M16 10a4 4 0 0 1-8 0"/>
                              </svg>
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-medium truncate">{item.productName}</div>
                              <div className="text-[11px] text-foreground/40">Qté : {item.quantity ?? 1}</div>
                            </div>
                          </div>
                          <span className="text-sm font-medium text-foreground/70 shrink-0 ml-3">
                            {item.unitPrice != null ? fmtAmount(item.unitPrice * (item.quantity ?? 1)) : '—'}
                          </span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                {(ordersData?.length ?? 0) > ITEMS_PER_PAGE && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil((ordersData?.length ?? 0) / ITEMS_PER_PAGE)}
                    onPageChange={setCurrentPage}
                    className="pt-4"
                  />
                )}
              </>
            )}
          </div>
        )}

        {/* ─── Billets ─── */}
        {tab === 'billets' && (
          <div className="space-y-10">
            {ticketsPage.filter(t => isUpcoming(t.startDateTime)).length > 0 && (
              <div>
                <div className="text-[11px] uppercase tracking-[0.08em] text-foreground/50 mb-4">À venir</div>
                {/* Même nombre de colonnes que TicketCard artiste */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {ticketsPage.filter(t => isUpcoming(t.startDateTime)).map(t => (
                    <MyTicketCard key={t.id} ticket={t}/>
                  ))}
                </div>
              </div>
            )}
            {ticketsPage.filter(t => !isUpcoming(t.startDateTime)).length > 0 && (
              <div>
                <div className="text-[11px] uppercase tracking-[0.08em] text-foreground/50 mb-4">Passés</div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {ticketsPage.filter(t => !isUpcoming(t.startDateTime)).map(t => (
                    <MyTicketCard key={t.id} ticket={t}/>
                  ))}
                </div>
              </div>
            )}
            {MOCK_TICKETS.length === 0 && (
              <p className="text-center py-16 text-foreground/40 text-sm">Aucun billet pour le moment.</p>
            )}
            {MOCK_TICKETS.length > ITEMS_PER_PAGE && (
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(MOCK_TICKETS.length / ITEMS_PER_PAGE)}
                onPageChange={setCurrentPage}
                className="pt-4"
              />
            )}
            {/* TODO: remplacer MOCK_TICKETS par useQuery quand
                l'endpoint GET /api/events/my-tickets sera disponible */}
          </div>
        )}

      </div>
    </div>
  )
}
