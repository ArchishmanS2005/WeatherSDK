"use client";

import { motion } from "framer-motion";
import { Cloud, Droplets, Wind, Gauge, Eye, Sun } from "lucide-react";
import { CurrentWeather } from "@/lib/api";
import { ScrollReveal } from "@/components/animations/scroll-reveal";

interface CurrentWeatherCardProps {
    weather: CurrentWeather;
    locationName: string;
    units: {
        temperature: string;
        wind_speed: string;
        pressure: string;
    };
}

export function CurrentWeatherCard({ weather, locationName, units }: CurrentWeatherCardProps) {
    const metrics = [
        {
            icon: Droplets,
            label: "Humidity",
            value: `${weather.humidity}%`,
        },
        {
            icon: Wind,
            label: "Wind Speed",
            value: `${Math.round(weather.wind_speed)} ${units.wind_speed}`,
        },
        {
            icon: Gauge,
            label: "Pressure",
            value: `${Math.round(weather.pressure)} ${units.pressure}`,
        },
        {
            icon: Cloud,
            label: "Cloud Cover",
            value: `${weather.cloud_cover}%`,
        },
        {
            icon: Eye,
            label: "Visibility",
            value: weather.visibility ? `${(weather.visibility / 1000).toFixed(1)} km` : "N/A",
        },
        {
            icon: Sun,
            label: "UV Index",
            value: weather.uv_index ? weather.uv_index.toFixed(1) : "N/A",
        },
    ];

    return (
        <section className="px-4 py-16">
            <div className="max-w-6xl mx-auto">
                <ScrollReveal>
                    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-black dark:to-gray-950 border-2 border-border rounded-3xl p-8 md:p-12 shadow-2xl">
                        {/* Location & Time */}
                        <div className="mb-8">
                            <h2 className="text-3xl md:text-4xl font-bold mb-2">{locationName}</h2>
                            <p className="text-muted-foreground">
                                {new Date(weather.time).toLocaleString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </p>
                        </div>

                        {/* Main Temperature Display */}
                        <div className="flex items-start justify-between mb-12">
                            <div>
                                <motion.div
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="text-8xl md:text-9xl font-black mb-4"
                                >
                                    {Math.round(weather.temperature)}°
                                </motion.div>
                                <div className="text-2xl md:text-3xl font-light text-muted-foreground mb-2">
                                    {weather.weather_description}
                                </div>
                                <div className="text-lg text-muted-foreground">
                                    Feels like {Math.round(weather.apparent_temperature)}°
                                </div>
                            </div>

                            <div className="text-6xl md:text-7xl">
                                {getWeatherEmoji(weather.weather_code)}
                            </div>
                        </div>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                            {metrics.map((metric, index) => (
                                <ScrollReveal key={metric.label} delay={index * 0.1}>
                                    <div className="bg-white dark:bg-black border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow">
                                        <div className="flex items-center gap-3 mb-2">
                                            <metric.icon className="w-5 h-5 text-muted-foreground" />
                                            <span className="text-sm font-medium text-muted-foreground">
                                                {metric.label}
                                            </span>
                                        </div>
                                        <div className="text-2xl font-bold">{metric.value}</div>
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
}

function getWeatherEmoji(code: number): string {
    const emojiMap: { [key: number]: string } = {
        0: '☀️',
        1: '🌤️',
        2: '⛅',
        3: '☁️',
        45: '🌫️',
        48: '🌫️',
        51: '🌦️',
        53: '🌦️',
        55: '🌦️',
        61: '🌧️',
        63: '🌧️',
        65: '🌧️',
        71: '🌨️',
        73: '🌨️',
        75: '🌨️',
        80: '🌦️',
        81: '🌧️',
        82: '⛈️',
        95: '⛈️',
        96: '⛈️',
        99: '⛈️',
    };
    return emojiMap[code] || '🌤️';
}
