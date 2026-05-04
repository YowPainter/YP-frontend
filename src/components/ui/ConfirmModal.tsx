"use client";

import { X, AlertTriangle, Loader2 } from "lucide-react";
import { useEffect } from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "info";
  isLoading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  variant = "danger",
  isLoading = false,
}: ConfirmModalProps) {
  
  // Prevent scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const variantStyles = {
    danger: "bg-red-500 text-white hover:bg-red-600 shadow-red-500/20",
    warning: "bg-amber-500 text-white hover:bg-amber-600 shadow-amber-500/20",
    info: "bg-ink text-white hover:bg-accent shadow-ink/20",
  };

  const iconStyles = {
    danger: "text-red-500 bg-red-500/10",
    warning: "text-amber-500 bg-amber-500/10",
    info: "text-accent bg-accent/10",
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-background w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-200">
        <div className="p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${iconStyles[variant]}`}>
              <AlertTriangle size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                {title}
              </h3>
              <p className="text-sm text-foreground/60 leading-relaxed font-light">
                {message}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-8">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest text-foreground/60 hover:bg-foreground/5 transition-colors"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg transition-all flex items-center gap-2 ${variantStyles[variant]}`}
            >
              {isLoading && <Loader2 size={14} className="animate-spin" />}
              {confirmLabel}
            </button>
          </div>
        </div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-foreground/20 hover:text-foreground transition-colors"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
