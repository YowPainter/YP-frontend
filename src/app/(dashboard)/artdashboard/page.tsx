'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import FrameCard from '@/components/artdashboard/FrameCard'
import BagCard from '@/components/artdashboard/BagCard'
import TicketCard from '@/components/artdashboard/TicketCard'
import PostModal from '@/components/artdashboard/PostModal'
import ArtworkPost from '@/components/artdashboard/ArtworkPost'
import { useAuthStore } from '@/store/authStore'
import { EditProfileModal } from '@/components/dashboard/EditProfileModal'
import { AnimatedBlob } from '@/components/ui/AnimatedBlob'
import { AbstractShapes } from '@/components/ui/AbstractShapes'
import Link from 'next/link'
import { LogOut, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from '@/lib/toast'
import Navbar from '@/components/layout/Navbar'
import { Skeleton, SkeletonCircle } from '@/components/ui/Skeleton'
import { Pagination } from '@/components/ui/Pagination'
import { Work, Article } from '@/components/artdashboard/types'
import CreateArtworkModal from '@/components/artdashboard/CreateArtworkModal'
import CreateEventModal from '@/components/artdashboard/CreateEventModal'
import CreateArticleModal from '@/components/artdashboard/CreateArticleModal'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ArtistsService } from '@/lib/services/ArtistsService'
import { ArtworksService } from '@/lib/services/ArtworksService'
import { ShopOrdersService } from '@/lib/services/ShopOrdersService'
import { EventsService } from '@/lib/services/EventsService'


/* ─────────────────────────────────────────────
   STATUS BADGE
 ───────────────────────────────────────────── */
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    'livré': 'bg-emerald-50 text-emerald-700',
    'expédié': 'bg-sky-50 text-sky-700',
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
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function CreateBtn({ label, onClick }: { label: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-foreground text-background text-xs font-medium hover:bg-accent hover:text-white transition-colors shrink-0 shadow-sm"
    >
      <PlusIcon />{label}
    </button>
  )
}

function isUsableImageUrl(value?: string | null) {
  return Boolean(value && /^https?:\/\//.test(value) && !value.includes('...'))
}

export default function ArtistDashboardPage() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const displayName = user?.artistName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Artiste'
  const [tab, setTab] = useState<Tab>('oeuvres')
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 6

  // Reset pagination on tab change
  useEffect(() => {
    setCurrentPage(1)
  }, [tab])
  const [filter, setFilter] = useState<'tous' | 'vente' | 'vendus'>('tous')
  const [modal, setModal] = useState<ModalState>(null)
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
  const [isCreateArtworkOpen, setIsCreateArtworkOpen] = useState(false)
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false)
  const [isCreateArticleOpen, setIsCreateArticleOpen] = useState(false)
  const [itemToEdit, setItemToEdit] = useState<any>(null)

  const { data: analyticsData, isLoading: isAnalyticsLoading, error: analyticsError } = useQuery({
    queryKey: ['artist-analytics'],
    queryFn: () => ArtistsService.getMyAnalytics(),
    enabled: !!user,
  })

  // 2. Œuvres
  const { data: worksData, isLoading: isArtworksLoading, error: worksError } = useQuery({
    queryKey: ['artist-works', user?.id],
    queryFn: () => ArtworksService.getMyArtworks(),
    enabled: !!user,
  })

  useEffect(() => {
    console.log("DASHBOARD DEBUG ->", { 
      hasUser: !!user, 
      userId: user?.id, 
      userRole: user?.role,
      isArtworksLoading,
      isAnalyticsLoading
    });
    if (analyticsError) console.error("Analytics Error:", analyticsError);
    if (worksError) console.error("Works Error:", worksError);
    if (worksData) console.log("Works Loaded:", worksData.length);
    if (analyticsData) console.log("Analytics Loaded:", analyticsData);
  }, [analyticsError, worksError, worksData, analyticsData, user, isArtworksLoading, isAnalyticsLoading]);

  // 3. Articles (Inventory)
  const { data: articlesData, isLoading: isInventoryLoading } = useQuery({
    queryKey: ['artist-inventory'],
    queryFn: () => ShopOrdersService.getInventory(),
    enabled: !!user && tab === 'articles',
  })

  // 4. Événements
  const { data: eventsData, isLoading: isEventsLoading } = useQuery({
    queryKey: ['artist-events', user?.id],
    queryFn: () => EventsService.getMyEvents(),
    enabled: !!user && tab === 'evenements',
  })

  const queryClient = useQueryClient();

  const handleEditArtwork = (work: any) => {
    // Map internal 'Work' type back to API response type if needed, 
    // but worksData already contains the raw objects.
    const rawArtwork = worksData?.find(w => w.id === work.id);
    setItemToEdit(rawArtwork);
    setModal(null);
    setIsCreateArtworkOpen(true);
  };

  const handleEditEvent = (evt: any) => {
    setItemToEdit(evt);
    setIsCreateEventOpen(true);
  };

  const handleSellArtwork = (work: any) => {
    // We need the raw artwork object
    const rawArtwork = worksData?.find(w => w.id === work.id);
    setItemToEdit(rawArtwork);
    setModal(null);
    setIsCreateArticleOpen(true);
  };

  const handleDeleteArtwork = async (work: any) => {
    try {
      await ArtworksService.bulkDelete([work.id]);
      toast.success("Œuvre supprimée !");
      setModal(null);
      queryClient.invalidateQueries({ queryKey: ['artist-works'] });
    } catch (err) {
      toast.error(err, "Suppression");
    }
  };

  const handleCancelEvent = async (id: string) => {
    if (confirm("Voulez-vous vraiment annuler cet événement ?")) {
      try {
        await EventsService.cancelEvent(id);
        toast.success("Événement annulé !");
        queryClient.invalidateQueries({ queryKey: ['artist-events'] });
      } catch (err) {
        toast.error(err, "Annulation d'événement");
      }
    }
  };

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
    status: w.status,
    imageUrls: w.imageUrls || [],
  }))

  const ARTICLES: Article[] = (articlesData || []).map((p, index) => ({
    id: p.id!,
    title: p.name!,
    type: 'Article',
    price: `${p.price?.toLocaleString()} FCFA`,
    sold: !p.active || p.stockQuantity === 0,
    bg: GRADIENTS[(index + 2) % GRADIENTS.length],
    handleColor: '#7a5030',
    likes: 0,
    comments: 0,
    shares: 0,
    date: '',
    desc: p.description || '',
    tags: [],
    imageUrl: worksData?.find(w => w.id === p.artworkId)?.imageUrls?.[0],
  }))

  const filtered = filter === 'vente' ? ARTICLES.filter(a => !a.sold)
    : filter === 'vendus' ? ARTICLES.filter(a => a.sold)
      : ARTICLES

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'oeuvres', label: 'Œuvres', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" /><rect x="6" y="6" width="12" height="12" rx="1" /></svg> },
    { id: 'articles', label: 'Articles', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg> },
    { id: 'evenements', label: 'Évènements', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24"><path d="M2 9a2 2 0 0 1 0-4V3h20v2a2 2 0 0 1 0 4v2a2 2 0 0 1 0 4v2H2v-2a2 2 0 0 1 0-4V9z" /></svg> },
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
      <Navbar />

      {/* ── Profil Harmonisé ── */}
      <div className="bg-background/60 backdrop-blur-md border-b border-foreground/10 relative z-10 pt-[88px]">
        <div className="h-[280px] w-full relative border-b border-foreground/10 shadow-inner">
          <Image src="/images/african-art-v2.png" alt="Cover art" fill className="object-cover opacity-90 dark:opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-90"></div>
        </div>
        <div className="max-w-[1200px] mx-auto px-4 md:px-12 pb-8 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 -mt-[70px] relative z-10">

            {/* Left Side: Avatar + Info */}
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6 md:gap-8">
              <div className="w-[130px] h-[130px] md:w-[150px] md:h-[150px] rounded-full bg-background border-[6px] border-background flex items-center justify-center font-serif text-4xl font-semibold text-accent shadow-xl overflow-hidden shrink-0">
                {!user ? (
                  <SkeletonCircle className="w-full h-full" />
                ) : user?.profilePictureUrl ? (
                  <Image src={user.profilePictureUrl} alt="Avatar" width={150} height={150} className="object-cover w-full h-full" />
                ) : (
                  <span className="flex items-center justify-center w-full h-full bg-foreground/5 text-foreground/40"><User size={48} /></span>
                )}
              </div>

              <div className="pb-2 flex flex-col gap-2">
                <div className="flex items-center gap-4">
                  <h1 className="font-serif text-4xl md:text-5xl font-semibold leading-none tracking-tight">{displayName}</h1>

                </div>
                <div className="text-sm text-foreground/50 font-mono tracking-tight">@{user?.email?.split('@')[0] || 'artiste'}</div>
                <p className="text-sm md:text-base leading-relaxed text-foreground/70 max-w-2xl font-light mt-2 border-l-2 border-accent/30 pl-4">
                  {user?.bio || "Aucune bio renseignée. Cliquez sur éditer pour en ajouter une."}
                </p>
              </div>
            </div>

            {/* Right Side: Action + Stats */}
            <div className="flex flex-col items-start md:items-end gap-6 pb-2">
              <button
                onClick={() => setIsEditProfileOpen(true)}
                className="flex items-center gap-2 px-6 py-2.5 border border-foreground/20 rounded-full text-xs uppercase tracking-widest font-bold hover:border-accent hover:text-white hover:bg-accent transition-all shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Éditer le profil
              </button>

              <div className="flex gap-8 md:gap-12 bg-foreground/5 px-8 py-5 rounded-3xl border border-foreground/10 backdrop-blur-md shadow-sm">
                {isAnalyticsLoading ? (
                  <>
                    <div className="w-16"><Skeleton className="h-6 w-full mb-2" /><Skeleton className="h-3 w-3/4" /></div>
                    <div className="w-16"><Skeleton className="h-6 w-full mb-2" /><Skeleton className="h-3 w-3/4" /></div>
                    <div className="w-16"><Skeleton className="h-6 w-full mb-2" /><Skeleton className="h-3 w-3/4" /></div>
                  </>
                ) : analyticsData ? (
                  <>
                    <div className="flex flex-col items-center">
                      <div className="font-serif text-3xl md:text-4xl font-semibold leading-none text-accent">{analyticsData.totalLikes || 0}</div>
                      <div className="text-[10px] text-foreground/50 mt-2 uppercase tracking-[0.2em] font-bold">Likes</div>
                    </div>
                    <div className="w-[1px] bg-foreground/10 self-stretch"></div>
                    <div className="flex flex-col items-center">
                      <div className="font-serif text-3xl md:text-4xl font-semibold leading-none">{analyticsData.totalSales || 0}</div>
                      <div className="text-[10px] text-foreground/50 mt-2 uppercase tracking-[0.2em] font-bold">Ventes</div>
                    </div>
                    <div className="w-[1px] bg-foreground/10 self-stretch"></div>
                    <div className="flex flex-col items-center">
                      <div className="font-serif text-3xl md:text-4xl font-semibold leading-none">{analyticsData.totalArtworks || 0}</div>
                      <div className="text-[10px] text-foreground/50 mt-2 uppercase tracking-[0.2em] font-bold">Œuvres</div>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabnav Harmonisée ── */}
      <nav className="sticky top-[80px] md:top-[88px] z-40 glass-elegant shadow-sm border-b border-foreground/10">
        <div className="max-w-[1200px] mx-auto px-4 md:px-12 flex overflow-x-auto no-scrollbar gap-4">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`relative flex items-center gap-2 px-6 py-4 text-xs uppercase tracking-[0.1em] transition-all whitespace-nowrap ${tab === t.id ? 'text-foreground font-bold' : 'text-foreground/50 hover:text-foreground'}`}>
              {t.icon}{t.label}
              {tab === t.id && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent rounded-t" />}
            </button>
          ))}
          <div className="ml-auto flex items-center pr-4">
            {tab === 'oeuvres' && <CreateBtn label="Nouvelle œuvre" onClick={() => { setItemToEdit(null); setIsCreateArtworkOpen(true); }} />}
            {tab === 'evenements' && <CreateBtn label="Nouvel événement" onClick={() => { setItemToEdit(null); setIsCreateEventOpen(true); }} />}
          </div>
        </div>
      </nav>

      {/* ── Contenu ── */}
      <div className="pb-16 pt-8 relative z-10 max-w-[1200px] mx-auto px-4 md:px-12">
        {tab === 'oeuvres' && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {isArtworksLoading ? (
                Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                  <div key={i} className="aspect-square wood-outer p-2.5"><Skeleton className="w-full h-full" /></div>
                ))
              ) : WORKS.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((work, i) => (
                <ArtworkPost 
                  key={work.id} 
                  work={work} 
                  artist={{
                    name: displayName,
                    avatar: user?.profilePictureUrl,
                    username: user?.email?.split('@')[0],
                    slug: user?.slug
                  }}
                  onDelete={() => handleDeleteArtwork(work)}
                  onClick={() => setModal({ dataset: WORKS, index: (currentPage - 1) * ITEMS_PER_PAGE + i })} 
                />
              ))}
            </div>

            {/* Pagination Oeuvres */}
            {WORKS.length > ITEMS_PER_PAGE && (
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(WORKS.length / ITEMS_PER_PAGE)}
                onPageChange={setCurrentPage}
                className="pt-12"
              />
            )}
          </div>
        )}
        {tab === 'articles' && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {isInventoryLoading ? (
                Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-2"><Skeleton className="aspect-square rounded-xl" /><Skeleton className="h-8 w-full rounded-md" /></div>
                ))
              ) : ARTICLES.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((art, i) => (
                <BagCard key={art.id} article={art} />
              ))}
            </div>

            {/* Pagination Articles */}
            {ARTICLES.length > ITEMS_PER_PAGE && (
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(ARTICLES.length / ITEMS_PER_PAGE)}
                onPageChange={setCurrentPage}
                className="pt-12"
              />
            )}
          </div>
        )}
        {tab === 'evenements' && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {isEventsLoading ? (
                Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                  <Skeleton key={i} className="h-48 w-full rounded-xl" />
                ))
              ) : (eventsData || []).slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map(evt => (
                <TicketCard
                  key={evt.id}
                  title={evt.name!}
                  subtitle={evt.location!}
                  date={evt.startDateTime ? new Date(evt.startDateTime).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Date à préciser'}
                  tickets={`🎟 ${evt.reservedCount || 0} / ${evt.maxCapacity || '∞'} billets`}
                  extra=""
                  status={evt.startDateTime && new Date(evt.startDateTime) > new Date() ? 'upcoming' : 'past'}
                  posterUrl={evt.posterUrl}
                  onEdit={() => handleEditEvent(evt)}
                  onCancel={() => handleCancelEvent(evt.id!)}
                />
              ))}
            </div>

            {(!isEventsLoading && (!eventsData || eventsData.length === 0)) && (
              <p className="text-center py-12 text-muted text-sm">Aucun événement prévu.</p>
            )}

            {/* Pagination Événements */}
            {eventsData && eventsData.length > ITEMS_PER_PAGE && (
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(eventsData.length / ITEMS_PER_PAGE)}
                onPageChange={setCurrentPage}
                className="pt-12"
              />
            )}
          </div>
        )}
      </div>

      {/* ── Modal ── */}
      {modal && (
        <PostModal 
          dataset={modal.dataset} 
          initialIndex={modal.index} 
          onClose={() => setModal(null)} 
          onEdit={handleEditArtwork}
          onSell={handleSellArtwork}
          onDelete={handleDeleteArtwork}
        />
      )}
      {/* ── Modal d'Édition Profil ── */}
      {isEditProfileOpen && (
        <EditProfileModal onClose={() => setIsEditProfileOpen(false)} />
      )}

      {/* ── Modals de Création ── */}
      {isCreateArtworkOpen && (
        <CreateArtworkModal 
          onClose={() => { setIsCreateArtworkOpen(false); setItemToEdit(null); }} 
          artworkToEdit={itemToEdit}
        />
      )}
      {isCreateEventOpen && (
        <CreateEventModal 
          onClose={() => { setIsCreateEventOpen(false); setItemToEdit(null); }} 
          eventToEdit={itemToEdit}
        />
      )}
      {isCreateArticleOpen && (
        <CreateArticleModal 
          onClose={() => { setIsCreateArticleOpen(false); setItemToEdit(null); }} 
          artwork={itemToEdit}
        />
      )}
    </div>
  )
}
