"use client";

import { useWeatherTheme } from "@/context/WeatherThemeContext";
import { cn } from "@/lib/utils";

export function ThemeWrapper({ children }: { children: React.ReactNode }) {
    const { gradient } = useWeatherTheme();

    return (
        <div className="relative min-h-screen bg-[#0A0A0F] transition-colors duration-1000 ease-in-out">
            {/* Dynamic Background Gradient */}
            <div
                className={cn(
                    "fixed inset-0 bg-gradient-to-br opacity-50 transition-all duration-1000 ease-in-out pointer-events-none",
                    gradient
                )}
            />



            {/* CSS-only Grain Fallback */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.02] mix-blend-overlay"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }}
            />

            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}
