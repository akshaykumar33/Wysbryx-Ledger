import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { ThemeAccentProvider } from "@/components/layout/ThemeAccentProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CmdKMenu } from "@/components/layout/CmdKMenu";
import { FloatingDock } from "@/components/layout/FloatingDock";
import { Toaster } from "sonner";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Wysbryx Intel | Engineering Performance Intelligence Platform",
  description:
    "A Series A-grade, data-driven engineering evaluation platform for executive leadership to evaluate engineering talent fairly, consistently, and transparently.",
  keywords: [
    "Engineering Evaluation",
    "Performance Intelligence",
    "Engineering Excellence",
    "Executive Governance",
    "Developer Growth",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geist.variable} ${inter.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen flex flex-col font-sans bg-neutral-50/60 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 selection:bg-primary selection:text-primary-foreground dark:selection:bg-primary dark:selection:text-primary-foreground pb-24 antialiased overflow-x-hidden w-full max-w-full">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <ThemeAccentProvider>
            <Navbar />
            <main className="flex-1 w-full">{children}</main>
            <Footer />
            <FloatingDock />
            <CmdKMenu />
            <Toaster position="bottom-right" theme="system" richColors closeButton />
          </ThemeAccentProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
