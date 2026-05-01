import Image from "next/image";
import { Edit2, XCircle } from "lucide-react";

type Props = {
  title: string; 
  subtitle: string; 
  date: string;
  tickets: string; 
  extra: string; 
  status: 'upcoming' | 'past';
  posterUrl?: string;
  onEdit?: () => void;
  onCancel?: () => void;
}

export default function TicketCard({ title, subtitle, date, tickets, extra, status, posterUrl, onEdit, onCancel }: Props) {
  return (
    <div style={{ opacity: status === 'past' ? 0.68 : 1 }} className="group">
      <div className="rounded-xl overflow-visible relative shadow-sm bg-ink transition-transform duration-300">
        <div className="w-full rounded-t-xl overflow-hidden relative" style={{ aspectRatio: '16/7' }}>
          {posterUrl ? (
            <Image 
              src={posterUrl} 
              alt={title} 
              fill 
              className="object-cover" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-display text-xs text-white/20"
                 style={{ background: 'linear-gradient(135deg,#2e2a27,#1E1C1A)' }}>
              {subtitle}
            </div>
          )}
        </div>
        <div className="px-3.5 pb-3 pt-2.5 relative">
          <div className="absolute -top-2 -left-2 w-4 h-4 rounded-full bg-cream"/>
          <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-cream"/>
          <div className="border-t border-dashed border-white/[0.12] mb-2"/>
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="text-[13px] text-cream font-medium leading-snug mb-0.5">{title}</div>
              <div className="text-[11px] text-light opacity-65">{date}</div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={`text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider font-medium flex-shrink-0 mt-0.5 ${
                status === 'upcoming' ? 'bg-accent/20 text-light' : 'bg-white/[0.07] text-white/35'
              }`}>
                {status === 'upcoming' ? 'À venir' : 'Passé'}
              </span>
              {status === 'upcoming' && (
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={onEdit}
                    className="p-1.5 rounded-full bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
                    title="Modifier"
                  >
                    <Edit2 size={12} />
                  </button>
                  <button 
                    onClick={onCancel}
                    className="p-1.5 rounded-full bg-white/5 text-rose-500/60 hover:bg-rose-500/20 hover:text-rose-500 transition-colors"
                    title="Annuler"
                  >
                    <XCircle size={12} />
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-[11px] text-accent font-medium">{tickets}</span>
            <span className="text-[11px] text-white/30">{extra}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
