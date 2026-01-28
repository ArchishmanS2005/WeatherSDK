"use client";

import { motion } from "framer-motion";
import { Eye, Gauge, Thermometer, Sunrise } from "lucide-react";
import { cn } from "@/lib/utils";
import { HourlyForecastChart } from "./HourlyForecastChart";

interface HighlightGridProps {
    weather: any;
    hourly: any[];
}

export function HighlightGrid({ weather, hourly }: HighlightGridProps) {
    const highlights = [
        {
            label: "Feels Like",
            value: `${Math.round(weather?.current?.apparent_temperature || 25)}°`,
            icon: Thermometer,
            desc: "Similar to actual temp",
            color: "text-amber-400"
        },
        {
            label: "Visibility",
            value: `${(weather?.current?.visibility || 10000) / 1000} km`, // API returns meters
            icon: Eye,
            desc: "Perfect visibility",
            color: "text-emerald-400"
        },
        {
            label: "Pressure",
            value: `${weather?.current?.pressure || 1012} hPa`,
            icon: Gauge,
            desc: "Stable atmospheric pressure",
            color: "text-blue-400"
        },
        {
            label: "Sunrise",
            value: weather?.daily?.sunrise?.[0] ? new Date(weather.daily.sunrise[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "06:00 AM",
            icon: Sunrise,
            desc: `Sunset at ${weather?.daily?.sunset?.[0] ? new Date(weather.daily.sunset[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "18:00 PM"}`,
            color: "text-orange-400"
        },
    ];

    return (
        <div className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
            {highlights.map((item, idx) => (
                <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group relative rounded-3xl bg-[#0A0A0F]/40 backdrop-blur-xl border border-white/5 p-6 hover:bg-white/5 transition-all duration-300"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative z-10 flex justify-between items-start mb-4">
                        <div className={cn("p-3 rounded-2xl bg-white/5", item.color)}>
                            <item.icon className="w-6 h-6" />
                        </div>
                        <span className="text-2xl font-bold text-white font-outfit">{item.value}</span>
                    </div>

                    <div className="relative z-10">
                        <h3 className="text-zinc-300 font-medium mb-1">{item.label}</h3>
                        <p className="text-xs text-zinc-500">{item.desc}</p>
                    </div>
                </motion.div>
            ))}

            {/* Mini Chart Placeholder (can be expanded later) */}
            <motion.div
                className="col-span-1 md:col-span-2 relative rounded-3xl bg-[#0A0A0F]/40 backdrop-blur-xl border border-white/5 p-6 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <div className="absolute top-0 right-0 p-32 bg-indigo-600/10 blur-[80px] rounded-full pointer-events-none" />
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <h3 className="text-white font-semibold">Hourly Forecast</h3>
                        <p className="text-xs text-zinc-500">Upcoming weather changes</p>
                    </div>
                </div>
                <HourlyForecastChart data={hourly} />
            </motion.div>
        </div>
    );
}
