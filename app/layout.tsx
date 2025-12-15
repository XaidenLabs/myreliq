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
  title: "Myreliq | Proof-of-Work Portfolio",
  description:
    "Bring your entire proof-of-work journey into one shareable portfolio in minutes.",
};

import { SolanaProvider } from "@/components/providers/SolanaProvider";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${brandFont.variable} ${geistMono.variable} antialiased`}>
        <SolanaProvider>{children}</SolanaProvider>
        <Toaster richColors duration={3000} position="top-center" />
      </body>
    </html>
  );
}
