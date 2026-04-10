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

    const handlePaidReservation = async () => {
        if (!name || !email) {
            setError('Veuillez remplir tous les champs');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // 1. Créer l'intention de paiement Stripe
            const response = await fetch('/api/payment/create-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: event.price,
                    eventId: event.id,
                    userName: name,
                    userEmail: email,
                }),
            });

            const { clientSecret } = await response.json();

            // 2. Rediriger vers Stripe Checkout ou utiliser Elements
            const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);
            const { error } = await stripe?.redirectToCheckout({
                sessionId: clientSecret,
            });

            if (error) throw error;
        } catch (err: any) {
            setError(err.message || 'Erreur lors du paiement');
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
                <p className="text-amber-800 mb-4">Connectez-vous pour réserver votre place</p>
                <a
                    href={`/login?redirect=/events/${event.id}`}
                    className="inline-block px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/80 transition"
                >
                    Se connecter
                </a>
            </div>
        );
    }

    if (isSoldOut) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <p className="text-red-600 font-semibold">Événement complet !</p>
                <p className="text-red-500 text-sm mt-2">Toutes les places sont réservées.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-foreground/10">
            <h3 className="text-2xl font-serif font-bold mb-4">
                {event.eventType === 'FREE' ? 'Réservation gratuite' : 'Acheter un billet'}
            </h3>

            {event.eventType === 'PAID' && (
                <div className="mb-4 p-4 bg-accent/5 rounded-lg">
                    <p className="text-3xl font-bold text-accent">
                        {event.price?.toLocaleString()} CFA
                    </p>
                    <p className="text-sm text-foreground/60">par personne</p>
                </div>
            )}

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Nom complet</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 border border-foreground/20 rounded-lg focus:outline-none focus:border-accent"
                        placeholder="Votre nom"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-foreground/20 rounded-lg focus:outline-none focus:border-accent"
                        placeholder="votre@email.com"
                    />
                </div>

                {error && (
                    <div className="text-red-500 text-sm">{error}</div>
                )}

                <button
                    onClick={event.eventType === 'FREE' ? handleFreeReservation : handlePaidReservation}
                    disabled={loading}
                    className="w-full py-3 bg-accent text-white rounded-lg font-semibold hover:bg-accent/80 transition disabled:opacity-50"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Traitement...
                        </span>
                    ) : (
                        event.eventType === 'FREE' ? 'Réserver gratuitement' : 'Payer et réserver'
                    )}
                </button>
            </div>

            <p className="text-xs text-foreground/40 text-center mt-4">
                Un billet électronique avec QR code vous sera envoyé par email
            </p>
        </div>
    );
}