'use client'
import Image from 'next/image'
import type { Article } from '@/lib/types/types'

export default function BagCard({ article, onClick }: { article: Article; onClick: () => void }) {
  return (
    <div className="flex flex-col cursor-pointer" onClick={onClick}>

      {/* ── Anse SVG ── */}
      <svg
        className="block mx-auto w-[52%]"
        viewBox="0 0 80 28"
        fill="none"
        style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,.08))' }}
      >
        <path
          d="M10 26 Q10 4 40 4 Q70 4 70 26"
          stroke={article.handleColor}
          strokeWidth="5"
          strokeLinecap="round"
        />
      </svg>

      {/* ── Corps ── */}
      <div className={`relative rounded-xl -mt-0.5 overflow-hidden shadow-sm hover:shadow-md transition-shadow ${article.sold ? 'opacity-70' : ''}`}>

        {/* Artwork : image réelle > gradient fallback */}
        <div className="relative w-full aspect-square">
          {article.imageUrl ? (
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover"
            />
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center font-display text-sm text-white/80"
              style={{ background: article.bg }}
            >
              {article.title}
            </div>
          )}
        </div>

        {/* Bandeau infos */}
        <div className="bg-ink px-2.5 py-2 flex items-center justify-between">
          <span className="text-[11px] text-white/50">{article.type}</span>
          <span className={`text-xs text-light font-medium ${article.sold ? 'line-through opacity-50' : ''}`}>
            {article.price}
          </span>
        </div>

        {/* Overlay vendu */}
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
