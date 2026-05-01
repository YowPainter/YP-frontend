"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Package, Tag, Hash, DollarSign, Info } from "lucide-react";
import { ShopOrdersService } from "@/lib/services/ShopOrdersService";
import { ProductCreateRequest } from "@/lib/models/ProductCreateRequest";
import { getApiErrorMessage } from "@/lib/api-error-handler";
import { toast } from "@/lib/toast";
import { useQueryClient } from "@tanstack/react-query";

interface CreateArticleModalProps {
  onClose: () => void;
  artwork: any; // The artwork being "transformed" into an article
}

export default function CreateArticleModal({ onClose, artwork }: CreateArticleModalProps) {
  const queryClient = useQueryClient();
  
  const [name, setName] = useState(artwork?.title || "");
  const [description, setDescription] = useState(artwork?.description || "");
  const [price, setPrice] = useState<number | string>("");
  const [stockQuantity, setStockQuantity] = useState<number | string>("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const requestBody: ProductCreateRequest = {
        artworkId: artwork.id,
        name,
        description,
        price: Number(price),
        stockQuantity: Number(stockQuantity),
      };

      await ShopOrdersService.createProduct(requestBody);
      toast.success("Article mis en boutique !", `${name} est maintenant disponible à la vente.`);

      queryClient.invalidateQueries({ queryKey: ["artist-inventory"] });
      onClose();
    } catch (err: any) {
      const message = getApiErrorMessage(err);
      setError(message);
      toast.error(err, "Mise en vente de l'œuvre");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-background w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        <div className="px-8 py-6 border-b border-foreground/10 flex items-center justify-between">
          <h2 className="font-serif text-2xl font-semibold flex items-center gap-3">
            <Package className="text-accent" />
            Mettre en boutique
          </h2>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center hover:bg-foreground/10 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
          <div className="flex items-start gap-4 p-4 bg-accent/5 rounded-xl border border-accent/10">
            <Info className="text-accent shrink-0 mt-0.5" size={18} />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-accent mb-1">Œuvre source</p>
              <p className="text-sm font-serif font-medium">{artwork.title}</p>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em] flex items-center gap-2">
              <Tag size={12} /> Nom de l'article en boutique
            </label>
            <input 
              required
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent border-b border-foreground/10 py-2 outline-none focus:border-accent transition-colors text-lg"
              placeholder="Ex: Reproduction A3 - L'Âme du Sahel"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em]">Description commerciale</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full bg-foreground/5 border border-foreground/10 rounded-xl p-4 outline-none focus:border-accent transition-colors text-sm font-light resize-none"
              placeholder="Détails du produit (matériaux, dimensions de l'impression...)"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em] flex items-center gap-2">
                <DollarSign size={12} /> Prix de vente (XAF)
              </label>
              <input 
                required
                type="number" 
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-transparent border-b border-foreground/10 py-2 outline-none focus:border-accent transition-colors text-base font-semibold"
                placeholder="0"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em] flex items-center gap-2">
                <Hash size={12} /> Quantité disponible
              </label>
              <input 
                required
                type="number" 
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                className="w-full bg-transparent border-b border-foreground/10 py-2 outline-none focus:border-accent transition-colors text-base"
                placeholder="1"
              />
            </div>
          </div>

          <div className="pt-6 flex gap-4">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-4 px-6 border border-foreground/20 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-foreground/5 transition-colors"
            >
              Annuler
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex-[2] py-4 px-6 bg-ink text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-xl hover:bg-accent transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Valider la mise en vente"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
