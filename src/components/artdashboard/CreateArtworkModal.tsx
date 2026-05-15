"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Camera, X, Loader2, Plus, Trash2 } from "lucide-react";
import { ArtworksService } from "@/lib/services/ArtworksService";
import { ArtworkCreateRequest } from "@/lib/models/ArtworkCreateRequest";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { getApiErrorMessage } from "@/lib/api-error-handler";
import { toast } from "@/lib/toast";
import { useQueryClient } from "@tanstack/react-query";

interface CreateArtworkModalProps {
  onClose: () => void;
  artworkToEdit?: any; // If provided, we are in edit mode
}

export default function CreateArtworkModal({ onClose, artworkToEdit }: CreateArtworkModalProps) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);
  
  const [title, setTitle] = useState(artworkToEdit?.title || "");
  const [description, setDescription] = useState(artworkToEdit?.description || "");
  const [technique, setTechnique] = useState<ArtworkCreateRequest.technique>(
    artworkToEdit?.technique || "OIL"
  );
  const [style, setStyle] = useState<ArtworkCreateRequest.style>(
    artworkToEdit?.style || "ABSTRACT"
  );
  const [dimensions, setDimensions] = useState(artworkToEdit?.dimensions || "");
  const [tags, setTags] = useState<string[]>(artworkToEdit?.tags || []);
  const [tagInput, setTagInput] = useState("");
  
  const [images, setImages] = useState<{ file?: File; preview: string; isNew: boolean }[]>(
    artworkToEdit?.imageUrls?.map((url: string) => ({ preview: url, isNew: false })) || []
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditMode = !!artworkToEdit;

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      if (images.length + files.length > 5) {
        toast.error("Limite atteinte", "Maximum 5 images autorisées.");
        return;
      }

      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages(prev => [...prev, { file, preview: reader.result as string, isNew: true }]);
        };
        reader.readAsDataURL(file);
      });
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      setError("Une image est requise pour l'œuvre.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const imageUrls = await Promise.all(
        images.map(async (img) => {
          if (img.isNew && img.file) {
            return await uploadToCloudinary(img.file);
          }
          return img.preview;
        })
      );

      const requestBody: ArtworkCreateRequest = {
        title,
        description: description.trim() || undefined,
        technique,
        style,
        dimensions: dimensions.trim() || undefined,
        tags,
        imageUrls,
      };

      if (isEditMode) {
        await ArtworksService.updateArtwork(artworkToEdit.id, requestBody);
        toast.success("Œuvre mise à jour !", "Les modifications ont été enregistrées.");
      } else {
        const newArtwork = await ArtworksService.createArtwork(requestBody);
        if (newArtwork.id) {
          await ArtworksService.updateStatus(newArtwork.id, 'PUBLISHED');
        }
        toast.success("Œuvre créée !", "Votre nouvelle œuvre est maintenant en ligne.");
      }

      queryClient.invalidateQueries({ queryKey: ["artist-works"] });
      onClose();
    } catch (err: any) {
      const message = getApiErrorMessage(err);
      setError(message);
      toast.error(err, isEditMode ? "Mise à jour de l'œuvre" : "Création de l'œuvre");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-xl" 
        onClick={onClose}
      /><div className="bg-background w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col md:flex-row h-full md:h-[85vh] max-h-[90vh]">
        
        {/* Left Side: Image Upload */}
        <div className="w-full md:w-1/2 bg-foreground/5 relative flex flex-col items-center justify-center min-h-[300px] p-6 gap-4">
          {images.length > 0 ? (
            <div className="w-full h-full flex flex-col gap-4">
              {/* Main Preview */}
              <div className="relative flex-1 bg-white/50 rounded-2xl overflow-hidden group border border-foreground/5">
                <Image src={images[0].preview} alt="Preview" fill className="object-contain p-4" />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button 
                    type="button" 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 bg-white text-ink rounded-full shadow-lg hover:scale-110 transition-transform"
                  >
                    <Camera size={20} />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => removeImage(0)}
                    className="p-3 bg-red-500 text-white rounded-full shadow-lg hover:scale-110 transition-transform"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
              
              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-3 shrink-0">
                  {images.slice(1).map((img, i) => (
                    <div key={i} className="relative aspect-square bg-white/50 rounded-xl overflow-hidden group border border-foreground/5">
                      <Image src={img.preview} alt="Thumbnail" fill className="object-cover" />
                      <button 
                        type="button" 
                        onClick={() => removeImage(i + 1)}
                        className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  {images.length < 5 && (
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square rounded-xl border-2 border-dashed border-foreground/20 flex items-center justify-center text-foreground/40 hover:text-accent hover:border-accent hover:bg-accent/5 transition-all"
                    >
                      <Plus size={20} />
                    </button>
                  )}
                </div>
              )}
              {images.length === 1 && (
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-4 rounded-xl border-2 border-dashed border-foreground/20 flex items-center justify-center gap-2 text-foreground/40 hover:text-accent hover:border-accent hover:bg-accent/5 transition-all text-xs font-bold uppercase tracking-widest"
                >
                  <Plus size={16} /> Ajouter une image
                </button>
              )}
            </div>
          ) : (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center gap-4 cursor-pointer hover:text-accent transition-colors p-12 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-foreground/5 border-2 border-dashed border-foreground/20 flex items-center justify-center">
                <Plus size={32} />
              </div>
              <div>
                <p className="font-serif text-lg font-medium">Ajouter des images</p>
                <p className="text-xs text-foreground/40 mt-1 uppercase tracking-widest">JPG, PNG, WEBP (Max 5 images)</p>
              </div>
            </div>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            accept="image/*" 
            multiple
            className="hidden" 
          />
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 flex flex-col h-full overflow-hidden bg-background">
          <div className="px-8 py-6 border-b border-foreground/10 flex items-center justify-between shrink-0">
            <h2 className="font-serif text-2xl font-semibold">{isEditMode ? "Éditer l'œuvre" : "Nouvelle œuvre"}</h2>
            <button onClick={onClose} className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center hover:bg-foreground/10 transition-colors">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl">
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em]">Titre de l'œuvre</label>
              <input 
                required
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-transparent border-b border-foreground/10 py-3 outline-none focus:border-accent transition-colors text-xl font-serif"
                placeholder="Ex: L'Âme du Sahel"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em]">Description</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full bg-foreground/5 border border-foreground/10 rounded-xl p-4 outline-none focus:border-accent transition-colors text-sm font-light resize-none"
                placeholder="Décrivez l'histoire derrière cette pièce..."
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em]">Technique</label>
                <select 
                  value={technique}
                  onChange={(e) => setTechnique(e.target.value as any)}
                  className="w-full bg-transparent border-b border-foreground/10 py-2 outline-none focus:border-accent transition-colors text-sm"
                >
                  <option value="OIL">Huile</option>
                  <option value="ACRYLIC">Acrylique</option>
                  <option value="WATERCOLOR">Aquarelle</option>
                  <option value="GOUACHE">Gouache</option>
                  <option value="PASTEL">Pastel</option>
                  <option value="CHARCOAL">Fusain</option>
                  <option value="PENCIL">Crayon</option>
                  <option value="MIXED_MEDIA">Technique Mixte</option>
                  <option value="OTHER">Autre</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em]">Style</label>
                <select 
                  value={style}
                  onChange={(e) => setStyle(e.target.value as any)}
                  className="w-full bg-transparent border-b border-foreground/10 py-2 outline-none focus:border-accent transition-colors text-sm"
                >
                  <option value="ABSTRACT">Abstrait</option>
                  <option value="FIGURATIVE">Figuratif</option>
                  <option value="PORTRAIT">Portrait</option>
                  <option value="LANDSCAPE">Paysage</option>
                  <option value="STILL_LIFE">Nature Morte</option>
                  <option value="SURREALISM">Surréalisme</option>
                  <option value="IMPRESSIONISM">Impressionnisme</option>
                  <option value="POP_ART">Pop Art</option>
                  <option value="CONTEMPORARY">Contemporain</option>
                  <option value="OTHER">Autre</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em]">Dimensions</label>
              <input 
                type="text" 
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
                className="w-full bg-transparent border-b border-foreground/10 py-2 outline-none focus:border-accent transition-colors text-sm"
                placeholder="Ex: 80 x 120 cm"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em]">Tags</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1.5 px-3 py-1 bg-accent/10 text-accent text-[11px] rounded-full border border-accent/20">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)}><X size={10} /></button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="flex-1 bg-foreground/5 border border-foreground/10 rounded-full px-4 py-2 text-xs outline-none focus:border-accent transition-colors"
                  placeholder="Ajouter un tag..."
                />
                <button 
                  type="button" 
                  onClick={handleAddTag}
                  className="w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center hover:bg-accent hover:text-white transition-all"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </form>

          <div className="p-8 border-t border-foreground/10 flex gap-4 shrink-0">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-4 px-6 border border-foreground/20 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-foreground/5 transition-colors"
            >
              Annuler
            </button>
            <button 
              onClick={(e) => handleSubmit(e as any)}
              disabled={loading}
              className="flex-[2] py-4 px-6 bg-ink text-white rounded-xl text-sm font-bold uppercase tracking-widest shadow-xl hover:bg-accent transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isEditMode ? "Mettre à jour" : "Publier l'œuvre")}
            </button>
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
}
