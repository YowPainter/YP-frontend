import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import RevealProvider from "@/components/providers/RevealProvider";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

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
          <RevealProvider>
            <main className="min-h-screen relative z-10">
              {children}
            </main>
          </RevealProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
