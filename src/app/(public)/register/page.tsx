"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatedBlob } from "@/components/ui/AnimatedBlob";
import { useAuthStore, getDashboardRoute } from "@/store/authStore";
import { OpenAPI } from "@/lib/core/OpenAPI";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { BuyerProfileService } from "@/lib/services/BuyerProfileService";
import { ArtistsService } from "@/lib/services/ArtistsService";
import { RegisterRequest } from "@/lib/models/RegisterRequest";
import { slugify } from "@/lib/utils";
import { Eye, EyeOff, Loader2, Camera, X } from "lucide-react";
import { getApiErrorMessage } from "@/lib/api-error-handler";

export default function RegisterPage() {
  const router = useRouter();
  const register = useAuthStore((state) => state.register);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [role, setRole] = useState<"COLLECTOR" | "ARTIST">("COLLECTOR");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    artistName: "",
  });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      let avatarUrl = "";
      if (avatar) {
        try {
          avatarUrl = await uploadToCloudinary(avatar);
        } catch (uploadErr) {
          console.error("Cloudinary Upload Error:", uploadErr);
          throw new Error("Échec de l'envoi de l'image. Veuillez réessayer.");
        }
      }

      // Generation of the mandatory slug
      const nameForSlug = role === "ARTIST" 
        ? (formData.artistName || `${formData.firstName}-${formData.lastName}`)
        : `${formData.firstName}-${formData.lastName}`;
      
      const generatedSlug = slugify(nameForSlug) + "-" + Math.random().toString(36).substring(2, 7);

      const registerData: RegisterRequest = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: role === "ARTIST" ? RegisterRequest.role.ROLE_ARTIST : RegisterRequest.role.ROLE_BUYER,
        artistName: role === "ARTIST" ? (formData.artistName || `${formData.firstName} ${formData.lastName}`) : undefined,
        slug: generatedSlug,
        imageURL: avatarUrl, // Atomic: image URL sent during registration
      };

      console.log("Attempting registration with:", { ...registerData, password: '***' });
      
      let authResponse;
      try {
        authResponse = await register(registerData);
      } catch (regErr: any) {
        throw new Error(getApiErrorMessage(regErr));
      }

      // Final refresh to ensure dashboard has the latest data
      await useAuthStore.getState().refreshProfile();

      router.push(getDashboardRoute(authResponse.role));
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full canvas-texture canvas-grain overflow-hidden">
      
      {/* Côté Gauche: Visuel Artistique */}
      <div className="hidden lg:flex relative w-1/2 flex-col justify-between p-12 overflow-hidden bg-accent">
        {/* L'Image d'Art en arrière-plan */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/register-art.png" 
            alt="Vibrant Abstract Art" 
            fill 
            className="object-cover opacity-40 mix-blend-overlay transition-transform duration-[12s] hover:scale-110" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-accent via-transparent to-accent/40"></div>
        </div>

        <AnimatedBlob className="top-[-10%] right-[-10%] w-[45vw] h-[45vw]" color="slate" opacity={0.2} />

        <div className="relative z-10 flex items-center gap-4">
          <div className="w-8 h-8 bg-white rounded-full mb-1"></div>
          <span className="font-serif text-3xl font-medium tracking-tighter italic text-white">YowPainter</span>
        </div>

        <div className="relative z-10">
          <h2 className="font-serif text-6xl font-light leading-[1.1] tracking-tight mb-6 text-white">
            Devenez <br />
            <span className="italic font-normal">l'Avant-Garde.</span>
          </h2>
          <p className="text-xl text-white/70 max-w-md font-light leading-relaxed border-l border-white/30 pl-6 py-2">
            Que vous soyez créateur ou amateur de pépites, votre place est ici. Créez votre profil en quelques secondes et accédez à l'intégralité de la galerie.
          </p>
        </div>

        <div className="relative z-10 flex justify-between items-end border-t border-white/10 pt-8">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/40">Statut actuel</span>
            <span className="text-sm font-serif italic text-white/90">
              {role === "COLLECTOR" ? "Collectionneur d'Art" : "Artiste Contemporain"}
            </span>
          </div>
          <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/20">© 2024 Art Without Walls.</p>
        </div>
      </div>

      {/* Côté Droit: Formulaire d'inscription */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 sm:px-12 lg:px-20 relative py-20 overflow-y-auto">
        <div className="absolute top-0 right-0 w-64 h-64 text-accent/5 pointer-events-none -z-10">
           <svg viewBox="0 0 100 100" fill="currentColor"><circle cx="100" cy="0" r="100" /></svg>
        </div>
        <div className="absolute bottom-10 right-10 w-24 h-24 border border-accent/20 rounded-full animate-spin-slow pointer-events-none"></div>
        
        <div className="w-full max-w-md my-auto">
          <div className="mb-12">
            <h1 className="font-serif text-5xl font-medium mb-3 tracking-tight">Inscription.</h1>
            <p className="text-foreground/50 font-light italic">Commencer votre voyage artistique.</p>
          </div>

          <div className="flex gap-4 mb-12 p-1 bg-foreground/5 rounded-full">
            <button 
              onClick={() => setRole("COLLECTOR")}
              className={`flex-1 py-3 px-6 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-500 ${role === "COLLECTOR" ? "bg-foreground text-background shadow-lg" : "text-foreground/40 hover:text-foreground"}`}
            >
              Collectionneur
            </button>
            <button 
              onClick={() => setRole("ARTIST")}
              className={`flex-1 py-3 px-6 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-500 ${role === "ARTIST" ? "bg-accent text-white shadow-lg" : "text-foreground/40 hover:text-foreground"}`}
            >
              Artiste
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs uppercase tracking-widest font-bold">
                {error}
              </div>
            )}

            {/* Avatar Upload */}
            <div className="flex flex-col items-center gap-4 mb-8">
              <div className="relative group">
                <div className="relative w-32 h-32 rounded-full border-2 border-dashed border-foreground/10 flex items-center justify-center overflow-hidden bg-foreground/5 transition-all group-hover:border-accent">
                  {avatarPreview ? (
                    <Image src={avatarPreview} alt="Preview" fill className="object-cover" />
                  ) : (
                    <Camera className="text-foreground/20 group-hover:text-accent transition-colors" size={40} />
                  )}
                </div>
                {avatarPreview ? (
                  <button 
                    type="button"
                    onClick={removeAvatar}
                    className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full p-1 shadow-lg hover:scale-110 transition-transform"
                  >
                    <X size={16} />
                  </button>
                ) : (
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 bg-accent text-white rounded-full p-2 shadow-lg hover:scale-110 transition-transform"
                  >
                    <Camera size={16} />
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
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/30">Photo de profil</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2 group">
                <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-foreground/40 group-focus-within:text-accent transition-colors px-4">Prénom</label>
                <input 
                    type="text" 
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full bg-transparent border-b border-foreground/10 py-3 px-4 outline-none focus:border-accent transition-all text-lg font-light tracking-tight" 
                />
              </div>
              <div className="space-y-2 group">
                <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-foreground/40 group-focus-within:text-accent transition-colors px-4">Nom</label>
                <input 
                    type="text" 
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full bg-transparent border-b border-foreground/10 py-3 px-4 outline-none focus:border-accent transition-all text-lg font-light tracking-tight" 
                />
              </div>
            </div>

            {role === "ARTIST" && (
              <div className="space-y-2 group">
                <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-foreground/40 group-focus-within:text-accent transition-colors px-4">Nom d'Artiste</label>
                <input 
                    type="text" 
                    required={role === "ARTIST"}
                    value={formData.artistName}
                    onChange={(e) => setFormData({...formData, artistName: e.target.value})}
                    placeholder="Votre pseudonyme créatif"
                    className="w-full bg-transparent border-b border-foreground/10 py-3 px-4 outline-none focus:border-accent transition-all text-lg font-light tracking-tight placeholder:text-foreground/5" 
                />
              </div>
            )}

            <div className="space-y-2 group">
              <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-foreground/40 group-focus-within:text-accent transition-colors px-4">Adresse Email</label>
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="nom@exemple.com" 
                className="w-full bg-transparent border-b border-foreground/10 py-3 px-4 outline-none focus:border-accent transition-all text-lg font-light tracking-tight placeholder:text-foreground/5" 
              />
            </div>

            <div className="space-y-2 group relative">
              <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-foreground/40 group-focus-within:text-accent transition-colors px-4">Mot de passe</label>
              <div className="relative">
                <input 
                    type={showPassword ? "text" : "password"} 
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="••••••••" 
                    className="w-full bg-transparent border-b border-foreground/10 py-3 px-4 pr-12 outline-none focus:border-accent transition-all text-lg font-light tracking-tight placeholder:text-foreground/5" 
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/20 hover:text-accent transition-all"
                >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="pt-8">
              <button 
                disabled={loading}
                className={`w-full py-5 px-8 text-xs uppercase tracking-[0.4em] font-bold text-white transition-all duration-500 shadow-xl group flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed ${role === 'COLLECTOR' ? 'bg-foreground hover:bg-black' : 'bg-accent hover:opacity-90'}`}
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    Créer mon compte
                    <span className="text-xl transition-transform group-hover:translate-x-2">&rarr;</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-12 text-center">
            <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-foreground/30 mb-8">
              En vous inscrivant, vous acceptez nos <Link href="#" className="underline">Conditions d'Utilisation</Link>.
            </p>
            <p className="text-foreground/40 font-light italic">
              Déjà un compte ? <Link href="/login" className="text-accent font-bold not-italic hover:underline ml-2">Connectez-vous</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
