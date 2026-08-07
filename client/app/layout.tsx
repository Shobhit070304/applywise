import type { Metadata } from "next";
import { Newsreader, Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import JitterBackground from "@/components/ui/JitterBackground";

const newsreader = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ApplyWise — Intelligent Job Application & Career OS",
  description: "Accelerate your career search with AI-powered resume tailoring, application tracking, and automated job matching.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${inter.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col bg-zinc-950 text-zinc-100 font-sans selection:bg-amber-500/20 selection:text-amber-200"
        suppressHydrationWarning
      >
        <Providers>
          <JitterBackground />
          <div className="relative z-10 flex min-h-screen flex-col">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
