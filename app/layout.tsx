import AnalyticsTracker from "@/components/public/Analyticstracker ";
import type { Metadata } from "next";
import { JetBrains_Mono, Syne } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Ogunwe Debo — Full Stack Developer | Portfolio",
  description: "I build fast, scalable, production-ready web applications — from pixel-perfect UIs to robust backend systems.",

  // description:
  //   "Full Stack Developer specialising in Next.js, TypeScript & Node.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${syne.variable} ${jetbrains.variable} font-sans antialiased`}
      >
        <AnalyticsTracker />
        {children}
      </body>
    </html>
  );
}
