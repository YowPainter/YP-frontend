import Image from 'next/image'
import type { Article } from './types'

export default function BagCard({ article, onClick }: { article: Article; onClick?: () => void }) {
  return (
    <div className={`flex flex-col group ${onClick ? 'cursor-pointer' : ''}`} onClick={onClick}>
      {/* handle */}
      <svg className="block mx-auto w-[52%] transition-transform duration-500 group-hover:-translate-y-1" viewBox="0 0 80 28" fill="none"
           style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,.08))' }}>
        <path d="M10 26 Q10 4 40 4 Q70 4 70 26" stroke={article.handleColor} strokeWidth="5" strokeLinecap="round"/>
      </svg>
      {/* body */}
      <div className={`relative rounded-xl -mt-0.5 overflow-hidden shadow-sm group-hover:shadow-xl transition-all duration-500 ${article.sold ? 'opacity-70' : ''}`}>
        <div className="w-full aspect-square flex items-center justify-center font-display text-sm text-white/80 relative bg-ink">
          {article.imageUrl ? (
            <Image 
              src={article.imageUrl} 
              alt={article.title} 
              fill 
              className="object-cover" 
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center" style={{ background: article.bg }}>
              {article.title}
            </div>
          )}
        </div>
        <div className="bg-ink px-3 py-2.5 flex flex-col gap-1">
          <div className="text-sm font-serif text-white truncate w-full" title={article.title}>
            {article.title}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-white/50 font-bold">{article.type}</span>
            <span className={`text-xs text-accent font-bold ${article.sold ? 'line-through opacity-50' : ''}`}>
              {article.price}
            </span>
          </div>
        </div>
        {article.sold && (
          <div className="absolute inset-0 bg-ink/40 flex items-center justify-center rounded-xl">
            <span className="bg-cream text-ink text-[11px] font-medium px-3 py-1 rounded-full -rotate-12">
              Vendu ✓
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
