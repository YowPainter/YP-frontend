import Image from 'next/image'
import { EventResponse } from '@/lib/models/EventResponse'

/* ── Helpers ── */
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function isUpcoming(evt: EventResponse) {
  if (!evt.startDateTime) return false
  return new Date(evt.startDateTime) > new Date()
}

function attendeesLabel(evt: EventResponse) {
  const current = evt.reservedCount ?? 0
  const max     = evt.maxCapacity
  return max ? `🎟 ${current} / ${max} billets` : `🎟 ${current} inscrits`
}

function extraLabel(evt: EventResponse) {
  if (evt.status === EventResponse.status.CANCELLED) return 'Annulé'
  if (evt.status === EventResponse.status.COMPLETED) return 'Terminé'
  if (evt.status === EventResponse.status.FULL)      return 'Complet'
  if (evt.maxCapacity) {
    const remaining = evt.maxCapacity - (evt.reservedCount ?? 0)
    return remaining > 0 ? `${remaining} restants` : 'Complet'
  }
  return ''
}

function priceLabel(evt: EventResponse) {
  if (!evt.ticketPrice || evt.ticketPrice === 0) return 'Gratuit'
  return `${evt.ticketPrice} €`
}

/* ── Badge status ── */
const STATUS_CLASSES: Partial<Record<EventResponse.status, string>> = {
  [EventResponse.status.PUBLISHED]: 'bg-accent/20 text-light',
  [EventResponse.status.DRAFT]:     'bg-white/[0.07] text-white/35',
  [EventResponse.status.ONGOING]:   'bg-emerald-500/20 text-emerald-300',
  [EventResponse.status.FULL]:      'bg-amber-500/20 text-amber-300',
  [EventResponse.status.CANCELLED]: 'bg-rose-500/20 text-rose-300',
  [EventResponse.status.COMPLETED]: 'bg-white/[0.07] text-white/35',
}
const STATUS_LABELS: Partial<Record<EventResponse.status, string>> = {
  [EventResponse.status.PUBLISHED]: 'À venir',
  [EventResponse.status.DRAFT]:     'Brouillon',
  [EventResponse.status.ONGOING]:   'En cours',
  [EventResponse.status.FULL]:      'Complet',
  [EventResponse.status.CANCELLED]: 'Annulé',
  [EventResponse.status.COMPLETED]: 'Terminé',
}

const TYPE_LABELS: Partial<Record<EventResponse.type, string>> = {
  [EventResponse.type.EXHIBITION]: 'Exposition',
  [EventResponse.type.WORKSHOP]:   'Atelier',
  [EventResponse.type.AUCTION]:    'Enchères',
  [EventResponse.type.MEETUP]:     'Rencontre',
  [EventResponse.type.OTHER]:      'Évènement',
}

/* ── Component ── */
export default function TicketCard({ event }: { event: EventResponse }) {
  const dimmed = event.status === EventResponse.status.COMPLETED
              || event.status === EventResponse.status.CANCELLED

  return (
    <div style={{ opacity: dimmed ? 0.65 : 1 }}>
      <div className="rounded-xl overflow-visible relative shadow-sm bg-ink">

        {/* Affiche : posterUrl > placeholder */}
        <div className="relative w-full rounded-t-xl overflow-hidden" style={{ aspectRatio: '16/7' }}>
          {event.posterUrl ? (
            <>
              <Image src={event.posterUrl} alt={event.name ?? 'Évènement'}
                     fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover"/>
              <div className="absolute inset-0 bg-black/20"/>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center font-display text-xs text-white/20"
                 style={{ background: 'linear-gradient(135deg,#2e2a27,#1E1C1A)' }}>
              {event.location ?? (TYPE_LABELS[event.type!] ?? 'Évènement')}
            </div>
          )}
          {/* Badge type */}
          {event.type && (
            <div className="absolute top-2 left-2 bg-black/55 text-white/70 text-[9px] px-2 py-0.5 rounded uppercase tracking-wider backdrop-blur-sm">
              {TYPE_LABELS[event.type] ?? event.type}
            </div>
          )}
        </div>

        {/* Corps ticket */}
        <div className="px-3.5 pb-3 pt-2.5 relative">
          {/* Encoches */}
          <div className="absolute -top-2 -left-2 w-4 h-4 rounded-full bg-cream"/>
          <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-cream"/>
          {/* Perforation */}
          <div className="border-t border-dashed border-white/[0.12] mb-2"/>

          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="text-[13px] text-cream font-medium leading-snug mb-0.5 truncate">
                {event.name}
              </div>
              {event.startDateTime && (
                <div className="text-[11px] text-light/65">{formatDate(event.startDateTime)}</div>
              )}
              {event.location && (
                <div className="text-[10px] text-white/30 mt-0.5 truncate">📍 {event.location}</div>
              )}
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              {event.status && (
                <span className={`text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider font-medium ${STATUS_CLASSES[event.status] ?? ''}`}>
                  {isUpcoming(event) && event.status === EventResponse.status.PUBLISHED
                    ? 'À venir'
                    : (STATUS_LABELS[event.status] ?? event.status)}
                </span>
              )}
              <span className="text-[10px] text-accent font-medium">{priceLabel(event)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2">
            <span className="text-[11px] text-accent font-medium">{attendeesLabel(event)}</span>
            <span className="text-[11px] text-white/30">{extraLabel(event)}</span>
          </div>
        </div>

      </div>
    </div>
  )
}
