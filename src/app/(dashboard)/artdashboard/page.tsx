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

/* ── Types ── */
export type Work = {
  id: number; title: string; type: 'image' | 'video'; bg: string
  duration?: string; likes: number; comments: number; shares: number
  date: string; desc: string; tags: string[]
}
export type Article = {
  id: number; title: string; type: string; price: string; sold: boolean
  bg: string; handleColor: string; likes: number; comments: number
  shares: number; date: string; desc: string; tags: string[]
}

/* ── Données ── */
const WORKS: Work[] = [
  { id:1, title:'Série Rouge #3',  type:'image', bg:'linear-gradient(135deg,#e8c4a0,#c8804a)', likes:342, comments:28, shares:14, date:'18 mars 2025', desc:'Troisième volet de ma série Rouge, explorant les contrastes chauds et la tension entre la matière et le vide. Huile sur toile, 80×80 cm.', tags:['#expressionnisme','#huile','#rouge','#serie'] },
  { id:2, title:'Silence bleu',    type:'image', bg:'linear-gradient(135deg,#a8c4d0,#5888a8)', likes:218, comments:19, shares:9,  date:'2 mars 2025',  desc:"Une méditation sur le silence. Les bleus se superposent en fines couches, créant une profondeur qui invite à l\u2019introspection. Acrylique, 60×90 cm.", tags:['#acrylique','#bleu','#silence','#meditation'] },
  { id:3, title:"L\u2019aube",     type:'video', bg:'linear-gradient(135deg,#d4c4b8,#9a7060)', duration:'2:14', likes:197, comments:34, shares:21, date:'15 fév. 2025', desc:"Timelapse de la création de cette toile, du premier geste au dernier trait. Peinture disponible à l\u2019acquisition.", tags:['#timelapse','#process','#aube'] },
  { id:4, title:'Printemps #1',    type:'image', bg:'linear-gradient(135deg,#c8d4a0,#7a9850)', likes:154, comments:12, shares:7,  date:'1 fév. 2025',  desc:'Premier tableau de la série Printemps. Légèreté des verts nouveaux. Huile sur toile de lin, 50×70 cm.', tags:['#printemps','#vert','#nature','#huile'] },
  { id:5, title:'Nocturne',        type:'image', bg:'linear-gradient(135deg,#dcc8e0,#9870a8)', likes:143, comments:22, shares:11, date:'12 jan. 2025', desc:'La nuit comme espace mental. Les violets et les gris se fondent dans une atmosphère de veille. Technique mixte, 70×100 cm.', tags:['#nuit','#violet','#nocturne'] },
  { id:6, title:'Étude #7',        type:'video', bg:'linear-gradient(135deg,#f0deb8,#c89850)', duration:'1:45', likes:128, comments:9, shares:5, date:'3 jan. 2025', desc:"Étude préparatoire filmée. J\u2019explore les textures à la spatule sur fond ocre.", tags:['#etude','#spatule','#ocre'] },
  { id:7, title:'Reflet #2',       type:'image', bg:'linear-gradient(135deg,#b8d8e0,#4878a0)', likes:112, comments:17, shares:8,  date:'20 déc. 2024', desc:"Deuxième étude sur le motif du reflet. L\u2019eau comme miroir déformant, glacis à l\u2019acrylique.", tags:['#eau','#reflet','#acrylique'] },
  { id:8, title:'Lumière #4',      type:'image', bg:'linear-gradient(135deg,#e8d0b0,#b87840)', likes:98,  comments:8,  shares:4,  date:'10 déc. 2024', desc:"La lumière de fin d\u2019après-midi dans une palette chaude. Quatrième variation sur la lumière naturelle.", tags:['#lumiere','#chaud','#atelier'] },
]

const ARTICLES: Article[] = [
  { id:1, title:'Série Rouge #3',  type:'Impression',      price:'85 €',    sold:false, bg:'linear-gradient(135deg,#e8c4a0,#c8804a)', handleColor:'#7a5030', likes:45, comments:6,  shares:3, date:'20 mars 2025', desc:'Reproduction fine art sur papier Hahnemühle 310g. Format 40×40 cm. Signée et numérotée à 30 ex.', tags:['#fineart','#impression','#limitee'] },
  { id:2, title:'Silence bleu',    type:'Toile originale', price:'1 200 €', sold:true,  bg:'linear-gradient(135deg,#a8c4d0,#5888a8)', handleColor:'#6a6058', likes:38, comments:12, shares:8, date:'5 mars 2025',  desc:"La toile originale, acrylique sur toile de lin. 60×90 cm. Certificat d\u2019authenticité inclus.", tags:['#original','#acrylique','#vendu'] },
  { id:3, title:"L\u2019aube",     type:'Carnet',          price:'22 €',    sold:false, bg:'linear-gradient(135deg,#d4c4b8,#9a7060)', handleColor:'#8a6840', likes:29, comments:4,  shares:2, date:'18 fév. 2025', desc:'Carnet couverture rigide. 120 pages blanc crème, 14×20 cm.', tags:['#carnet','#papeterie','#cadeau'] },
  { id:4, title:'Printemps #1',    type:'Toile originale', price:'900 €',   sold:true,  bg:'linear-gradient(135deg,#c8d4a0,#7a9850)', handleColor:'#587030', likes:52, comments:9,  shares:6, date:'3 fév. 2025',  desc:"Huile sur toile de lin, 50×70 cm. Certificat d\u2019authenticité. Collection privée.", tags:['#original','#huile','#vendu'] },
  { id:5, title:'Nocturne',        type:'Tote bag',        price:'35 €',    sold:false, bg:'linear-gradient(135deg,#dcc8e0,#9870a8)', handleColor:'#7a5888', likes:33, comments:5,  shares:3, date:'15 jan. 2025', desc:'Tote bag en coton bio 340g, impression recto. Format 38×42 cm, anses longues. Produit en France.', tags:['#totebag','#bio','#mode'] },
  { id:6, title:'Étude #7',        type:'Affiche A3',      price:'45 €',    sold:false, bg:'linear-gradient(135deg,#f0deb8,#c89850)', handleColor:'#906820', likes:27, comments:3,  shares:2, date:'8 jan. 2025',  desc:'Affiche A3 sur papier mat 200g. Impression numérique haute qualité.', tags:['#affiche','#A3','#decoration'] },
  { id:7, title:'Reflet #2',       type:'Impression',      price:'65 €',    sold:false, bg:'linear-gradient(135deg,#b8d8e0,#4878a0)', handleColor:'#306880', likes:21, comments:2,  shares:1, date:'22 déc. 2024', desc:'Tirage fine art 30×45 cm, papier brillant 300g. Numéroté à 20 ex. Signé.', tags:['#fineart','#tirage','#numerote'] },
  { id:8, title:'Lumière #4',      type:'Toile originale', price:'750 €',   sold:true,  bg:'linear-gradient(135deg,#e8d0b0,#b87840)', handleColor:'#906030', likes:44, comments:7,  shares:5, date:'12 déc. 2024', desc:"Huile sur toile, 50×50 cm. Certificat d\u2019authenticité inclus.", tags:['#original','#huile','#vendu'] },
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

/* ── Page ── */
export default function ArtistDashboardPage() {
  const [tab, setTab]       = useState<Tab>('oeuvres')
  const [filter, setFilter] = useState<'tous' | 'vente' | 'vendus'>('tous')
  const [modal, setModal]   = useState<ModalState>(null)
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
  const { user, logout } = useAuthStore()
  
  const displayName = user?.artistName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Artiste'
  const initials = (user?.firstName?.[0] || 'A').toUpperCase()

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
                onClick={() => logout()}
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
          <div className="w-[96px] h-[96px] rounded-full bg-background border-[4px] border-background flex items-center justify-center font-serif text-[36px] font-semibold text-accent -mt-[48px] mb-3 shadow-lg overflow-hidden relative z-10">
            {user?.profilePictureUrl ? (
              <Image src={user.profilePictureUrl} alt="Avatar" width={76} height={76} className="object-cover w-full h-full" />
            ) : (
              <span className="flex items-center justify-center w-full h-full bg-foreground/5 text-foreground/40 text-xl font-sans"><User /></span>
            )}
          </div>
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <div className="font-serif text-[25px] font-semibold leading-tight">{displayName}</div>
              <div className="text-[13px] text-foreground/50 mt-0.5">@{user?.email?.split('@')[0] || 'artiste'}</div>
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
          <p className="text-[13px] leading-relaxed text-foreground/70 mb-3.5 max-w-md">
            Peintre expressionniste. Huile &amp; acrylique. Je peins ce que les mots ne peuvent pas dire.
          </p>
          <div className="flex gap-7 pt-3 border-t border-foreground/10">
            {[['1 284','Abonnés'],['47','Œuvres'],['12','Vendues'],['8','Évènements']].map(([n,l]) => (
              <div key={l}>
                <div className="font-serif text-xl font-semibold leading-none">{n}</div>
                <div className="text-[11px] text-foreground/50 mt-1 uppercase tracking-wider">{l}</div>
              </div>
            ))}
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

      {/* ── Œuvres ── */}
      {tab === 'oeuvres' && (
        <div className="pb-12 relative z-10">
          <div className="max-w-[900px] mx-auto px-4 md:px-8 flex items-center justify-between py-6 gap-3">
            <div>
              <div className="font-serif text-[26px] italic">Œuvres</div>
              <div className="text-xs text-foreground/50 mt-0.5">47 publications</div>
            </div>
            <CreateBtn label="Publier une œuvre"/>
          </div>
          <div className="max-w-[900px] mx-auto px-4 md:px-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-5">
            {WORKS.map((w, i) => (
              <FrameCard key={w.id} work={w} onClick={() => setModal({ dataset: WORKS, index: i })}/>
            ))}
          </div>
        </div>
      )}

      {/* ── Articles ── */}
      {tab === 'articles' && (
        <div className="pb-12 relative z-10">
          <div className="max-w-[900px] mx-auto px-4 md:px-8 flex items-center justify-between py-6 gap-3">
            <div>
              <div className="font-serif text-[26px] italic">Articles</div>
              <div className="text-xs text-foreground/50 mt-0.5">18 articles</div>
            </div>
            <CreateBtn label="Mettre en vente"/>
          </div>
          <div className="max-w-[900px] mx-auto px-4 md:px-8 flex gap-2 mb-5">
            {(['tous','vente','vendus'] as const).map((v) => (
              <button key={v} onClick={() => setFilter(v)}
                      className={`px-3.5 py-1 rounded-full text-xs border transition-all capitalize ${filter === v ? 'bg-foreground text-background border-foreground' : 'border-foreground/10 text-foreground/50 hover:border-foreground/30'}`}>
                {v === 'tous' ? 'Tous' : v === 'vente' ? 'En vente' : 'Vendus'}
              </button>
            ))}
          </div>
          <div className="max-w-[900px] mx-auto px-4 md:px-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-5">
            {filtered.map((a, i) => (
              <BagCard key={a.id} article={a} onClick={() => setModal({ dataset: filtered, index: i })}/>
            ))}
          </div>
        </div>
      )}

      {/* ── Évènements ── */}
      {tab === 'evenements' && (
        <div className="pb-12 relative z-10">
          <div className="max-w-[900px] mx-auto px-4 md:px-8 flex items-center justify-between py-6 gap-3">
            <div>
              <div className="font-serif text-[26px] italic">Évènements</div>
              <div className="text-xs text-foreground/50 mt-0.5">8 évènements</div>
            </div>
            <CreateBtn label="Créer un évènement"/>
          </div>
          <div className="max-w-[900px] mx-auto px-4 md:px-8">
            <div className="text-[11px] uppercase tracking-[0.08em] text-muted mb-3">À venir</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
              <TicketCard title="Atelier ouvert" subtitle="Atelier ouvert · Lyon" date="28 avril 2025 · 14h–18h · Lyon" tickets="🎟 48 / 60 billets" extra="12 restants" status="upcoming"/>
              <TicketCard title="Expo collective — Galerie Lumière" subtitle="Expo collective · Paris" date="10 mai 2025 · Paris 11e" tickets="🎟 21 / 80 billets" extra="59 restants" status="upcoming"/>
            </div>
            <div className="text-[11px] uppercase tracking-[0.08em] text-muted mb-3">Passés</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <TicketCard title="Vernissage — Série Rouge" subtitle="Vernissage · Paris" date="12 mars 2025 · Paris" tickets="🎟 124 billets vendus" extra="Complet" status="past"/>
              <TicketCard title="Workshop aquarelle" subtitle="Workshop aquarelle" date="5 fév. 2025 · En ligne" tickets="🎟 67 billets vendus" extra="Complet" status="past"/>
            </div>
          </div>
        </div>
      )}

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
