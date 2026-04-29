import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { NavigationProgress } from "@/components/layout/NavigationProgress";
import { Suspense } from "react";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YowPainter | Marketplace d'Art Moderne",
  description: "Découvrez des pépites artistiques et des chefs-d'œuvre contemporains.",
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className={`${inter.variable} ${playfair.variable} font-sans canvas-grain antialiased bg-background text-foreground overflow-x-hidden`}>
        <ThemeProvider>
          <QueryProvider>
            <Suspense fallback={null}>
              <NavigationProgress />
            </Suspense>
            {children}
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: 'var(--background)',
                  color: 'var(--foreground)',
                  border: '1px solid color-mix(in srgb, var(--foreground) 10%, transparent)',
                  borderRadius: '12px',
                  fontFamily: 'var(--font-inter)',
                  fontSize: '13px',
                },
              }}
              richColors
            />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
