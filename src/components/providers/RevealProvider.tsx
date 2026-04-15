"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function RevealProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // 1. Initialisation de l'IntersectionObserver
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-active");
          observerRef.current?.unobserve(entry.target);
        }
      });
    };

    observerRef.current = new IntersectionObserver(handleIntersect, observerOptions);

    // 2. Fonction de scan ultra-robuste
    const scanAndObserve = () => {
      const elements = document.querySelectorAll(".reveal:not(.reveal-active)");
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        // Plus permissif : si l'élément est dans la zone visible ou juste en dessous (marge de 100px)
        if (rect.top < window.innerHeight + 100) {
          el.classList.add("reveal-active");
        } else {
          observerRef.current?.observe(el);
        }
      });
    };

    // 3. MutationObserver
    const mutationObserver = new MutationObserver(() => scanAndObserve());
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    // 4. Écouteurs d'événements globaux pour les cas limites (Back button, scroll, etc.)
    window.addEventListener("scroll", scanAndObserve, { passive: true });
    window.addEventListener("popstate", scanAndObserve);
    window.addEventListener("pageshow", scanAndObserve); // Pour le cache BF (Back-Forward)

    // Scan immédiat + un petit délai de sécurité
    scanAndObserve();
    const safetyTimer = setTimeout(scanAndObserve, 500);

    return () => {
      observerRef.current?.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener("scroll", scanAndObserve);
      window.removeEventListener("popstate", scanAndObserve);
      window.removeEventListener("pageshow", scanAndObserve);
      clearTimeout(safetyTimer);
    };
  }, [pathname]);

  return <>{children}</>;
}


