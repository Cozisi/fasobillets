import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// On fusionne tout dans UN SEUL objet metadata
export const metadata: Metadata = {
  title: 'FasoBillets - Transport Burkina',
  description: 'Réservez vos tickets de bus au Burkina Faso en quelques clics.',
  manifest: '/manifest.json',
  themeColor: '#15803d',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  icons: {
    apple: '/icon-192x192.png', // Pour les iPhones
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr"> {/* J'ai changé "en" par "fr" pour le Burkina Faso */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}