"use client";

import { motion } from "framer-motion";
import { Cloud, CloudRain, Sun, CloudLightning, CloudSnow, CloudFog, CloudDrizzle } from "lucide-react";

interface ForecastListProps {
    daily?: {
        time: string[];
        temperature_max: number[];
        temperature_min: number[];
        weather_code: number[];
    };
}

export function ForecastList({ daily }: ForecastListProps) {
    if (!daily) return null;

    // Helper to map WMO code to Lucide Icon & Color
    const getWeatherIcon = (code: number) => {
        if (code === 0 || code === 1) return { icon: Sun, color: "text-amber-400" };
        if (code === 2 || code === 3) return { icon: Cloud, color: "text-zinc-400" };
        if (code >= 45 && code <= 48) return { icon: CloudFog, color: "text-zinc-500" };
        if (code >= 51 && code <= 57) return { icon: CloudDrizzle, color: "text-cyan-400" };
        if (code >= 61 && code <= 82) return { icon: CloudRain, color: "text-blue-400" };
        if (code >= 71 && code <= 86) return { icon: CloudSnow, color: "text-white" };
        if (code >= 95) return { icon: CloudLightning, color: "text-violet-400" };
        return { icon: Sun, color: "text-amber-400" };
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", { weekday: "short" });
    };

    return (
        <motion.div
            className="w-full overflow-x-auto no-scrollbar pb-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
        >
            <div className="flex gap-4 min-w-max">
                {daily.time.map((time, i) => {
                    const { icon: Icon, color } = getWeatherIcon(daily.weather_code[i]);
                    const maxTemp = Math.round(daily.temperature_max[i]);
                    const minTemp = Math.round(daily.temperature_min[i]);

                    return (
                        <div
                            key={time}
                            className="group flex flex-col items-center justify-between p-4 min-w-[100px] h-36 rounded-3xl bg-[#0A0A0F]/40 backdrop-blur-md border border-white/5 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                        >
                            <span className="text-zinc-400 text-sm font-medium">{formatDate(time)}</span>
                            <Icon className={`w-8 h-8 ${color} drop-shadow-lg`} />
                            <div className="text-center">
                                <span className="text-white font-bold text-lg">{maxTemp}°</span>
                                <span className="text-zinc-500 text-xs block">{minTemp}°</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
}
