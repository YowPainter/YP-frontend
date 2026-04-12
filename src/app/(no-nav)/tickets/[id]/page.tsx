'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getMyTickets } from '@/lib/api/events';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import { generateTicketPDF } from '@/lib/utils/pdf';
import { FileText, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import type { TicketReservation } from '@/lib/types/event';

export default function TicketDownloadPage() {
    const { id } = useParams();
    const router = useRouter();
    const [ticket, setTicket] = useState<TicketReservation | null>(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState<'loading' | 'preparing' | 'generating' | 'done'>('loading');
    const ticketRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadTicket = async () => {
            try {
                const tickets = await getMyTickets();
                const found = tickets.find(t => t.id === id);
                if (found) {
                    setTicket(found);
                    setStatus('preparing');
                } else {
                    router.push('/events');
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        loadTicket();
    }, [id, router]);

    const handleDownload = async () => {
        if (!ticket) return;
        setStatus('generating');
        // Un petit délai pour s'assurer que le QR code est bien rendu
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        try {
            await generateTicketPDF('ticket-to-print', `YowPainter-${ticket.eventTitle.replace(/\s+/g, '-')}.pdf`);
            setStatus('done');
        } catch (error) {
            console.error(error);
            setStatus('preparing');
        }
    };

    if (loading) return null;

    return (
        <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-4 selection:bg-accent selection:text-white">
            {/* BACKGROUND DECOR */}
            <div className="fixed inset-0 z-[-1] opacity-30">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/10 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-500/10 blur-[120px] rounded-full"></div>
            </div>

            <div className="w-full max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
                    <div className="space-y-4">
                        <button 
                            onClick={() => router.back()}
                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-foreground/40 hover:text-accent transition-colors group"
                        >
                            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                            Retour
                        </button>
                        <h1 className="font-serif text-4xl md:text-5xl font-light text-foreground">Artistic Pass <span className="italic text-accent">Studio</span></h1>
                        <p className="text-[11px] uppercase tracking-[0.4em] text-foreground/30 font-bold">Génération de votre titre d'accès haute fidélité</p>
                    </div>

                    <div className="flex items-center gap-4">
                        {status === 'done' ? (
                            <div className="px-6 py-3 bg-green-50 text-green-600 rounded-2xl flex items-center gap-3 border border-green-100 scale-105 transition-transform duration-500">
                                <CheckCircle2 className="w-5 h-5" />
                                <span className="text-xs font-bold uppercase tracking-widest">Téléchargé !</span>
                            </div>
                        ) : (
                            <button
                                onClick={handleDownload}
                                disabled={status === 'generating'}
                                className="px-8 py-4 bg-foreground text-background rounded-2xl font-bold text-[11px] uppercase tracking-widest hover:bg-accent hover:text-white transition-all shadow-xl shadow-foreground/10 flex items-center gap-3 disabled:opacity-50"
                            >
                                {status === 'generating' ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Génération en cours...
                                    </>
                                ) : (
                                    <>
                                        <FileText className="w-4 h-4" />
                                        Générer le PDF HD
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>

                {/* THE TICKET PREVIEW AREA (The one that gets captured) */}
                <div className="bg-white/50 backdrop-blur-sm p-8 md:p-16 rounded-[3rem] border border-foreground/5 shadow-2xl relative overflow-hidden">
                    <div 
                        id="ticket-to-print" 
                        ref={ticketRef}
                        className="bg-white rounded-[2rem] flex flex-col md:flex-row overflow-hidden border max-w-3xl mx-auto"
                        style={{ width: '800px', borderColor: '#eeeeee' }} // Fixed width for consistent PDF aspect ratio
                    >
                        {/* LEFT SIDe */}
                        <div className="flex-1 p-10 space-y-8 relative">
                            {/* Artistic Background Splashes for the PDF - Using safe HEX */}
                            <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-50" style={{ backgroundColor: '#C26D5C' }}></div>
                            
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                     <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-1" style={{ color: '#C26D5C' }}>Pass Officiel • YowPainter</p>
                                     <h2 className="font-serif text-3xl font-light leading-tight" style={{ color: '#1E1C1A' }}>{ticket?.eventTitle}</h2>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(30, 28, 26, 0.3)' }}>ID BIllet</p>
                                    <p className="text-xs font-mono font-bold tracking-tighter" style={{ color: '#1E1C1A' }}>{ticket?.id}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-10">
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: 'rgba(30, 28, 26, 0.3)' }}>Propriétaire</p>
                                    <p className="text-sm font-bold" style={{ color: 'rgba(30, 28, 26, 0.8)' }}>{ticket?.userName}</p>
                                    <p className="text-[10px] italic" style={{ color: 'rgba(30, 28, 26, 0.6)' }}>{ticket?.userEmail}</p>
                                </div>
                                <div className="space-y-1 text-right">
                                    <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: 'rgba(30, 28, 26, 0.3)' }}>Date de l'événement</p>
                                    <p className="text-sm font-bold" style={{ color: 'rgba(30, 28, 26, 0.8)' }}>
                                        {ticket && new Date(ticket.purchasedAt).toLocaleDateString('fr-FR', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-dashed flex items-center justify-between" style={{ borderColor: 'rgba(30, 28, 26, 0.1)' }}>
                                <div className="space-y-2">
                                     <p className="text-[8px] max-w-[200px] font-serif leading-relaxed italic lowercase" style={{ color: 'rgba(30, 28, 26, 0.4)' }}>
                                        le voyage artistique commence ici. ce pass est votre titre d'accès sécurisé à l'exposition. 
                                     </p>
                                </div>
                                <div className="px-6 py-2 rounded-full text-[9px] font-bold uppercase tracking-[0.2em]" style={{ backgroundColor: '#1E1C1A', color: '#FAF9F6' }}>
                                    {ticket?.price === 0 ? 'ACCÈS LIBRE' : `PAYÉ • ${ticket?.price} CFA`}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT SIDE (QR) */}
                        <div className="w-[200px] flex flex-col items-center justify-center p-8 border-l border-dashed space-y-4" style={{ backgroundColor: '#f8fafc', borderLeftColor: 'rgba(30, 28, 26, 0.2)' }}>
                            <div className="p-3 bg-white rounded-2xl border border-[#f1f5f9]">
                                {ticket && <QRCode value={ticket.qrCodeData} size={120} />}
                            </div>
                            <p className="text-[8px] font-black uppercase tracking-tighter" style={{ color: 'rgba(30, 28, 26, 0.2)' }}>Scan to Validate</p>
                        </div>
                    </div>
                </div>

                {/* HELP TEXT */}
                <div className="text-center px-12">
                    <p className="text-[10px] text-foreground/40 leading-relaxed font-serif uppercase tracking-widest max-w-lg mx-auto">
                        Ce studio utilise une technologie de capture haute résolution pour garantir que votre pass conserve son grain artistique même en format PDF.
                    </p>
                </div>
            </div>
        </div>
    );
}
