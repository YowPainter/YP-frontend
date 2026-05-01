"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Camera, X, Loader2, Plus, Calendar, MapPin, Users, Tag } from "lucide-react";
import { EventsService } from "@/lib/services/EventsService";
import { EventCreateRequest } from "@/lib/models/EventCreateRequest";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { getApiErrorMessage } from "@/lib/api-error-handler";
import { toast } from "@/lib/toast";
import { useQueryClient } from "@tanstack/react-query";

interface CreateEventModalProps {
  onClose: () => void;
  eventToEdit?: any;
}

export default function CreateEventModal({ onClose, eventToEdit }: CreateEventModalProps) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [name, setName] = useState(eventToEdit?.name || "");
  const [description, setDescription] = useState(eventToEdit?.description || "");
  const [location, setLocation] = useState(eventToEdit?.location || "");
  const [type, setType] = useState<EventCreateRequest.type>(
    eventToEdit?.type || "EXHIBITION"
  );
  const [startDateTime, setStartDateTime] = useState(
    eventToEdit?.startDateTime ? new Date(eventToEdit.startDateTime).toISOString().slice(0, 16) : ""
  );
  const [endDateTime, setEndDateTime] = useState(
    eventToEdit?.endDateTime ? new Date(eventToEdit.endDateTime).toISOString().slice(0, 16) : ""
  );
  const [maxCapacity, setMaxCapacity] = useState<number | string>(eventToEdit?.maxCapacity || "");
  const [ticketPrice, setTicketPrice] = useState<number | string>(eventToEdit?.ticketPrice || "");
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    eventToEdit?.posterUrl || null
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditMode = !!eventToEdit;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let finalImageUrl = eventToEdit?.posterUrl || "";

      if (imageFile) {
        finalImageUrl = await uploadToCloudinary(imageFile);
      }

      const requestBody: EventCreateRequest = {
        name,
        description,
        location,
        type,
        startDateTime: new Date(startDateTime).toISOString(),
        endDateTime: new Date(endDateTime).toISOString(),
        maxCapacity: maxCapacity ? Number(maxCapacity) : undefined,
        ticketPrice: ticketPrice ? Number(ticketPrice) : undefined,
        posterUrl: finalImageUrl,
      };

      if (isEditMode) {
        await EventsService.updateEvent(eventToEdit.id, requestBody);
        toast.success("Événement mis à jour !", "Les modifications ont été enregistrées.");
      } else {
        await EventsService.createEvent(requestBody);
        toast.success("Événement créé !", "Votre événement est maintenant répertorié.");
      }

      queryClient.invalidateQueries({ queryKey: ["artist-events"] });
      onClose();
    } catch (err: any) {
      const message = getApiErrorMessage(err);
      setError(message);
      toast.error(err, isEditMode ? "Mise à jour de l'événement" : "Création de l'événement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-background w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col md:flex-row h-full md:h-[85vh] max-h-[90vh]">
        
        {/* Left Side: Poster Upload */}
        <div className="w-full md:w-2/5 bg-foreground/5 relative flex items-center justify-center border-b md:border-b-0 md:border-r border-foreground/10">
          {imagePreview ? (
            <div className="relative w-full h-full group">
              <Image src={imagePreview} alt="Poster" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3 bg-white text-ink rounded-full shadow-lg hover:scale-110 transition-transform"
                >
                  <Camera size={20} />
                </button>
              </div>
            </div>
          ) : (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center gap-4 cursor-pointer hover:text-accent transition-colors p-8 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-foreground/5 border-2 border-dashed border-foreground/20 flex items-center justify-center">
                <Plus size={24} />
              </div>
              <div>
                <p className="font-serif text-base font-medium">Affiche de l'événement</p>
                <p className="text-[10px] text-foreground/40 mt-1 uppercase tracking-widest">Portrait recommandé</p>
              </div>
            </div>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-3/5 flex flex-col h-full bg-background">
          <div className="px-8 py-6 border-b border-foreground/10 flex items-center justify-between shrink-0">
            <h2 className="font-serif text-xl font-semibold">{isEditMode ? "Éditer l'événement" : "Nouvel événement"}</h2>
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
              <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em]">Nom de l'événement</label>
              <input 
                required
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent border-b border-foreground/10 py-2 outline-none focus:border-accent transition-colors text-lg font-serif"
                placeholder="Ex: Vernissage : L'Éveil Chromatique"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em]">Description</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full bg-foreground/5 border border-foreground/10 rounded-xl p-3 outline-none focus:border-accent transition-colors text-sm font-light resize-none"
                placeholder="Programme, thématique, artistes invités..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em] flex items-center gap-2"><Calendar size={12}/> Début</label>
                <input 
                  required
                  type="datetime-local" 
                  value={startDateTime}
                  onChange={(e) => setStartDateTime(e.target.value)}
                  className="w-full bg-transparent border-b border-foreground/10 py-2 outline-none focus:border-accent transition-colors text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em] flex items-center gap-2"><Calendar size={12}/> Fin</label>
                <input 
                  required
                  type="datetime-local" 
                  value={endDateTime}
                  onChange={(e) => setEndDateTime(e.target.value)}
                  className="w-full bg-transparent border-b border-foreground/10 py-2 outline-none focus:border-accent transition-colors text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em] flex items-center gap-2"><MapPin size={12}/> Lieu</label>
              <input 
                required
                type="text" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-transparent border-b border-foreground/10 py-2 outline-none focus:border-accent transition-colors text-sm"
                placeholder="Ex: Galerie d'Art Moderne, Yaoundé"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em] flex items-center gap-2"><Tag size={12}/> Type</label>
                <select 
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full bg-transparent border-b border-foreground/10 py-2 outline-none focus:border-accent transition-colors text-sm"
                >
                  <option value="EXHIBITION">Exposition</option>
                  <option value="WORKSHOP">Atelier</option>
                  <option value="AUCTION">Enchères</option>
                  <option value="MEETUP">Rencontre</option>
                  <option value="OTHER">Autre</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em] flex items-center gap-2"><Users size={12}/> Capacité</label>
                <input 
                  type="number" 
                  value={maxCapacity}
                  onChange={(e) => setMaxCapacity(e.target.value)}
                  className="w-full bg-transparent border-b border-foreground/10 py-2 outline-none focus:border-accent transition-colors text-sm"
                  placeholder="Illimitée"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em]">Prix du billet (XAF)</label>
              <input 
                type="number" 
                value={ticketPrice}
                onChange={(e) => setTicketPrice(e.target.value)}
                className="w-full bg-transparent border-b border-foreground/10 py-2 outline-none focus:border-accent transition-colors text-sm font-semibold text-accent"
                placeholder="Gratuit"
              />
            </div>
          </form>

          <div className="p-8 border-t border-foreground/10 flex gap-4 shrink-0">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-foreground/20 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-foreground/5 transition-colors"
            >
              Annuler
            </button>
            <button 
              onClick={(e) => handleSubmit(e as any)}
              disabled={loading}
              className="flex-[2] py-3 px-4 bg-accent text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg hover:bg-ink transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (isEditMode ? "Enregistrer" : "Créer l'événement")}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
