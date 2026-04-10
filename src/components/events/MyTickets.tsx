// components/events/MyTickets.tsx
'use client';

import { useEffect, useState } from 'react';
import { getMyTickets } from '@/lib/api/events';
import { QRCodeSVG as QRCode } from 'qrcode.react';
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
        return <div className="text-center py-4">Chargement...</div>;
    }

    if (tickets.length === 0) {
        return (
            <div className="text-center py-8 text-foreground/40">
                <p>Aucun billet pour cet événement</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold">Mes billets</h3>

            {tickets.map((ticket) => (
                <div
                    key={ticket.id}
                    className={`bg-white rounded-lg p-4 border ${ticket.isScanned ? 'border-gray-300 opacity-60' : 'border-accent/30'
                        }`}
                >
                    <div className="flex items-center gap-4">
                        {/* QR Code */}
                        <div className="w-24 h-24 bg-white p-2 rounded-lg shadow-sm">
                            <QRCode value={ticket.qrCodeData} size={80} />
                        </div>

                        <div className="flex-1">
                            <p className="font-semibold">{ticket.eventTitle}</p>
                            <p className="text-sm text-foreground/60">
                                {new Date(ticket.purchasedAt).toLocaleDateString('fr-FR')}
                            </p>
                            <p className="text-xs text-foreground/40 mt-1">
                                {ticket.isScanned ? '✓ Billet utilisé' : '✓ Billet valide'}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}