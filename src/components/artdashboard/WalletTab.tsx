'use client'
import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { WalletPayoutService } from '@/lib/services/WalletPayoutService'
import { formatPrice } from '@/lib/utils'
import { Wallet, WalletTransaction as WT } from '@/lib/models/WalletTransaction'
import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Settings, 
  CreditCard, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Smartphone,
  ChevronRight
} from 'lucide-react'
import { toast } from '@/lib/toast'
import { Skeleton } from '@/components/ui/Skeleton'

export default function WalletTab() {
  const queryClient = useQueryClient()
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [isUpdatingSettings, setIsUpdatingSettings] = useState(false)
  
  // Settings form state
  const [payoutPhone, setPayoutPhone] = useState('')
  const [payoutNetwork, setPayoutNetwork] = useState('ORANGE')

  const { data: balance, isLoading: isBalanceLoading } = useQuery({
    queryKey: ['wallet-balance'],
    queryFn: () => WalletPayoutService.getBalance(),
  })

  const { data: transactions, isLoading: isTransactionsLoading } = useQuery({
    queryKey: ['wallet-transactions'],
    queryFn: () => WalletPayoutService.getTransactionHistory(),
  })

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault()
    const amount = parseFloat(withdrawAmount)
    if (isNaN(amount) || amount <= 0) {
      toast.error('Veuillez entrer un montant valide')
      return
    }
    if (amount > (balance?.balance || 0)) {
      toast.error('Solde insuffisant')
      return
    }

    setIsWithdrawing(true)
    try {
      await WalletPayoutService.requestPayout(amount)
      toast.success('Demande de retrait envoyée !')
      setWithdrawAmount('')
      queryClient.invalidateQueries({ queryKey: ['wallet-balance'] })
      queryClient.invalidateQueries({ queryKey: ['wallet-transactions'] })
    } catch (err) {
      toast.error(err, 'Erreur de retrait')
    } finally {
      setIsWithdrawing(false)
    }
  }

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!payoutPhone) {
      toast.error('Numéro requis')
      return
    }

    setIsUpdatingSettings(true)
    try {
      await WalletPayoutService.updatePayoutSettings(payoutPhone, payoutNetwork)
      toast.success('Informations de retrait mises à jour')
    } catch (err) {
      toast.error(err, 'Erreur de mise à jour')
    } finally {
      setIsUpdatingSettings(false)
    }
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* ── Header Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Solde Actuel */}
        <div className="glass-elegant p-8 rounded-[2.5rem] border border-foreground/5 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
            <TrendingUp size={120} />
          </div>
          <p className="text-[10px] uppercase tracking-[0.3em] font-black text-foreground/30 mb-4">Solde Disponible</p>
          {isBalanceLoading ? (
            <Skeleton className="h-12 w-3/4" />
          ) : (
            <h2 className="font-serif text-5xl font-light tracking-tighter text-accent">
              {formatPrice(balance?.balance || 0)}
            </h2>
          )}
          <p className="text-[10px] text-foreground/40 mt-6 font-bold uppercase tracking-widest flex items-center gap-2">
            <CheckCircle2 size={12} className="text-emerald-500" />
            Compte vérifié
          </p>
        </div>

        {/* Retrait Rapide */}
        <div className="md:col-span-2 glass-elegant p-8 rounded-[2.5rem] border border-foreground/5 shadow-sm">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1 space-y-4">
              <h3 className="font-serif text-2xl italic">Demander un retrait</h3>
              <p className="text-xs text-foreground/50 font-light leading-relaxed">
                Les fonds seront transférés sur votre compte Mobile Money configuré sous 24h.
              </p>
            </div>
            <form onSubmit={handleWithdraw} className="w-full md:w-auto flex gap-3">
              <div className="relative">
                <input 
                  type="number" 
                  placeholder="Montant"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="bg-foreground/[0.03] border border-foreground/10 rounded-2xl px-6 py-4 text-sm font-bold w-full md:w-40 outline-none focus:border-accent transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-foreground/20">XAF</span>
              </div>
              <button 
                type="submit"
                disabled={isWithdrawing || !balance?.balance}
                className="bg-foreground text-background px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-accent hover:text-white transition-all disabled:opacity-30 flex items-center gap-2"
              >
                {isWithdrawing ? <Loader2 size={14} className="animate-spin" /> : <ArrowUpRight size={14} />}
                Retirer
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* ── Transactions History ── */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-serif text-2xl">Historique des transactions</h3>
            <span className="text-[10px] uppercase tracking-widest font-black text-foreground/20">Flux financier</span>
          </div>
          
          <div className="space-y-3">
            {isTransactionsLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-20 glass-elegant rounded-3xl p-4 flex items-center gap-4">
                  <Skeleton className="w-12 h-12 rounded-2xl" />
                  <div className="flex-1"><Skeleton className="h-4 w-1/3 mb-2" /><Skeleton className="h-3 w-1/4" /></div>
                  <Skeleton className="h-6 w-20" />
                </div>
              ))
            ) : !transactions || transactions.length === 0 ? (
              <div className="py-20 text-center glass-elegant rounded-[3rem] border-dashed border-2 border-foreground/5">
                <AlertCircle size={40} className="mx-auto text-foreground/10 mb-4" />
                <p className="text-sm text-foreground/30 font-light">Aucune transaction enregistrée pour le moment.</p>
              </div>
            ) : (
              transactions.map((tx) => (
                <div key={tx.id} className="glass-elegant hover:bg-foreground/[0.02] transition-all rounded-[2rem] p-5 flex items-center gap-6 border border-foreground/5 group">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                    tx.type === 'SALE' ? 'bg-emerald-500/10 text-emerald-600' : 
                    tx.type === 'WITHDRAWAL' ? 'bg-amber-500/10 text-amber-600' : 'bg-foreground/5 text-foreground/40'
                  }`}>
                    {tx.type === 'SALE' ? <ArrowDownLeft size={24} /> : <ArrowUpRight size={24} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-sm">{tx.description || (tx.type === 'SALE' ? 'Vente d\'œuvre' : 'Retrait de fonds')}</h4>
                      <span className={`font-mono text-sm font-bold ${tx.type === 'SALE' ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {tx.type === 'SALE' ? '+' : '-'}{formatPrice(tx.amount || 0)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] text-foreground/30 font-bold uppercase tracking-widest">
                      <span>{new Date(tx.createdAt!).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}</span>
                      <span className="w-1 h-1 rounded-full bg-foreground/10"></span>
                      <span>Ref: {tx.id?.slice(0, 8)}</span>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight size={16} className="text-foreground/20" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── Payout Settings ── */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <Settings size={20} className="text-accent" />
            <h3 className="font-serif text-2xl">Paramètres</h3>
          </div>

          <div className="glass-elegant p-8 rounded-[2.5rem] border border-foreground/5 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-foreground/40 mb-2">
                <CreditCard size={18} />
                <span className="text-[10px] uppercase tracking-widest font-black">Méthode de retrait</span>
              </div>
              
              <form onSubmit={handleUpdateSettings} className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/30 px-2">Réseau</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['ORANGE', 'MTN'].map((net) => (
                      <button
                        key={net}
                        type="button"
                        onClick={() => setPayoutNetwork(net)}
                        className={`py-3 rounded-2xl text-[10px] font-black tracking-widest border transition-all ${
                          payoutNetwork === net 
                            ? 'bg-foreground text-background border-foreground' 
                            : 'bg-foreground/[0.02] border-foreground/10 text-foreground/40 hover:border-foreground/20'
                        }`}
                      >
                        {net} MONEY
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/30 px-2">Numéro de téléphone</label>
                  <div className="relative">
                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20 w-4 h-4" />
                    <input 
                      type="tel" 
                      placeholder="6xx xxx xxx"
                      value={payoutPhone}
                      onChange={(e) => setPayoutPhone(e.target.value)}
                      className="w-full bg-foreground/[0.02] border border-foreground/10 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold outline-none focus:border-accent transition-all"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isUpdatingSettings}
                  className="w-full bg-foreground/[0.05] hover:bg-accent hover:text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-foreground/5"
                >
                  {isUpdatingSettings ? <Loader2 size={14} className="animate-spin" /> : 'Enregistrer'}
                </button>
              </form>
            </div>

            <div className="pt-6 border-t border-foreground/5">
              <div className="p-4 bg-accent/5 rounded-2xl flex gap-4">
                <AlertCircle className="text-accent shrink-0" size={18} />
                <p className="text-[10px] text-accent/80 leading-relaxed font-medium">
                  Assurez-vous que le numéro renseigné correspond à un compte Mobile Money actif à votre nom pour éviter tout rejet de virement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
