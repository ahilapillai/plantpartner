import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  style: ["normal", "italic"],
  weight: ["400", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm",
  weight: ["200", "300", "400", "500", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LeafLens — AI Plant Health Analyzer",
  description:
    "Upload a photo of your plant and get an instant AI-powered health report with tips, diagnoses, and curated product recommendations.",
  keywords: ["plant health", "AI", "plant care", "leaf diagnosis"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${dmSans.variable} bg-[#5e8557] font-dm`}
      >
        {children}
      </body>
    </html>
  );
}
