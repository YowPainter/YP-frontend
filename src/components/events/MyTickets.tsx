// components/events/MyTickets.tsx
'use client';

import { useEffect, useState } from 'react';
import { getMyTickets } from '@/lib/api/events';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import { Download, Printer, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import type { TicketReservation } from '@/lib/types/event';

interface MyTicketsProps {
    eventId?: string;
}

export function MyTickets({ eventId }: MyTicketsProps) {
    const [tickets, setTickets] = useState<TicketReservation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTickets();
    }, [eventId]);

    const loadTickets = async () => {
        try {
            const data = await getMyTickets(eventId);
            setTickets(data);
        } catch (error) {
            console.error('Erreur chargement billets:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
            </div>
        );
    }

    if (tickets.length === 0) {
        return null;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 text-foreground/60 mb-2 px-2">
                <span className="w-8 h-[1px] bg-foreground/20"></span>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Vos Accès Sécurisés</span>
            </div>

            {tickets.map((ticket) => (
                <div
                    key={ticket.id}
                    className={`relative overflow-hidden group transition-all duration-500 hover:-translate-y-1 ${
                        ticket.isScanned ? 'opacity-50 grayscale' : 'opacity-100'
                    }`}
                    id={`ticket-${ticket.id}`}
                >
                    {/* TICKET BODY */}
                    <div className="flex bg-white dark:bg-white/10 backdrop-blur-md rounded-3xl overflow-hidden border border-foreground/5 dark:border-white/10 shadow-xl shadow-accent/5">
                        
                        {/* Left Side: Info */}
                        <div className="flex-1 p-6 md:p-8 space-y-4">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-accent uppercase tracking-widest leading-none mb-1">Pass Officiel</p>
                                <h4 className="font-serif text-xl font-light text-foreground">{ticket.eventTitle}</h4>
                            </div>

                            <div className="flex items-center gap-6 pt-2">
                                <div className="space-y-0.5">
                                    <p className="text-[9px] text-foreground/40 uppercase tracking-tighter">Date d'achat</p>
                                    <p className="text-xs font-bold">{new Date(ticket.purchasedAt).toLocaleDateString('fr-FR')}</p>
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[9px] text-foreground/40 uppercase tracking-tighter">Bénéficiaire</p>
                                    <p className="text-xs font-bold truncate max-w-[120px]">{ticket.userName}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                    ticket.isScanned ? 'bg-gray-100 text-gray-400' : 'bg-green-50 text-green-600'
                                }`}>
                                    {ticket.isScanned ? '✓ ACCÈS VALIDÉ' : '✓ VALIDE'}
                                </span>

                                {/* Download/Print Link (Goes to Studio) */}
                                <Link
                                    href={`/tickets/${ticket.id}`}
                                    className="p-2 rounded-xl bg-foreground/5 text-foreground/40 hover:bg-accent/10 hover:text-accent transition-all flex items-center gap-2 group/btn"
                                    title="Ouvrir le Studio d'impression"
                                >
                                    <span className="text-[8px] font-bold opacity-0 group-hover/btn:opacity-100 transition-opacity">STUDIO</span>
                                    <ExternalLink className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="relative w-8 bg-white dark:bg-transparent flex flex-col items-center justify-between py-2">
                             {/* Small notches */}
                            <div className="absolute top-[-8px] left-1/2 -translate-x-1/2 w-4 h-4 bg-background rounded-full border border-foreground/5 shadow-inner underline-offset-4"></div>
                            <div className="h-full border-r-2 border-dotted border-foreground/10"></div>
                            <div className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-4 h-4 bg-background rounded-full border border-foreground/5 shadow-inner"></div>
                        </div>

                        {/* Right Side: QR Code */}
                        <div className="p-6 md:p-8 bg-slate-50 dark:bg-black/40 flex items-center justify-center shrink-0 border-l border-foreground/5 dark:border-white/10">
                            <div className="w-20 h-20 bg-white p-2 rounded-2xl shadow-sm border border-foreground/[0.03] group-hover:scale-105 transition-transform duration-500">
                                <QRCode value={ticket.qrCodeData} size={64} fgColor="#1E1C1A" />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}