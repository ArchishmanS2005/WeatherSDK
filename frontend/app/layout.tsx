import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { WeatherThemeProvider } from "@/context/WeatherThemeContext";
import { LocationProvider } from "@/context/LocationContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Adiyogi - Nano Weather Pro",
  description: "Advanced weather analytics with Nano Banana Pro design",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${outfit.variable}`}>
      <body className="antialiased bg-[#0A0A0F] text-white selection:bg-orange-500/30">
        <WeatherThemeProvider>
          <LocationProvider>
            {children}
          </LocationProvider>
        </WeatherThemeProvider>
      </body>
    </html>
  );
}
