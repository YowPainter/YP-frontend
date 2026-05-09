'use client'
import { useState } from 'react'
import { WalletPayoutService } from '@/lib/services/WalletPayoutService'
import type { Wallet }         from '@/lib/models/Wallet'
import {
  Overlay, ModalHeader, ModalFooter, Field, inputCls, Spinner,
} from './CreatePostModal'

type Props = {
  wallet: Wallet
  onClose: () => void
  onSuccess: () => void   // refetch balance après retrait
}

const NETWORKS = [
  { value: 'MTN',    label: 'MTN Mobile Money',   color: '#FFCC00' },
  { value: 'ORANGE', label: 'Orange Money',        color: '#FF6600' },
]

export default function WalletWithdrawModal({ wallet, onClose, onSuccess }: Props) {
  const [amount, setAmount]     = useState('')
  const [phone, setPhone]       = useState('')
  const [network, setNetwork]   = useState<'MTN' | 'ORANGE'>('MTN')
  const [step, setStep]         = useState<'form' | 'confirm' | 'success'>('form')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const balance    = wallet.balance ?? 0
  const currency   = wallet.currency ?? 'XAF'
  const amountNum  = parseFloat(amount) || 0
  const canSubmit  = amountNum > 0 && amountNum <= balance && phone.trim().length >= 8 && !loading

  /* ── Étape 1 : valider le formulaire → confirmation ── */
  function handleNext() {
    if (amountNum <= 0)          { setError('Montant invalide.'); return }
    if (amountNum > balance)     { setError('Solde insuffisant.'); return }
    if (phone.trim().length < 8) { setError('Numéro de téléphone invalide.'); return }
    setError('')
    setStep('confirm')
  }

  /* ── Étape 2 : appel API ── */
  async function handleConfirm() {
    setLoading(true); setError('')
    try {
      /* 1. Sauvegarder les infos de retrait si besoin */
      await WalletPayoutService.updatePayoutSettings(phone.trim(), network)
      /* 2. Déclencher le virement */
      await WalletPayoutService.requestPayout(amountNum)
      setStep('success')
      onSuccess()
    } catch {
      setError('Le virement a échoué. Vérifiez votre numéro et réessayez.')
      setStep('form')
    } finally {
      setLoading(false)
    }
  }

  /* ── Formatage monnaie ── */
  function fmt(n: number) {
    return n.toLocaleString('fr-FR', { minimumFractionDigits: 0 }) + ' ' + currency
  }

  return (
    <Overlay onClose={onClose}>
      <div className="flex flex-col w-full max-w-[440px] max-h-[90vh] bg-background rounded-none md:rounded-2xl shadow-2xl overflow-hidden">
        <ModalHeader
          title={step === 'success' ? 'Virement initié ✓' : 'Demander un virement'}
          onClose={onClose}
        />

        {/* ── Succès ── */}
        {step === 'success' && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 py-10 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
              <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div>
              <p className="font-serif text-xl font-semibold">{fmt(amountNum)}</p>
              <p className="text-sm text-foreground/50 mt-1">
                Virement en cours vers {phone} ({network})
              </p>
              <p className="text-xs text-foreground/30 mt-2">
                Délai habituel : 1 à 5 minutes
              </p>
            </div>
            <button onClick={onClose}
                    className="mt-2 px-8 py-2.5 rounded-full bg-foreground text-background text-sm font-medium hover:bg-accent hover:text-white transition-colors">
              Fermer
            </button>
          </div>
        )}

        {/* ── Confirmation ── */}
        {step === 'confirm' && (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 px-5 py-5 flex flex-col gap-4">
              <p className="text-sm text-foreground/60">Récapitulatif du virement</p>

              {[
                ['Montant',  fmt(amountNum)],
                ['Réseau',   network === 'MTN' ? 'MTN Mobile Money' : 'Orange Money'],
                ['Numéro',   phone],
                ['Solde restant', fmt(balance - amountNum)],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between py-2.5 border-b border-foreground/[0.07]">
                  <span className="text-xs text-foreground/50 uppercase tracking-wide">{label}</span>
                  <span className={`text-sm font-medium ${label === 'Solde restant' ? 'text-accent' : ''}`}>{value}</span>
                </div>
              ))}
            </div>

            <div className="px-5 py-3.5 border-t border-foreground/[0.09] flex gap-3">
              <button onClick={() => setStep('form')}
                      className="flex-1 py-2.5 rounded-full border border-foreground/10 text-sm text-foreground/60 hover:border-foreground/30 transition-colors">
                Modifier
              </button>
              <button onClick={handleConfirm} disabled={loading}
                      className="flex-1 py-2.5 rounded-full bg-foreground text-background text-sm font-medium hover:bg-accent hover:text-white transition-colors disabled:opacity-40">
                {loading
                  ? <span className="flex items-center justify-center gap-2"><Spinner/> Envoi…</span>
                  : 'Confirmer'}
              </button>
            </div>
          </div>
        )}

        {/* ── Formulaire ── */}
        {step === 'form' && (
          <>
            <div className="flex-1 overflow-y-auto min-h-0 px-5 py-4 flex flex-col gap-4">

              {/* Solde disponible */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-foreground/[0.03] border border-foreground/[0.07]">
                <span className="text-xs text-foreground/50 uppercase tracking-wider">Solde disponible</span>
                <span className="font-serif text-lg font-semibold text-accent">{fmt(balance)}</span>
              </div>

              {/* Réseau */}
              <Field label="Réseau *">
                <div className="flex gap-2">
                  {NETWORKS.map(n => (
                    <button key={n.value} onClick={() => setNetwork(n.value as 'MTN' | 'ORANGE')}
                            className={`flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                              network === n.value
                                ? 'border-foreground bg-foreground text-background'
                                : 'border-foreground/10 text-foreground/60 hover:border-foreground/30'
                            }`}>
                      {/* Pastille couleur réseau */}
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ background: n.color }}/>
                      {n.label}
                    </button>
                  ))}
                </div>
              </Field>

              {/* Numéro */}
              <Field label="Numéro de téléphone *">
                <input value={phone} onChange={e => setPhone(e.target.value)}
                       placeholder="ex. 655 00 00 00"
                       type="tel" maxLength={15}
                       className={inputCls}/>
              </Field>

              {/* Montant */}
              <Field label={`Montant (${currency}) *`}>
                <div className="relative">
                  <input value={amount} onChange={e => setAmount(e.target.value)}
                         type="number" min="1" max={balance} step="1"
                         placeholder="0"
                         className={inputCls}/>
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[13px] text-foreground/30">
                    {currency}
                  </span>
                </div>
                {/* Raccourcis */}
                <div className="flex gap-2 mt-1.5">
                  {[25, 50, 100].map(pct => {
                    const val = Math.floor(balance * pct / 100)
                    return (
                      <button key={pct} onClick={() => setAmount(String(val))}
                              className="flex-1 py-1 rounded-lg border border-foreground/10 text-[11px] text-foreground/50 hover:border-accent hover:text-accent transition-colors">
                        {pct}% <span className="text-foreground/30">({fmt(val)})</span>
                      </button>
                    )
                  })}
                </div>
              </Field>

            </div>

            <ModalFooter
              error={error}
              loading={false}
              disabled={!canSubmit}
              onSubmit={handleNext}
              label="Continuer"
            />
          </>
        )}

      </div>
    </Overlay>
  )
}
