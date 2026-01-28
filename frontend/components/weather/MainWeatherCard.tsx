"use client";

import { motion } from "framer-motion";
import { CloudRain, Navigation, Calendar, Droplets, Wind, Sun } from "lucide-react";

interface MainWeatherCardProps {
    weather: any; // Using any for now, ideally strictly typed interface
    city: string;
}

export function MainWeatherCard({ weather, city }: MainWeatherCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="col-span-12 lg:col-span-4 h-full min-h-[400px]"
        >
            <div className="relative h-full rounded-3xl overflow-hidden p-8 flex flex-col justify-between group">

                {/* Glass Background with gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-2xl z-0" />
                <div className="absolute inset-0 border border-white/10 rounded-3xl z-10" />

                {/* Animated Glows */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/30 rounded-full blur-[80px] group-hover:bg-blue-500/40 transition-colors duration-500" />

                {/* Top Section: Location & Date */}
                <div className="relative z-20 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 text-zinc-300 mb-1">
                            <Navigation className="w-4 h-4 text-blue-400" />
                            <span className="font-medium tracking-wide text-sm">Current Location</span>
                        </div>
                        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 font-outfit">
                            {city}
                        </h2>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md rounded-xl px-4 py-2 border border-white/10 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-zinc-400" />
                        <span className="text-sm font-medium text-zinc-200">Today</span>
                    </div>
                </div>

                {/* Middle Section: Big Temperature & Icon */}
                <div className="relative z-20 flex flex-col items-center justify-center my-8">
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    >
                        {/* Placeholder Icon - logic to switch based on weather needed */}
                        <CloudRain className="w-32 h-32 text-blue-200 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                    </motion.div>
                    <h1 className="text-8xl font-bold text-white tracking-tighter mt-4 font-outfit">
                        {Math.round(weather?.current?.temperature || 23)}°
                    </h1>
                    <p className="text-xl text-blue-200 font-medium mt-2">
                        {weather?.current?.weather_description || "Clear Sky"}
                    </p>
                </div>

                {/* Bottom Details Grid */}
                <div className="relative z-20 grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
                    <div className="flex flex-col items-center gap-1">
                        <Wind className="w-5 h-5 text-zinc-400 mb-1" />
                        <span className="text-sm font-semibold text-white">{weather?.current?.wind_speed} km/h</span>
                        <span className="text-[10px] text-zinc-400 uppercase tracking-wider">Wind</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 border-l border-r border-white/5">
                        <Droplets className="w-5 h-5 text-zinc-400 mb-1" />
                        <span className="text-sm font-semibold text-white">{weather?.current?.humidity}%</span>
                        <span className="text-[10px] text-zinc-400 uppercase tracking-wider">Humidity</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <Sun className="w-5 h-5 text-zinc-400 mb-1" />
                        <span className="text-sm font-semibold text-white">{weather?.current?.uv_index || 0} Index</span>
                        <span className="text-[10px] text-zinc-400 uppercase tracking-wider">UV Index</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
