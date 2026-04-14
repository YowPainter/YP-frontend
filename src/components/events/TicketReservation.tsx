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
    const [error, setError] = useState('');

    const isSoldOut = event.maxAttendees
        ? event.currentAttendees >= event.maxAttendees
        : false;

    const handleFreeReservation = async () => {
        if (!name || !email) {
            setError('Veuillez remplir tous les champs');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const reservation = await reserveTicket(event.id, {
                userName: name,
                userEmail: email,
            });

            // Stocker le billet dans le store ou localStorage
            localStorage.setItem(`ticket_${reservation.id}`, JSON.stringify(reservation));

            alert('Réservation confirmée ! Votre billet a été envoyé par email.');
            if (onSuccess) {
                onSuccess();
            } else {
                window.location.reload();
            }
        } catch (err: any) {
            setError(err.message || 'Erreur lors de la réservation');
        } finally {
            setLoading(false);
        }
    };

    const [paymentProcessing, setPaymentProcessing] = useState(false);

    const handlePaidReservation = async () => {
        setPaymentProcessing(true);
        setError('');

        try {
            // Simulation d'une redirection sécurisée vers Stripe/Paypal
            await new Promise(resolve => setTimeout(resolve, 2500));
            
            // Une fois le "paiement" validé, on appelle la réservation réelle (mock)
            const reservation = await reserveTicket(event.id, {
                userName: name,
                userEmail: email,
            });

            // Sauvegarder localement pour le mode démo
            localStorage.setItem(`ticket_${reservation.id}`, JSON.stringify(reservation));

            if (onSuccess) {
                onSuccess();
            } else {
                window.location.reload();
            }
        } catch (err: any) {
            setError(err.message || 'Le paiement a échoué');
        } finally {
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

                {error && (
                    <div className="px-4 py-2 bg-red-50 text-red-500 text-[10px] font-bold uppercase tracking-widest rounded-lg">
                        {error}
                    </div>
                )}

                <button
                    onClick={event.eventType === 'FREE' ? handleFreeReservation : handlePaidReservation}
                    disabled={loading || paymentProcessing}
                    className="relative w-full py-5 bg-foreground text-background rounded-3xl font-bold text-[11px] uppercase tracking-[0.3em] hover:bg-accent hover:text-white transition-all duration-500 shadow-xl disabled:opacity-30 disabled:pointer-events-none mt-4 overflow-hidden"
                >
                    {paymentProcessing ? (
                        <span className="flex items-center justify-center gap-3">
                            <span className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                            Transaction Sécurisée...
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