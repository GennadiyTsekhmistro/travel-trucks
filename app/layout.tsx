import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./Providers";
import Header from "./Header";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TravelTrucks — Camper Rental",
    template: "%s | TravelTrucks",
  },
  description:
    "Find and rent your perfect camper with TravelTrucks. Explore campers, compare features, and book your next adventure.",
  keywords: [
    "TravelTrucks",
    "camper rental",
    "campervan",
    "motorhome rental",
    "travel",
  ],
  openGraph: {
    title: "TravelTrucks — Camper Rental",
    description:
      "Find and rent your perfect camper with TravelTrucks. Explore campers and plan your next adventure.",
    siteName: "TravelTrucks",
    type: "website",
  },
  // icons: {
  //    icon: "/logo.svg",
  // },
};
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable}`}>
      <body>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
