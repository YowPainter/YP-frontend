"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Camera, X, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { ArtistsService } from "@/lib/services/ArtistsService";
import { BuyerProfileService } from "@/lib/services/BuyerProfileService";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { getApiErrorMessage } from "@/lib/api-error-handler";
import { toast } from "@/lib/toast";

interface EditProfileModalProps {
  onClose: () => void;
}

export function EditProfileModal({ onClose }: EditProfileModalProps) {
  const user = useAuthStore((state) => state.user);
  const refreshProfile = useAuthStore((state) => state.refreshProfile);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [artistName, setArtistName] = useState(user?.artistName || "");
  const [bio, setBio] = useState(user?.bio || "");
  
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user?.profilePictureUrl || null
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isArtist = user?.role === "ROLE_ARTIST";

  // Prevent background scrolling while modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setAvatar(null);
    setAvatarPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let avatarUrl = user?.profilePictureUrl || "";

      // Upload image to Cloudinary if changed
      if (avatar) {
        avatarUrl = await uploadToCloudinary(avatar);
      } else if (!avatarPreview) {
        // If avatar was removed
        avatarUrl = "";
      }

      // API Call based on role
      if (isArtist) {
        await ArtistsService.updateMyProfile({
          firstName,
          lastName,
          artistName: artistName || `${firstName} ${lastName}`,
          bio,
          profilePictureUrl: avatarUrl,
        });
      } else {
        // Update basic info (names, bio)
        await BuyerProfileService.updateProfile({
          firstName,
          lastName,
          bio,
        });
        
        // Update profile picture if it changed
        if (avatarUrl) {
          await BuyerProfileService.updateProfilePicture({
            profilePictureUrl: avatarUrl,
          });
        }
      }

      // Refresh the store and close modal
      await refreshProfile();
      toast.success('Profil mis à jour !', 'Vos informations ont été enregistrées avec succès.');
      onClose();
    } catch (err: any) {
      const message = getApiErrorMessage(err);
      setError(message);
      toast.error(err, 'Mise à jour du profil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-background w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-foreground/10 flex items-center justify-between">
          <h2 className="font-serif text-xl font-semibold">Modifier le profil</h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center hover:bg-foreground/10 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded">
              {error}
            </div>
          )}

          {/* Avatar Area */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="w-24 h-24 rounded-full border border-foreground/20 overflow-hidden bg-foreground/5 flex items-center justify-center group-hover:border-accent transition-colors">
                {avatarPreview ? (
                  <Image src={avatarPreview} alt="Avatar preview" width={96} height={96} className="object-cover w-full h-full" />
                ) : (
                  <span className="font-serif text-3xl font-semibold text-accent">
                    {(firstName?.[0] || 'U').toUpperCase()}
                  </span>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <Camera size={24} />
                </div>
              </div>
              {avatarPreview && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeAvatar();
                  }}
                  className="absolute -top-1 -right-1 bg-red-500 text-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleAvatarChange}
              accept="image/*"
              className="hidden"
            />
            <p className="text-xs text-foreground/50">Cliquez pour modifier (Max 5MB)</p>
          </div>

          {/* Form Fields */}
          <div className="space-y-4 max-h-[300px] overflow-y-auto px-1 -mx-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-medium text-foreground/60 uppercase tracking-widest">Prénom</label>
                <input 
                  type="text" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-transparent border-b border-foreground/10 py-2 outline-none focus:border-accent transition-colors text-sm font-light"
                  placeholder="Votre prénom"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-medium text-foreground/60 uppercase tracking-widest">Nom</label>
                <input 
                  type="text" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-transparent border-b border-foreground/10 py-2 outline-none focus:border-accent transition-colors text-sm font-light"
                  placeholder="Votre nom"
                />
              </div>
            </div>

            {isArtist && (
              <div className="space-y-1">
                <label className="text-[10px] font-medium text-foreground/60 uppercase tracking-widest">Nom d'Artiste</label>
                <input 
                  type="text" 
                  value={artistName}
                  onChange={(e) => setArtistName(e.target.value)}
                  className="w-full bg-transparent border-b border-foreground/10 py-2 outline-none focus:border-accent transition-colors text-sm font-light"
                  placeholder="Votre nom de scène"
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-medium text-foreground/60 uppercase tracking-widest">Bio / À propos</label>
              <textarea 
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full bg-foreground/5 border border-foreground/10 rounded-lg p-3 outline-none focus:border-accent transition-colors text-sm font-light resize-none"
                placeholder={isArtist ? "Parlez-nous de votre style, vos inspirations..." : "Amateur d'art, collectionneur..."}
              />
              <p className="text-[10px] text-right text-foreground/40 italic">
                {isArtist ? "Mettez en avant votre univers artistique." : "Partagez votre passion pour l'art."}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 flex gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-foreground/20 rounded-lg text-sm font-medium hover:bg-foreground/5 transition-colors"
            >
              Annuler
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 py-3 px-4 bg-accent text-white rounded-lg text-sm font-bold shadow hover:bg-accent/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enregistrer"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
