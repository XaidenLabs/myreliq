import type { Metadata } from "next";
import { Space_Grotesk, Geist_Mono } from "next/font/google";
import "./globals.css";

const brandFont = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-brand",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://myreliq.com'),
  title: {
    default: "Myreliq | Proof-of-Work Portfolio",
    template: "%s | Myreliq"
  },
  description: "Bring your entire proof-of-work journey into one shareable portfolio in minutes.",
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://myreliq.com',
    siteName: 'Myreliq',
    title: 'Myreliq | Proof-of-Work Portfolio',
    description: 'Bring your entire proof-of-work journey into one shareable portfolio in minutes.',
    images: [
      {
        url: '/og-image.jpg', // Ensure this file exists or replace with a real one
        width: 1200,
        height: 630,
        alt: 'Myreliq Platform Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Myreliq | Proof-of-Work Portfolio',
    description: 'Showcase your career journey with verifiable proof of work.',
    creator: '@myreliq',
  },
  alternates: {
    canonical: './',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

import { SolanaProvider } from "@/components/providers/SolanaProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "sonner";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${brandFont.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SolanaProvider>{children}</SolanaProvider>
          <Toaster richColors duration={3000} position="top-center" />
          {process.env.NEXT_PUBLIC_GA_ID && (
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
