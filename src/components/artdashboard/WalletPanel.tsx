'use client'
import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { WalletPayoutService } from '@/lib/services/WalletPayoutService'
import { WalletTransaction }   from '@/lib/models/WalletTransaction'
import WalletWithdrawModal     from './WalletWithdrawModal'
import { Skeleton }            from '@/components/ui/Skeleton'

/* ── Helpers ── */
function fmt(n: number, currency = 'XAF') {
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 0 }) + ' ' + currency
}
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

const TX_TYPE_META: Record<WalletTransaction.type, { label: string; sign: '+' | '-'; color: string }> = {
  SALE:       { label: 'Vente',       sign: '+', color: 'text-emerald-500' },
  COMMISSION: { label: 'Commission',  sign: '-', color: 'text-rose-400'    },
  WITHDRAWAL: { label: 'Retrait',     sign: '-', color: 'text-foreground/60' },
}

export default function WalletPanel() {
  const queryClient = useQueryClient()
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false)
  const [showHistory, setShowHistory]       = useState(false)

  const { data: wallet, isLoading: isWalletLoading } = useQuery({
    queryKey: ['wallet-balance'],
    queryFn:  () => WalletPayoutService.getBalance(),
  })
  const { data: transactions, isLoading: isTxLoading } = useQuery({
    queryKey: ['wallet-transactions'],
    queryFn:  () => WalletPayoutService.getTransactionHistory(),
    enabled:  showHistory,   // charge seulement quand l'historique est ouvert
  })

  const balance  = wallet?.balance  ?? 0
  const currency = wallet?.currency ?? 'XAF'

  return (
    <>
      {/* ── Carte solde ── */}
      <div className="rounded-2xl border border-foreground/[0.08] bg-foreground/[0.02] overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-3">
          <div className="flex items-center gap-2 text-foreground/50">
            {/* Icône portefeuille */}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
              <path d="M16 3H8a2 2 0 0 0-2 2v2h12V5a2 2 0 0 0-2-2z"/>
              <circle cx="17" cy="14" r="1.5" fill="currentColor"/>
            </svg>
            <span className="text-[11px] uppercase tracking-wider font-medium">Porte-monnaie</span>
          </div>
          {/* Bouton retrait */}
          <button
            onClick={() => wallet && setIsWithdrawOpen(true)}
            disabled={isWalletLoading || balance === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium
                       bg-accent/10 text-accent hover:bg-accent hover:text-white
                       transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
              <path d="M12 5v14M5 12l7 7 7-7"/>
            </svg>
            Retirer
          </button>
        </div>

        {/* Solde */}
        <div className="px-4 pb-4">
          {isWalletLoading ? (
            <Skeleton className="h-8 w-36 rounded-lg"/>
          ) : (
            <div className="font-serif text-2xl font-semibold leading-none text-foreground">
              {fmt(balance, currency)}
            </div>
          )}
          {wallet?.lastUpdatedAt && (
            <p className="text-[10px] text-foreground/30 mt-1">
              Mis à jour le {fmtDate(wallet.lastUpdatedAt)}
            </p>
          )}
        </div>

        {/* Toggle historique */}
        <button
          onClick={() => setShowHistory(p => !p)}
          className="w-full flex items-center justify-between px-4 py-2.5 border-t border-foreground/[0.07]
                     text-[11px] text-foreground/40 hover:text-foreground/70 hover:bg-foreground/[0.02]
                     transition-colors"
        >
          <span className="uppercase tracking-wider">Historique</span>
          <svg className={`w-3.5 h-3.5 transition-transform ${showHistory ? 'rotate-180' : ''}`}
               fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>

        {/* Liste des transactions */}
        {showHistory && (
          <div className="border-t border-foreground/[0.07]">
            {isTxLoading ? (
              <div className="px-4 py-3 flex flex-col gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-9 w-full rounded-lg opacity-40"/>
                ))}
              </div>
            ) : !transactions?.length ? (
              <p className="px-4 py-4 text-xs text-foreground/30 text-center">
                Aucune transaction pour le moment.
              </p>
            ) : (
              <ul className="divide-y divide-foreground/[0.05] max-h-[220px] overflow-y-auto">
                {transactions.map(tx => {
                  const meta = tx.type ? TX_TYPE_META[tx.type] : null
                  return (
                    <li key={tx.id} className="flex items-center justify-between px-4 py-3 hover:bg-foreground/[0.02] transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Icône type */}
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                          tx.type === WalletTransaction.type.SALE
                            ? 'bg-emerald-50 text-emerald-500'
                            : tx.type === WalletTransaction.type.WITHDRAWAL
                              ? 'bg-foreground/[0.06] text-foreground/50'
                              : 'bg-rose-50 text-rose-400'
                        }`}>
                          {tx.type === WalletTransaction.type.SALE && (
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                              <path d="M12 19V5M5 12l7-7 7 7"/>
                            </svg>
                          )}
                          {tx.type === WalletTransaction.type.WITHDRAWAL && (
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                              <path d="M12 5v14M5 12l7 7 7-7"/>
                            </svg>
                          )}
                          {tx.type === WalletTransaction.type.COMMISSION && (
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                              <path d="M12 5v14M5 12l7 7 7-7"/>
                            </svg>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-medium truncate">
                            {tx.description || meta?.label || tx.type}
                          </div>
                          {tx.createdAt && (
                            <div className="text-[10px] text-foreground/35">{fmtDate(tx.createdAt)}</div>
                          )}
                        </div>
                      </div>
                      {/* Montant */}
                      {tx.amount != null && (
                        <span className={`text-sm font-semibold shrink-0 ml-3 ${meta?.color ?? ''}`}>
                          {meta?.sign}{fmt(tx.amount, currency)}
                        </span>
                      )}
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Modal retrait */}
      {isWithdrawOpen && wallet && (
        <WalletWithdrawModal
          wallet={wallet}
          onClose={() => setIsWithdrawOpen(false)}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['wallet-balance'] })
            queryClient.invalidateQueries({ queryKey: ['wallet-transactions'] })
          }}
        />
      )}
    </>
  )
}
