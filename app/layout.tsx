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
  metadataBase: new URL('https://www.myreliq.fun'),
  title: {
    default: "Myreliq | Proof-of-Work Portfolio",
    template: "%s | Myreliq"
  },
  description: "Bring your entire proof-of-work journey into one shareable portfolio in minutes.",
  keywords: [
    "Myreliq", "Portfolio", "Proof of Work", "Career Journey", "CV", "Resume",
    "Web3 Portfolio", "Blockchain Career", "Crypto Resume", "Digital Identity", "On-chain Resume",
    "Solana", "Solana Portfolio", "Solana Ecosystem", "Phantom Wallet", "Solflare", "Wallet Connect",
    "Developer Portfolio", "Designer Portfolio", "Professional Profile", "Software Engineer",
    "Product Designer", "Product Manager", "Africa Tech", "Tech Talent",
    "Web3 Identity", "Decentralized Identity", "NFT", "Blockchain", "Crypto", "DApp", "Smart Contracts", "DeFi",
    "Job Search", "Hiring", "Talent", "Recruitment", "Remote Work", "Tech Jobs", "Blockchain Jobs", "Crypto Jobs", "Freelance",
    "Achievements", "Skills", "Verification", "Trust", "Professional Network", "Career Growth",
    "Work History", "Projects", "Case Studies", "Startup", "Innovation", "Technology"
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.myreliq.fun',
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
