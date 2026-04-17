// components/events/TicketReservation.tsx
'use client';

import { useState } from 'react';
import { useSession } from '@/lib/hooks/useSession';
import { reserveTicket } from '@/lib/api/events';
import { loadStripe } from '@stripe/stripe-js';
import type { Event } from '@/lib/types/event';

interface TicketReservationProps {
    event: Event;
    onSuccess?: () => void;
}

export function TicketReservation({ event, onSuccess }: TicketReservationProps) {
    const { user } = useSession();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState(user?.email || '');
    const [name, setName] = useState(user?.name || '');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [paymentProcessing, setPaymentProcessing] = useState(false);
    const [ticket, setTicket] = useState<any>(null);

    const isSoldOut = event.maxAttendees
        ? event.currentAttendees >= event.maxAttendees
        : false;

    const handleReservation = async () => {
        if (!name || !email || (event.eventType === 'PAID' && !phoneNumber)) {
            setError('Veuillez remplir tous les champs obligatoires');
            return;
        }

        setLoading(true);
        if (event.eventType === 'PAID') setPaymentProcessing(true);
        setError('');

        try {
            const reservation = await reserveTicket(event.id, {
                userName: name,
                userEmail: email,
                phoneNumber: phoneNumber || undefined,
            });

            // Sauvegarder le billet
            localStorage.setItem(`ticket_${reservation.id}`, JSON.stringify(reservation));
            setTicket(reservation);
            setSuccess(true);

            if (onSuccess) onSuccess();
            
        } catch (err: any) {
            setError(err.message || 'Erreur lors de la réservation');
        } finally {
            setLoading(false);
            setPaymentProcessing(false);
        }
    };



    if (isSoldOut) {
        return (
            <div className="bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-[2rem] p-8 text-center backdrop-blur-sm">
                <p className="text-red-600 font-serif text-xl italic mb-1">Épuisé</p>
                <p className="text-red-500/60 text-xs uppercase tracking-widest font-bold">Toutes les places ont été réservées</p>
            </div>
        );
    }

    if (success) {
        return (
            <div className="bg-white/40 dark:bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-10 border border-emerald-500/20 shadow-xl text-center space-y-6">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                    <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <div>
                    <h3 className="font-serif text-3xl font-light mb-2 text-foreground">Place Confirmée !</h3>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-emerald-600 font-black">Réservation validée</p>
                </div>
                <div className="py-6 border-y border-foreground/5 space-y-4">
                    <p className="text-sm text-foreground/60 leading-relaxed italic">
                        &ldquo;L'art est un partage.&rdquo; <br/>
                        Votre invitation numérique a été envoyée à l'adresse <br/>
                        <span className="font-bold text-foreground underline decoration-accent/30">{email}</span>
                    </p>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="text-[10px] uppercase tracking-[0.4em] text-foreground/40 hover:text-accent font-bold transition-colors pt-4"
                >
                    Terminer
                </button>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="space-y-6">
                <button
                    onClick={() => window.location.href = `/login?redirect=/events/${event.id}`}
                    className="w-full py-5 bg-accent text-white rounded-[2rem] font-bold text-sm uppercase tracking-[0.3em] hover:bg-accent/90 transition-all duration-500 shadow-[0_20px_40px_-10px_rgba(var(--accent-rgb),0.3)] hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
                >
                    Réserver mon billet
                </button>
                <p className="text-[10px] text-foreground/40 text-center uppercase tracking-widest font-medium">
                    Connexion requise pour réserver
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white/40 dark:bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 border border-white dark:border-white/10 shadow-inner">
            <h3 className="font-serif text-2xl font-light mb-8 uppercase tracking-tight text-foreground/80">
                {event.eventType === 'FREE' ? 'Réservation' : 'Billetterie'}
            </h3>

            {event.eventType === 'PAID' && (
                <div className="mb-8 p-6 bg-accent/10 rounded-[2rem] border border-accent/20">
                    <p className="text-4xl font-black text-accent tracking-tighter">
                        {event.price?.toLocaleString()} <span className="text-sm font-normal opacity-60">CFA</span>
                    </p>
                    <p className="text-[10px] uppercase tracking-widest text-accent/60 mt-1 font-bold">Tarif unique</p>
                </div>
            )}

            <div className="space-y-6">
                <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-foreground/40 mb-2 ml-4">VOTRE NOM</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={loading || paymentProcessing}
                        className="w-full px-6 py-4 bg-white/50 dark:bg-white/5 border border-foreground/5 dark:border-white/10 rounded-2xl focus:outline-none focus:border-accent/40 focus:bg-white dark:focus:bg-white/10 transition-all text-sm font-medium disabled:opacity-50"
                        placeholder="Ex: Jean Dupont"
                    />
                </div>

                <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-foreground/40 mb-2 ml-4">VOTRE EMAIL</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading || paymentProcessing}
                        className="w-full px-6 py-4 bg-white/50 dark:bg-white/5 border border-foreground/5 dark:border-white/10 rounded-2xl focus:outline-none focus:border-accent/40 focus:bg-white dark:focus:bg-white/10 transition-all text-sm font-medium disabled:opacity-50"
                        placeholder="jean@exemple.com"
                    />
                </div>

                {event.eventType === 'PAID' && (
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest font-bold text-foreground/40 mb-2 ml-4">NUMÉRO MOBILE MONEY</label>
                        <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            disabled={loading || paymentProcessing}
                            className="w-full px-6 py-4 bg-white/50 dark:bg-white/5 border border-foreground/5 dark:border-white/10 rounded-2xl focus:outline-none focus:border-accent/40 focus:bg-white dark:focus:bg-white/10 transition-all text-sm font-medium disabled:opacity-50"
                            placeholder="6xx xxx xxx"
                        />
                        <p className="text-[9px] text-foreground/40 mt-2 ml-4 italic">Un prompt de validation apparaîtra sur votre téléphone</p>
                    </div>
                )}

                {error && (
                    <div className="px-4 py-3 bg-red-50 dark:bg-red-900/10 text-red-500 text-[10px] font-bold uppercase tracking-widest rounded-xl border border-red-100 dark:border-red-900/20">
                        {error}
                    </div>
                )}

                <button
                    onClick={handleReservation}
                    disabled={loading || paymentProcessing}
                    className="relative w-full py-5 bg-foreground text-background rounded-3xl font-bold text-[11px] uppercase tracking-[0.3em] hover:bg-accent hover:text-white transition-all duration-500 shadow-xl disabled:opacity-30 disabled:pointer-events-none mt-4 overflow-hidden"
                >
                    {paymentProcessing ? (
                        <span className="flex items-center justify-center gap-3">
                            <span className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                            Validation USSD en cours...
                        </span>
                    ) : loading ? (
                        <span className="flex items-center justify-center gap-3">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Traitement...
                        </span>
                    ) : (
                        event.eventType === 'FREE' ? 'Confirmer la réservation' : 'Payer et réserver'
                    )}
                </button>
            </div>

            {/* PAYMENT PROCESSING OVERLAY */}
            {paymentProcessing && (
                <div className="absolute inset-0 z-50 bg-white/60 dark:bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500 rounded-[2.5rem]">
                    <div className="relative w-20 h-20 mb-6">
                        <div className="absolute inset-0 border-4 border-accent/10 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="font-serif text-xl italic text-foreground/80 mb-2">Sécurisation du paiement</p>
                    <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-black animate-pulse">Ne pas fermer cette fenêtre</p>
                </div>
            )}

            <p className="text-[10px] text-foreground/30 text-center mt-8 italic">
                Un billet sécurisé vous sera transmis instantanément
            </p>
        </div>
    );
}