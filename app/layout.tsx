import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["200", "300", "400", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "HIMRRA | Pure Himalayan Shilajit Gold Resin",
  description:
    "Experience the world's most potent mineral resin. Harvested at 18,000ft, HIMRRA is the gold standard of Himalayan Shilajit.",
  keywords: ["shilajit", "himalayan", "mineral resin", "fulvic acid", "wellness"],
  openGraph: {
    title: "HIMRRA | Pure Himalayan Shilajit",
    description: "Harvested at 18,000ft. Cold-filtered over 60 days.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#F9F7F2]">{children}</body>
    </html>
  );
}
