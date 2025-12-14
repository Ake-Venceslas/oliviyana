import type { Metadata } from "next";
import {
  ClerkProvider,
} from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ToastProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OLIVIYANA - Système de Gestion Hospitalière Moderne",
  description: "OLIVIYANA est une plateforme complète de gestion hospitalière qui facilite la prise de rendez-vous, le suivi médical, et la communication entre patients et médecins. Gérez vos consultations, prescriptions et dossiers médicaux en toute simplicité.",
  keywords: ["gestion hospitalière", "rendez-vous médical", "santé", "télémédecine", "dossier médical", "prescription en ligne"],
  authors: [{ name: "OLIVIYANA Team" }],
  openGraph: {
    title: "OLIVIYANA - Gestion Hospitalière Intelligente",
    description: "Plateforme moderne pour la gestion de vos rendez-vous médicaux, consultations et dossiers de santé. Simplifiez votre parcours de soins avec OLIVIYANA.",
    url: "https://oliviyana.com",
    siteName: "OLIVIYANA",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "OLIVIYANA - Système de Gestion Hospitalière",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OLIVIYANA - Gestion Hospitalière Moderne",
    description: "Simplifiez la gestion de vos soins de santé avec OLIVIYANA. Rendez-vous, consultations et suivi médical en un seul endroit.",
    images: ["/logo 2.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100`}
        >
          <ToastProvider />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
