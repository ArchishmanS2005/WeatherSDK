"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type WeatherCondition = "Clear" | "Rain" | "Clouds" | "Storm" | "Snow" | "Default";

interface ThemeContextType {
    condition: WeatherCondition;
    setCondition: (c: WeatherCondition) => void;
    gradient: string;
}

const WeatherThemeContext = createContext<ThemeContextType | undefined>(undefined);

const gradients: Record<WeatherCondition, string> = {
    Clear: "from-orange-500/20 via-blue-900/20 to-[#0A0A0F]",
    Rain: "from-blue-600/20 via-slate-900/20 to-[#0A0A0F]",
    Clouds: "from-emerald-900/40 via-slate-900/20 to-[#0A0A0F]",
    Storm: "from-indigo-900/40 via-[#0A0A0F] to-[#0A0A0F]",
    Snow: "from-cyan-500/20 via-blue-950/30 to-[#0A0A0F]",
    Default: "from-blue-900/20 via-[#0A0A0F] to-[#0A0A0F]",
};

export function WeatherThemeProvider({ children }: { children: React.ReactNode }) {
    const [condition, setCondition] = useState<WeatherCondition>("Default");

    // Logic to determine gradient based on condition
    const gradient = gradients[condition] || gradients["Default"];

    return (
        <WeatherThemeContext.Provider value={{ condition, setCondition, gradient }}>
            {children}
        </WeatherThemeContext.Provider>
    );
}

export function useWeatherTheme() {
    const context = useContext(WeatherThemeContext);
    if (!context) throw new Error("useWeatherTheme must be used within provider");
    return context;
}
