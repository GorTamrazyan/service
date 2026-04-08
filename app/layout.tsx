import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "./contexts/LanguageContext";
import { CartProvider } from "./client/context/CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://oniksvinyl.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ONIK'S VINYL",
    template: "%s | ONIK'S VINYL",
  },
  description:
    "ONIK'S VINYL — premium custom vinyl fencing, gates, and installation services. 15+ years of experience, 10,000+ projects completed. Free quotes available.",
  keywords: ["vinyl fence", "vinyl fencing", "custom fence", "fence installation", "vinyl gates", "ONIK'S VINYL"],
  authors: [{ name: "ONIK'S VINYL", url: SITE_URL }],
  openGraph: {
    type: "website",
    siteName: "ONIK'S VINYL",
    url: SITE_URL,
    title: "ONIK'S VINYL — Premium Custom Vinyl Fencing",
    description:
      "Premium custom vinyl fencing, gates, and installation services. 15+ years of experience. Free quotes available.",
    images: [{ url: "/images/oniks_vinyl_text.png", width: 1200, height: 630, alt: "ONIK'S VINYL" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ONIK'S VINYL — Premium Custom Vinyl Fencing",
    description: "Premium custom vinyl fencing, gates, and installation services. Free quotes available.",
    images: ["/images/oniks_vinyl_text.png"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: SITE_URL },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
          <body
              className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[var(--color-background)] text-[var(--color-text)]`}
          >
              <LanguageProvider storageKey="preferred-language-client">
                  <CartProvider>
                      <main>{children}</main>
                  </CartProvider>
              </LanguageProvider>
          </body>
      </html>
  );
}
